"use client";

import { Scene3D } from "./Scene3D";
import { useSimStore } from "@/store/useSimStore";
import { motion, AnimatePresence } from "framer-motion";
import { AiPanel } from "./AiPanel";

export function Dashboard() {
  const { alerts, running, start, stop, reset, settings, setSetting, uavs } = useSimStore();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 w-full">
      <div className="lg:col-span-3 h-[70vh]">
        <Scene3D />
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
              <input type="range" min={5} max={60} value={settings.numUavs} onChange={(e) => setSetting("numUavs", Number(e.target.value))} className="w-full" />
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
        <AiPanel />
        <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 p-4 backdrop-blur h-[28vh] overflow-hidden">
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


