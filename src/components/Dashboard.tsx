"use client";

import { Scene3D } from "./Scene3D";
import { useSimStore } from "@/store/useSimStore";
import { motion, AnimatePresence } from "framer-motion";
import { AiPanel } from "./AiPanel";
import { useState, useEffect } from "react"; // Import useEffect
import { Uav, Vector3 } from "@/lib/types";

// Helper to convert degrees to radians
const toRadians = (deg: number) => deg * (Math.PI / 180);
// Helper to convert radians to degrees
const toDegrees = (rad: number) => rad * (180 / Math.PI);

// Converts a Vector3 direction to Heading (Yaw) and Pitch in degrees
const vectorToHeadingPitch = (vector: Vector3) => {
  const magnitude = Math.sqrt(vector.x * vector.x + vector.y * vector.y + vector.z * vector.z);
  let normalizedX = vector.x;
  let normalizedY = vector.y;
  let normalizedZ = vector.z;

  if (magnitude > 0) {
    normalizedX /= magnitude;
    normalizedY /= magnitude;
    normalizedZ /= magnitude;
  }

  let headingRad = Math.atan2(normalizedX, normalizedZ);
  let headingDeg = toDegrees(headingRad);
  headingDeg = (headingDeg + 360) % 360; // Ensure 0-360

  let pitchRad = Math.atan2(-normalizedY, Math.sqrt(normalizedX * normalizedX + normalizedZ * normalizedZ));
  let pitchDeg = toDegrees(pitchRad);

  return { heading: headingDeg, pitch: pitchDeg };
};

// Converts Heading (Yaw) and Pitch in degrees to a normalized Vector3 direction
const headingPitchToVector = (heading: number, pitch: number): Vector3 => {
  const headingRad = toRadians(heading);
  const pitchRad = toRadians(pitch);

  const x = Math.sin(headingRad) * Math.cos(pitchRad);
  const y = -Math.sin(pitchRad);
  const z = Math.cos(headingRad) * Math.cos(pitchRad);

  const magnitude = Math.sqrt(x * x + y * y + z * z);
  if (magnitude === 0) {
    return { x: 0, y: 0, z: 0 };
  }
  return { x: x / magnitude, y: y / magnitude, z: z / magnitude };
};


function UavDetailsPanel({ uav, onBatteryChange, onDirectionChange, onClose }: { uav: Uav, onBatteryChange: (id: string, battery: number) => void, onDirectionChange: (id: string, direction: Vector3) => void, onClose: () => void }) {
  const [battery, setBattery] = useState(uav.battery);
  const [heading, setHeading] = useState(0); // State for heading in degrees
  const [pitch, setPitch] = useState(0);     // State for pitch in degrees

  // Synchronize internal heading/pitch state with uav.direction prop
  useEffect(() => {
    const { heading: newHeading, pitch: newPitch } = vectorToHeadingPitch(uav.direction);
    setHeading(newHeading);
    setPitch(newPitch);
  }, [uav.direction]); // Re-run when uav.direction changes

  const handleBatteryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newBattery = Number(e.target.value);
    setBattery(newBattery);
    onBatteryChange(uav.id, newBattery);
  };

  const handleHeadingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeading = Number(e.target.value);
    setHeading(newHeading);
    const newDirection = headingPitchToVector(newHeading, pitch);
    onDirectionChange(uav.id, newDirection);
  };

  const handlePitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPitch = Number(e.target.value);
    setPitch(newPitch);
    const newDirection = headingPitchToVector(heading, newPitch);
    onDirectionChange(uav.id, newDirection);
  };

  return (
    <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 p-4 backdrop-blur">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">UAV Details: {uav.id}</h2>
        <button onClick={onClose} className="px-3 py-1.5 rounded-md bg-slate-700 text-white text-sm hover:bg-slate-800 transition">Close</button>
      </div>
      <div className="space-y-3 text-sm">
        <div>
          <div className="text-xs uppercase text-black/60 dark:text-white/60">Color</div>
          <div style={{ backgroundColor: uav.color, width: '20px', height: '20px', borderRadius: '50%' }}></div>
        </div>
        <label className="space-y-1">
          <div className="text-xs uppercase text-black/60 dark:text-white/60">Battery (%)</div>
          <input type="range" min={0} max={100} value={battery} onChange={handleBatteryChange} className="w-full" />
          <div className="text-xs">{battery.toFixed(0)}%</div>
        </label>
        <div className="space-y-1">
          <div className="text-xs uppercase text-black/60 dark:text-white/60">Direction</div>
          <label>
            Heading (Yaw): <input type="number" min={0} max={360} value={heading.toFixed(0)} onChange={handleHeadingChange} className="w-full p-1 border rounded" />
          </label>
          <label>
            Pitch: <input type="number" min={-90} max={90} value={pitch.toFixed(0)} onChange={handlePitchChange} className="w-full p-1 border rounded" />
          </label>
        </div>
      </div>
    </div>
  );
}

export function Dashboard() {
  const { alerts, running, start, stop, reset, settings, setSetting, uavs, setUavBattery, setUavDirection } = useSimStore();
  const [selectedUavId, setSelectedUavId] = useState<string | null>(null);
  const selectedUav = uavs.find((u) => u.id === selectedUavId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 w-full">
      <div className="lg:col-span-3 h-[70vh]">
        <Scene3D />
        <AiPanel />
      </div>
      <div className="lg:col-span-2 space-y-6">
        <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 p-4 backdrop-blur">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Simulation Controls</h2>
            <div className="flex gap-2">
              <button onClick={running ? stop : start} className="px-3 py-1.5 rounded-md bg-emerald-600 text-white text-sm hover:bg-emerald-700 transition">
                {running ? "Pause" : "Start"}
              </button>
              <button onClick={reset} className="px-3 py-1.5 rounded-md bg-slate-700 text-white text-sm hover:bg-slate-800 transition">Reset</button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <label className="space-y-1">
              <div className="text-xs uppercase text-black/60 dark:text-white/60">UAVs</div>
              <input type="range" min={5} max={20} value={settings.numUavs} onChange={(e) => setSetting("numUavs", Number(e.target.value))} className="w-full" />
              <div className="text-xs">{settings.numUavs}</div>
            </label>
            <label className="space-y-1">
              <div className="text-xs uppercase text-black/60 dark:text-white/60">Max Speed (m/s)</div>
              <input type="range" min={20} max={120} step={1} value={settings.maxUavSpeed} onChange={(e) => setSetting("maxUavSpeed", Number(e.target.value))} className="w-full" />
              <div className="text-xs">{settings.maxUavSpeed}</div>
            </label>
            <label className="space-y-1">
              <div className="text-xs uppercase text-black/60 dark:text-white/60">Lookahead (s)</div>
              <input type="range" min={2} max={20} step={1} value={settings.lookaheadSeconds} onChange={(e) => setSetting("lookaheadSeconds", Number(e.target.value))} className="w-full" />
              <div className="text-xs">{settings.lookaheadSeconds}</div>
            </label>
            <label className="space-y-1">
              <div className="text-xs uppercase text-black/60 dark:text-white/60">Avoidance</div>
              <input type="range" min={0} max={1} step={0.05} value={settings.avoidanceStrength} onChange={(e) => setSetting("avoidanceStrength", Number(e.target.value))} className="w-full" />
              <div className="text-xs">{settings.avoidanceStrength.toFixed(2)}</div>
            </label>
          </div>
        </div>

        {selectedUav ? (
          <UavDetailsPanel
            uav={selectedUav}
            onBatteryChange={setUavBattery}
            onDirectionChange={setUavDirection}
            onClose={() => setSelectedUavId(null)}
          />
        ) : (
          <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 p-4 backdrop-blur h-[30vh] overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">UAVs ({uavs.length})</h2>
            </div>
            <div className="h-[calc(28vh-3rem)] overflow-y-auto pr-2 space-y-2">
              {uavs.map((u) => (
                <div
                  key={u.key}
                  onClick={() => setSelectedUavId(u.id)}
                  className="flex items-center justify-between p-2 rounded-md border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/10 cursor-pointer hover:bg-white/90 dark:hover:bg-white/20 transition"
                >
                  <div className="flex items-center gap-2">
                    <div style={{ backgroundColor: u.color, width: '15px', height: '15px', borderRadius: '50%' }}></div>
                    <span>{u.id}</span>
                  </div>
                  <span>Battery: {u.battery.toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 p-4 backdrop-blur h-[30vh] overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">AI Alerts</h2>
            <span className="text-xs text-black/60 dark:text-white/60">UAVs: {uavs.length}</span>
          </div>
          <div className="h-[calc(28vh-3rem)] overflow-y-auto pr-2 space-y-2">
            <AnimatePresence initial={false}>
              {alerts.map((a, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="text-sm rounded-md border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/10 p-2">
                  <div className="text-xs uppercase tracking-wide font-medium text-black/60 dark:text-white/60">{a.type.replace("_", " ")}</div>
                  <div>{"message" in a ? a.message : ""}</div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}


