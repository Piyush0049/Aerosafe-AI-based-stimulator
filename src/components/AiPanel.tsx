"use client";

import { useState } from "react";
import { useSimStore } from "@/store/useSimStore";

export function AiPanel() {
  const { uavs, world } = useSimStore();
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState<string | null>(null);

  const requestAdvice = async () => {
    setLoading(true);
    setAdvice(null);
    const res = await fetch("/api/ai/atc", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ uavs, zones: world.restrictedZones }) });
    const data = await res.json();
    setAdvice(data.advice || "No advice.");
    setLoading(false);
  };

  return (
    <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 p-4 backdrop-blur">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">AI ATC Insights</h2>
        <button onClick={requestAdvice} disabled={loading} className="px-3 py-1.5 rounded-md bg-cyan-600 text-white text-sm hover:bg-cyan-700 disabled:opacity-50">{loading ? "Analyzing…" : "Analyze airspace"}</button>
      </div>
      {advice ? <pre className="whitespace-pre-wrap text-sm text-black/80 dark:text-white/80">{advice}</pre> : <div className="text-sm text-black/60 dark:text-white/60">Click analyze to get suggested actions.</div>}
    </div>
  );
}


