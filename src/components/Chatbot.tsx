"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim()) return;
    const text = input.trim();
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setLoading(true);
    const res = await fetch("/api/ai/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: text }) });
    const data = await res.json();
    setMessages((m) => [...m, { role: "assistant", text: data.reply || "" }]);
    setLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!open ? (
        <button onClick={() => setOpen(true)} className="h-12 w-12 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-lg">
          <MessageCircle />
        </button>
      ) : (
        <div className="w-[320px] h-[420px] rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/10 backdrop-blur shadow-xl flex flex-col">
          <div className="h-10 flex items-center justify-between px-3 border-b border-black/10 dark:border-white/10">
            <div className="text-sm font-medium">AeroSafe Assistant</div>
            <button onClick={() => setOpen(false)} className="text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"><X size={18}/></button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
                <div className={"inline-block px-2.5 py-1.5 rounded-md " + (m.role === "user" ? "bg-emerald-600 text-white" : "bg-white/70 dark:bg-white/10 border border-black/10 dark:border-white/10")}>{m.text}</div>
              </div>
            ))}
            {loading && <div className="text-xs text-black/60 dark:text-white/60">Thinking…</div>}
          </div>
          <div className="p-2 flex gap-2">
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") send(); }} placeholder="Ask about AeroSafe…" className="flex-1 px-2.5 py-1.5 rounded-md border border-black/10 bg-white/80 dark:bg-white/10 text-sm" />
            <button onClick={send} className="px-3 py-1.5 rounded-md bg-emerald-600 text-white text-sm">Send</button>
          </div>
        </div>
      )}
    </div>
  );
}


