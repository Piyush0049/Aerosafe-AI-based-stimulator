"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const send = async () => {
    if (!input.trim()) return;
    const text = input.trim();
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, currentPath: pathname }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", text: data.reply || "" }]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Oops! Something went wrong.";
      setMessages((m) => [...m, { role: "assistant", text: message }]);
    }
    setLoading(false);
  };

  return (
    <div className="fixed bottom-[75px] sm:bottom-6 right-6 z-50">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="h-14 w-14 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 hover:scale-105 transition-transform text-white flex items-center justify-center shadow-2xl"
        >
          <MessageCircle size={24} />
        </button>
      ) : (
        <div className="w-[320px] h-[360px] sm:w-[340px] sm:h-[480px] rounded-2xl shadow-xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 backdrop-blur-md">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-emerald-800 to-emerald-800 text-white font-semibold text-base shadow-md">
            <span>AeroSafe Assistant</span>
            <button onClick={() => setOpen(false)} className="hover:text-gray-100 transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm custom-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                {m.role === "user" ? (
                  <div className="max-w-[75%] px-4 py-2 rounded-xl bg-emerald-700 text-white shadow-md break-words">
                    {m.text}
                  </div>
                ) : (
                  <div className="max-w-[80%] px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-600 shadow-sm prose prose-sm prose-emerald break-words">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.text}</ReactMarkdown>
                  </div>
                )}
              </div>
            ))}
            {loading && <div className="text-xs text-gray-500 dark:text-gray-400 italic">Thinking…</div>}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-4 py-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex gap-2 items-center">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask about AeroSafe…" 
              className="flex-1 px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-gray-500 dark:placeholder-gray-400"
            />
            <button
              onClick={send}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors shadow-md"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
