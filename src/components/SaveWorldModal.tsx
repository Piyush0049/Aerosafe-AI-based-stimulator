"use client";

import { useState } from "react";
import { useSimStore } from "@/store/useSimStore";

export function SaveWorldModal({ open, onClose, onSaved }: { open: boolean; onClose: () => void; onSaved: () => void }) {
  const { world } = useSimStore();
  const [name, setName] = useState("My Airspace");
  const [loading, setLoading] = useState(false);
  if (!open) return null;

  const save = async () => {
    setLoading(true);
    const res = await fetch("/api/worlds", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, world }) });
    setLoading(false);
    if (res.ok) { onSaved(); onClose(); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-xl border border-white/10 bg-white/10 backdrop-blur p-4">
        <h2 className="text-lg font-semibold mb-2">Save World</h2>
        <label className="text-sm">Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-md border border-white/10 bg-white/10" />
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1.5 rounded-md bg-white/10 text-white text-sm">Cancel</button>
          <button onClick={save} disabled={loading} className="px-3 py-1.5 rounded-md bg-emerald-600 text-white text-sm">{loading ? "Saving…" : "Save"}</button>
        </div>
      </div>
    </div>
  );
}


