import { create } from "zustand";
import { nanoid } from "nanoid/non-secure";
import { stepSimulation } from "@/lib/engine";
import { vec, type Alert, type SimulationSettings, type SimulationState, type Uav, type World } from "@/lib/types";

function randomBetween(min: number, max: number) { return Math.random() * (max - min) + min; }

function generateInitialUavs(count: number, world: World, maxSpeed: number): Uav[] {
  const half = world.sizeMeters / 2;
  const out: Uav[] = [];
  for (let i = 0; i < count; i++) {
    const id = `UAV-${i + 1}`;
    const position = { x: randomBetween(-half * 0.8, half * 0.8), y: randomBetween(-half * 0.8, half * 0.8), z: randomBetween(30, Math.min(120, world.heightMeters)) };
    const direction = vec(randomBetween(-1, 1), randomBetween(-1, 1), randomBetween(-0.1, 0.1));
    const velocity = { x: direction.x * maxSpeed * 0.7, y: direction.y * maxSpeed * 0.7, z: direction.z * maxSpeed * 0.2 };
    out.push({ id, position, velocity, radius: 5, maxSpeed, color: `hsl(${Math.floor((i / count) * 360)}, 70%, 55%)` });
  }
  return out;
}

function defaultWorld(): World {
  const sizeMeters = 2000;
  return {
    sizeMeters,
    heightMeters: 300,
    restrictedZones: [
      {
        id: "Z1",
        name: "No-Fly Central",
        polygon: [vec(-200, -200, 0), vec(200, -200, 0), vec(200, 200, 0), vec(-200, 200, 0)],
      },
      {
        id: "Z2",
        name: "Runway",
        polygon: [vec(-600, 300, 0), vec(600, 300, 0), vec(600, 450, 0), vec(-600, 450, 0)],
      },
    ],
  };
}

const defaultSettings: SimulationSettings = {
  numUavs: 18,
  timeStepMs: 50,
  lookaheadSeconds: 8,
  collisionThresholdMeters: 15,
  avoidanceStrength: 0.45,
  maxUavSpeed: 55,
};

type SimActions = {
  start: () => void;
  stop: () => void;
  reset: () => void;
  tick: (now: number) => void;
  tickDt: (dt: number) => void;
  pushAlerts: (alerts: Alert[]) => void;
  setSetting: <K extends keyof SimulationSettings>(key: K, value: SimulationSettings[K]) => void;
};

export const useSimStore = create<SimulationState & SimActions>((set, get) => ({
  world: defaultWorld(),
  uavs: [],
  alerts: [],
  running: false,
  settings: defaultSettings,
  lastTickAt: undefined,

  start: () => {
    const { running, uavs, settings, world } = get();
    if (running) return;
    const initializedUavs = uavs.length ? uavs : generateInitialUavs(settings.numUavs, world, settings.maxUavSpeed);
    set({ running: true, uavs: initializedUavs, lastTickAt: performance.now() });
  },
  stop: () => set({ running: false }),
  reset: () => set((state) => ({
    uavs: generateInitialUavs(state.settings.numUavs, state.world, state.settings.maxUavSpeed),
    alerts: [],
    lastTickAt: undefined,
  })),
  tick: (now: number) => {
    const { running, lastTickAt, settings, world, uavs } = get();
    if (!running) return;
    const dt = lastTickAt ? Math.min((now - lastTickAt) / 1000, 0.1) : settings.timeStepMs / 1000;
    const { uavs: next, alerts } = stepSimulation(uavs, dt, settings, world);
    set({ uavs: next, lastTickAt: now });
    if (alerts.length) get().pushAlerts(alerts);
  },
  tickDt: (dt: number) => {
    const { running, settings, world, uavs } = get();
    if (!running) return;
    const clamped = Math.min(Math.max(dt, 0), 0.1);
    const { uavs: next, alerts } = stepSimulation(uavs, clamped, settings, world);
    set({ uavs: next });
    if (alerts.length) get().pushAlerts(alerts);
  },
  pushAlerts: (alerts: Alert[]) => set((state) => ({ alerts: [...alerts, ...state.alerts].slice(0, 100) })),
  setSetting: (key, value) => set((state) => {
    const nextSettings = { ...state.settings, [key]: value } as SimulationSettings;
    // Live-apply certain settings
    let nextUavs = state.uavs;
    if (key === "numUavs") {
      const desired = value as number;
      if (desired > state.uavs.length) {
        const additional = generateInitialUavs(desired - state.uavs.length, state.world, state.settings.maxUavSpeed);
        nextUavs = [...state.uavs, ...additional];
      } else if (desired < state.uavs.length) {
        nextUavs = state.uavs.slice(0, desired);
      }
    }
    if (key === "maxUavSpeed") {
      const max = value as number;
      nextUavs = state.uavs.map((u) => ({ ...u, maxSpeed: max, velocity: {
        x: Math.max(Math.min(u.velocity.x, max), -max),
        y: Math.max(Math.min(u.velocity.y, max), -max),
        z: Math.max(Math.min(u.velocity.z, max), -max),
      }}));
    }
    return { settings: nextSettings, uavs: nextUavs };
  }),
}));


