import { add, clampLength, length, mul, normalize, sub, vec, type Alert, type CollisionRisk, type SimulationSettings, type Uav, type Vector3, type Violation, type World } from "./types";
import { isPointInPolygon } from "./geo";

export function predictClosestApproach(a: Uav, b: Uav): CollisionRisk {
  const relPos = sub(a.position, b.position);
  const relVel = sub(a.velocity, b.velocity);
  const relVelLen2 = relVel.x * relVel.x + relVel.y * relVel.y + relVel.z * relVel.z;
  // time to closest approach t* = - (r . v) / |v|^2
  const tStar = relVelLen2 === 0 ? 0 : -(relPos.x * relVel.x + relPos.y * relVel.y + relPos.z * relVel.z) / relVelLen2;
  const t = Math.max(0, tStar);
  const closest = add(relPos, mul(relVel, t));
  const dist = length(closest);
  return { a: a.id, b: b.id, timeToClosest: t, closestDistance: dist };
}

export function detectViolations(uavs: Uav[], world: World): Violation[] {
  const out: Violation[] = [];
  for (const u of uavs) {
    for (const zone of world.restrictedZones) {
      if (isPointInPolygon(u.position, zone.polygon)) {
        out.push({ uavId: u.id, zoneId: zone.id, point: u.position });
      }
    }
  }
  return out;
}

export function stepSimulation(uavs: Uav[], dtSec: number, settings: SimulationSettings, world: World): { uavs: Uav[]; alerts: Alert[] } {
  const alerts: Alert[] = [];

  // Predict collisions and build avoidance steering
  const avoidance: Record<string, Vector3> = {};
  for (let i = 0; i < uavs.length; i++) {
    for (let j = i + 1; j < uavs.length; j++) {
      const a = uavs[i];
      const b = uavs[j];
      const risk = predictClosestApproach(a, b);
      const combinedRadius = a.radius + b.radius + settings.collisionThresholdMeters;
      if (risk.timeToClosest <= settings.lookaheadSeconds && risk.closestDistance < combinedRadius) {
        alerts.push({ type: "collision_risk", at: performance.now(), risk, message: `Collision risk between ${a.id} and ${b.id} in ${risk.timeToClosest.toFixed(1)}s` });
        // Simple avoidance: steer away along gradient from predicted closest approach
        const rel = sub(add(a.position, mul(a.velocity, risk.timeToClosest)), add(b.position, mul(b.velocity, risk.timeToClosest)));
        const dir = normalize(rel);
        avoidance[a.id] = add(avoidance[a.id] ?? vec(), mul(dir, settings.avoidanceStrength));
        avoidance[b.id] = add(avoidance[b.id] ?? vec(), mul(mul(dir, -1), settings.avoidanceStrength));
      }
    }
  }

  // Integrate motion with steering and clamp speeds
  const nextUavs: Uav[] = uavs.map((u) => {
    // Battery drain
    const newBattery = Math.max(0, u.battery - dtSec * 0.5); // Drain 0.5% per second
    let newVelocity = u.velocity;
    let newDirection = u.direction;

    if (newBattery <= 0) {
      newVelocity = vec(0, 0, 0); // Stop UAV if battery is 0
    } else {
      const desired = add(u.velocity, avoidance[u.id] ?? vec());
      newVelocity = clampLength(desired, u.maxSpeed);
      newDirection = normalize(newVelocity); // Update direction based on new velocity
    }

    const nextPos = add(u.position, mul(newVelocity, dtSec));
    return { ...u, velocity: newVelocity, position: nextPos, battery: newBattery, direction: newDirection };
  });

  // Detect geofence violations
  const violations = detectViolations(nextUavs, world);
  for (const v of violations) {
    alerts.push({ type: "violation", at: performance.now(), violation: v, message: `UAV ${v.uavId} entered restricted zone ${v.zoneId}` });
  }

  // Naive reroute: if violation, steer outward by flipping Y velocity for a moment
  for (const v of violations) {
    const idx = nextUavs.findIndex((x) => x.id === v.uavId);
    if (idx >= 0) {
      const u = nextUavs[idx];
      nextUavs[idx] = { ...u, velocity: { ...u.velocity, y: -u.velocity.y } };
      alerts.push({ type: "reroute", at: performance.now(), uavId: v.uavId, message: `Emergency reroute issued to ${v.uavId}` });
    }
  }

  // Boundaries: keep inside world square
  const half = world.sizeMeters / 2;
  for (let i = 0; i < nextUavs.length; i++) {
    const u = nextUavs[i];
    let { x, y, z } = u.position;
    let { x: vx, y: vy, z: vz } = u.velocity;
    if (x < -half || x > half) { vx = -vx; x = Math.max(-half, Math.min(half, x)); }
    if (y < -half || y > half) { vy = -vy; y = Math.max(-half, Math.min(half, y)); }
    if (z < 0 || z > world.heightMeters) { vz = -vz; z = Math.max(0, Math.min(world.heightMeters, z)); }
    nextUavs[i] = { ...u, position: { x, y, z }, velocity: { x: vx, y: vy, z: vz } };
  }

  return { uavs: nextUavs, alerts };
}


