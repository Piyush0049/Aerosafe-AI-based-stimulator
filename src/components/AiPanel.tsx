"use client";

import { useState } from "react";
import { useSimStore } from "@/store/useSimStore";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
      {advice ? (
        <AdviceView advice={advice} />
      ) : (
        <div className="text-sm text-black/60 dark:text-white/60">Click analyze to get suggested actions.</div>
      )}
    </div>
  );
}
 
function AdviceView({ advice }: { advice: string }) {
  const parsed = parseAdvice(advice);
  if (!parsed) {
    return (
      <div className="prose prose-invert prose-sm max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{advice}</ReactMarkdown>
      </div>
    );
  }
  const { advisories, maneuvers, summary } = parsed;
  return (
    <div className="space-y-3 text-gray-400">
      {advisories.length > 0 && (
        <section className="rounded-lg border border-cyan-400/30 bg-cyan-500/10 p-3">
          <h3 className="text-sm font-semibold text-cyan-300 mb-2">Immediate Safety Advisories</h3>
          <ul className="space-y-1">
            {advisories.map((line, i) => (
              <li key={i} className="text-sm leading-snug bg-white/10 rounded-md px-2 mt-2 py-1 border border-white/10">
                {line}
              </li>
            ))}
          </ul>
        </section>
      )}
      {maneuvers.length > 0 && (
        <section className="rounded-lg border border-emerald-400/30 bg-emerald-500/10 p-3 mt-3">
          <h3 className="text-sm font-semibold text-emerald-300 mb-2">Suggested Heading / Altitude Changes</h3>
          <ul className="space-y-1">
            {maneuvers.map((line, i) => (
              <li key={i} className="text-sm leading-snug bg-white/10 rounded-md px-2 mt-2 py-1 border border-white/10">
                {line}
              </li>
            ))}
          </ul>
        </section>
      )}
      {summary && (
        <section className="rounded-lg border border-white/15 bg-white/5 p-3">
          <h3 className="text-sm font-semibold text-white/80 mb-2">Summary for Operator</h3>
          <p className="text-sm text-white/80 leading-relaxed">{summary}</p>
        </section>
      )}
    </div>
  );
}

function parseAdvice(text: string): null | { advisories: string[]; maneuvers: string[]; summary: string } {
  const getSection = (label: string) => {
    const pattern = new RegExp(`${label}\s*:?[\r\n]+([\s\S]*?)(?=\n\s*\w[^\n]*:|$)`, "i");
    const m = text.match(pattern);
    return m?.[1]?.trim() || "";
  };
  const adv = getSection("Immediate Safety Advisories");
  const man = getSection("Suggested Heading/Altitude Changes|Suggested Heading \\/ Altitude Changes|Suggested Maneuvers");
  const sum = getSection("Summary for Operator|Summary");
  if (!adv && !man && !sum) return null;
  const normalizeList = (s: string) => s
    .split(/\r?\n+/)
    .map((l) => l.replace(/^[-*\d.\)\s]+/, "").trim())
    .filter(Boolean);
  return {
    advisories: normalizeList(adv),
    maneuvers: normalizeList(man),
    summary: sum.replace(/^[-*\s]+/, ""),
  };
}


