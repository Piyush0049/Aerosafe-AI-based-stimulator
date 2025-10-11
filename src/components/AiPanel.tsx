"use client";

import { useState } from "react";
import { useSimStore } from "@/store/useSimStore";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { AlertTriangle, Navigation, Info, Loader2 } from "lucide-react";

export function AiPanel() {
  const { uavs, world } = useSimStore();
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState<string | null>(null);

  const requestAdvice = async () => {
    setLoading(true);
    setAdvice(null);
    try {
      const res = await fetch("/api/ai/atc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uavs, zones: world.restrictedZones }),
      });
      const data = await res.json();
      setAdvice(data.advice || "No advice received from ATC system.");
    } catch (error) {
      console.log(error);
      setAdvice("Error: Unable to connect to ATC analysis system."); // The 'error' variable itself is not used, only its effect on setting advice.
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-b-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 p-4 backdrop-blur-sm shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
          <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            AI Air Traffic Control
          </h2>
        </div>
        <button
          onClick={requestAdvice}
          disabled={loading}
          className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-cyan-700 text-white text-xs font-medium hover:from-cyan-700 hover:to-cyan-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-1.5"
        >
          {loading ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Navigation className="w-3 h-3" />
              Analyze Airspace
            </>
          )}
        </button>
      </div>

      {advice ? (
        <AdviceView advice={advice} />
      ) : (
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center py-6 rounded-lg">
          <Info className="w-4 h-4 mx-auto mb-2 opacity-50" />
          Click &quot;Analyze Airspace&quot; to receive AI-powered traffic control recommendations
        </div>
      )}
    </div>
  );
}

function AdviceView({ advice }: { advice: string }) {
  const parsed = parseAdvice(advice);

  if (!parsed) {
    return (
      <div className="prose prose-sm prose-slate dark:prose-invert max-w-none">
        <div className="bg-white/50 dark:bg-white/5 rounded-lg p-3 border border-gray-200/50 dark:border-gray-700/50">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ children }) => <p className="text-sm leading-relaxed mb-2 last:mb-0">{children}</p>,
              strong: ({ children }) => <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{children}</span>,
              ul: ({ children }) => <ul className="text-sm space-y-1 mt-2">{children}</ul>,
              li: ({ children }) => <li className="flex items-start gap-1 text-sm"><span className="text-cyan-500 mt-0.5 text-sm">•</span><span className="flex-1">{children}</span></li>,
              h1: ({ children }) => <h1 className="text-lg font-bold mb-2">{children}</h1>,
              h2: ({ children }) => <h2 className="text-base font-bold mb-2">{children}</h2>,
              h3: ({ children }) => <h3 className="text-sm font-semibold mb-1">{children}</h3>,
              h4: ({ children }) => <h4 className="text-sm font-semibold mb-1">{children}</h4>,
              h5: ({ children }) => <h5 className="text-sm font-medium mb-1">{children}</h5>,
              h6: ({ children }) => <h6 className="text-sm font-medium mb-1">{children}</h6>,
              blockquote: ({ children }) => <blockquote className="text-sm border-l-2 border-gray-300 pl-3 italic">{children}</blockquote>,
              code: ({ children }) => <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded font-mono">{children}</code>,
              pre: ({ children }) => <pre className="text-sm bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-x-auto font-mono">{children}</pre>,
            }}
          >
            {advice}
          </ReactMarkdown>
        </div>
      </div>
    );
  }

  const { advisories, maneuvers, summary } = parsed;

  return (
    <div className="space-y-3">
      {/* Critical Safety Advisories */}
      {advisories.length > 0 && (
        <section className="rounded-lg border border-red-200/50 dark:border-red-800/30 bg-red-50/50 dark:bg-red-900/10 p-3">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
            <h3 className="text-sm font-semibold text-red-600 dark:text-red-400">
              Critical Safety Advisories
            </h3>
          </div>
          <div className="space-y-2">
            {advisories.map((item, i) => (
              <div
                key={i}
                className="bg-white/60 dark:bg-white/5 rounded-md p-2 border border-red-100/50 dark:border-red-800/20"
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({ children }) => <p className="text-sm leading-snug text-gray-800 dark:text-gray-200 mb-0">{children}</p>,
                    strong: ({ children }) => <span className="font-semibold text-red-700 dark:text-red-300 text-sm">{children}</span>,
                    ul: ({ children }) => <ul className="text-sm space-y-1">{children}</ul>,
                    li: ({ children }) => <li className="text-sm">{children}</li>,
                    code: ({ children }) => <code className="text-sm bg-red-100 dark:bg-red-800/20 px-1 py-0.5 rounded font-mono">{children}</code>,
                  }}
                >
                  {item}
                </ReactMarkdown>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tactical Maneuvers */}
      {maneuvers.length > 0 && (
        <section className="rounded-lg border border-emerald-200/50 dark:border-emerald-800/30 bg-emerald-50/50 dark:bg-emerald-900/10 p-3">
          <div className="flex items-center gap-2 mb-2">
            <Navigation className="w-3.5 h-3.5 text-emerald-500" />
            <h3 className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
              Recommended Tactical Maneuvers
            </h3>
          </div>
          <div className="space-y-2">
            {maneuvers.map((item, i) => (
              <div
                key={i}
                className="bg-white/60 dark:bg-white/5 rounded-md p-2 border border-emerald-100/50 dark:border-emerald-800/20"
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({ children }) => <p className="text-sm leading-snug text-gray-800 dark:text-gray-200 mb-0">{children}</p>,
                    strong: ({ children }) => <span className="font-semibold text-emerald-700 dark:text-emerald-300 text-sm">{children}</span>,
                    ul: ({ children }) => <ul className="text-sm space-y-1">{children}</ul>,
                    li: ({ children }) => <li className="text-sm">{children}</li>,
                    code: ({ children }) => <code className="text-sm bg-emerald-100 dark:bg-emerald-800/20 px-1 py-0.5 rounded font-mono">{children}</code>,
                  }}
                >
                  {item}
                </ReactMarkdown>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Operational Summary */}
      {summary && (
        <section className="rounded-lg border border-blue-200/50 dark:border-blue-800/30 bg-blue-50/50 dark:bg-blue-900/10 p-3">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-3.5 h-3.5 text-blue-500" />
            <h3 className="text-sm font-semibold text-blue-600 dark:text-blue-400">
              Operational Summary
            </h3>
          </div>
          <div className="bg-white/60 dark:bg-white/5 rounded-md p-2 border border-blue-100/50 dark:border-blue-800/20">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => <p className="text-sm leading-relaxed text-gray-800 dark:text-gray-200 mb-0">{children}</p>,
                strong: ({ children }) => <span className="font-semibold text-blue-700 dark:text-blue-300 text-sm">{children}</span>,
                ul: ({ children }) => <ul className="text-sm space-y-1">{children}</ul>,
                li: ({ children }) => <li className="text-sm">{children}</li>,
                code: ({ children }) => <code className="text-sm bg-blue-100 dark:bg-blue-800/20 px-1 py-0.5 rounded font-mono">{children}</code>,
              }}
            >
              {summary}
            </ReactMarkdown>
          </div>
        </section>
      )}
    </div>
  );
}

function parseAdvice(text: string): null | {
  advisories: string[];
  maneuvers: string[];
  summary: string;
} {
  // Clean up the input text first
  const cleanText = text
    .replace(/^[*#\s-]*/, '') // Remove leading markdown characters
    .replace(/\*\*([^*]+)\*\*/g, '**$1**') // Normalize bold formatting
    .trim();

  const getSection = (label: string) => {
    const patterns = [
      new RegExp(`${label}\\s*:?[\\r\\n]+([\\s\\S]*?)(?=\\n\\s*(?:#{1,6}\\s*|\\*\\*|[A-Z][^\\n]*:|$))`, "i"),
      new RegExp(`#{1,6}\\s*${label}\\s*:?[\\r\\n]+([\\s\\S]*?)(?=\\n\\s*(?:#{1,6}\\s*|\\*\\*|[A-Z][^\\n]*:|$))`, "i")
    ];

    for (const pattern of patterns) {
      const match = cleanText.match(pattern);
      if (match?.[1]?.trim()) {
        return match[1].trim();
      }
    }
    return "";
  };

  const advisoryLabels = [
    "Immediate Safety Advisories",
    "Critical Safety Advisories",
    "Safety Advisories",
    "Advisories"
  ];

  const maneuverLabels = [
    "Suggested Heading/Altitude Changes",
    "Suggested Heading \\/ Altitude Changes",
    "Suggested Maneuvers",
    "Recommended Maneuvers",
    "Tactical Maneuvers"
  ];

  const summaryLabels = [
    "Summary for Operator",
    "Operational Summary",
    "Summary"
  ];

  let advisoriesText = "";
  let maneuversText = "";
  let summaryText = "";

  // Try to find advisories section
  for (const label of advisoryLabels) {
    advisoriesText = getSection(label);
    if (advisoriesText) break;
  }

  // Try to find maneuvers section
  for (const label of maneuverLabels) {
    maneuversText = getSection(label);
    if (maneuversText) break;
  }

  // Try to find summary section
  for (const label of summaryLabels) {
    summaryText = getSection(label);
    if (summaryText) break;
  }

  if (!advisoriesText && !maneuversText && !summaryText) return null;

  const normalizeList = (s: string) => {
    if (!s) return [];

    return s
      .split(/\r?\n+/)
      .map((line) => {
        // Clean up list markers and extra whitespace
        return line
          .replace(/^[-*•\d.\)\s]+/, '') // Remove list markers
          .replace(/^\*\*([^*]+)\*\*:?\s*/, '**$1**: ') // Normalize bold headers
          .trim();
      })
      .filter(Boolean)
      .filter((line) => line.length > 3); // Filter out very short lines
  };

  return {
    advisories: normalizeList(advisoriesText),
    maneuvers: normalizeList(maneuversText),
    summary: summaryText.replace(/^[-*•\s]+/, '').trim(),
  };
}
