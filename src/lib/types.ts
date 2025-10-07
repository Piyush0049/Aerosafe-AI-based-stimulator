export type Vector3 = {
  x: number;
  y: number;
  z: number;
};

export type Uav = {
  id: string;
  position: Vector3; // meters
  velocity: Vector3; // meters/second
  maxSpeed: number; // m/s
  radius: number; // collision radius in meters
  color: string;
};

export type Polygon = Vector3[]; // z ignored for 2D geofencing

export type RestrictedZone = {
  id: string;
  name: string;
  polygon: Polygon;
};

export type World = {
  sizeMeters: number; // world is a square from -size/2..+size/2 on X and Y
  heightMeters: number;
  restrictedZones: RestrictedZone[];
};

export type CollisionRisk = {
  a: string;
  b: string;
  timeToClosest: number; // seconds
  closestDistance: number; // meters
};

export type Violation = {
  uavId: string;
  zoneId: string;
  point: Vector3;
};

export type Alert =
  | { type: "violation"; at: number; violation: Violation; message: string }
  | {
      type: "collision_risk";
      at: number;
      risk: CollisionRisk;
      message: string;
    }
  | { type: "reroute"; at: number; uavId: string; message: string };

export type SimulationSettings = {
  numUavs: number;
  timeStepMs: number;
  lookaheadSeconds: number;
  collisionThresholdMeters: number;
  avoidanceStrength: number; // 0..1 steering factor
  maxUavSpeed: number;
};

export type SimulationState = {
  world: World;
  uavs: Uav[];
  alerts: Alert[];
  running: boolean;
  settings: SimulationSettings;
  lastTickAt?: number;
};

export type SteeringCommand = {
  uavId: string;
  desiredVelocity: Vector3;
};

export function vec(x = 0, y = 0, z = 0): Vector3 {
  return { x, y, z };
}

export function add(a: Vector3, b: Vector3): Vector3 {
  return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z };
}

export function sub(a: Vector3, b: Vector3): Vector3 {
  return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
}

export function mul(a: Vector3, s: number): Vector3 {
  return { x: a.x * s, y: a.y * s, z: a.z * s };
}

export function length(a: Vector3): number {
  return Math.hypot(a.x, a.y, a.z);
}

export function normalize(a: Vector3): Vector3 {
  const L = length(a) || 1;
  return { x: a.x / L, y: a.y / L, z: a.z / L };
}

export function clampLength(a: Vector3, maxLen: number): Vector3 {
  const L = length(a);
  if (L <= maxLen) return a;
  return mul(normalize(a), maxLen);
}


