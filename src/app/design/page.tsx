"use client";

import { useState, useEffect } from "react";
import { useSimStore } from "@/store/useSimStore";
import { SaveWorldModal } from "@/components/SaveWorldModal";
import { DesignCanvas2D } from "@/components/DesignCanvas2D";

type P = { x: number; y: number; z: number };

export default function DesignPage() {
  const { world, addZone, removeZone, setGridStep, applyWorld } = useSimStore();
  const [name, setName] = useState("Custom Zone");
  const [points, setPoints] = useState<P[]>([]);
  const [grid, setGrid] = useState(world.gridStepMeters || 100);
  const [modal, setModal] = useState(false);
  const [list, setList] = useState<any[]>([]);

  const refresh = async () => {
    const res = await fetch("/api/worlds");
    if (res.ok) {
      const data = await res.json();
      setList(data.worlds || []);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const addPoint = () => setPoints((p) => [...p, { x: 0, y: 0, z: 0 }]);
  const updatePoint = (i: number, key: keyof P, value: number) =>
    setPoints((p) => p.map((pt, idx) => (idx === i ? { ...pt, [key]: value } : pt)));
  const save = () => {
    if (points.length < 3) return;
    addZone({ name, polygon: points });
    setPoints([]);
  };

  const applyGrid = () => setGridStep(grid);

  return (
    <div className="min-h-screen p-6 sm:p-8 max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Design Airspace</h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Panel — Zone Editor */}
        <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur p-4">
          <h2 className="text-lg font-semibold mb-3">Restricted Zone Editor</h2>
          <DesignCanvas2D />
          <div className="h-px bg-white/10 my-4" />

          <div className="mb-3">
            <label className="text-sm">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full px-3 py-2 rounded-md border border-white/10 bg-white/10"
            />
          </div>

          <div className="flex items-center justify-between mb-2">
            <div className="text-sm">Vertices ({points.length})</div>
            <button
              onClick={addPoint}
              className="px-2 py-1 rounded-md bg-emerald-600 text-white text-sm"
            >
              Add point
            </button>
          </div>

          <div className="space-y-2 max-h-60 overflow-auto pr-2">
            {points.map((p, i) => (
              <div key={i} className="grid grid-cols-3 gap-2 text-sm">
                <input
                  type="number"
                  value={p.x}
                  onChange={(e) => updatePoint(i, "x", Number(e.target.value))}
                  className="px-2 py-1 rounded-md border border-white/10 bg-white/10"
                  placeholder="x"
                />
                <input
                  type="number"
                  value={p.y}
                  onChange={(e) => updatePoint(i, "y", Number(e.target.value))}
                  className="px-2 py-1 rounded-md border border-white/10 bg-white/10"
                  placeholder="y"
                />
                <input
                  type="number"
                  value={p.z}
                  onChange={(e) => updatePoint(i, "z", Number(e.target.value))}
                  className="px-2 py-1 rounded-md border border-white/10 bg-white/10"
                  placeholder="z"
                />
              </div>
            ))}
          </div>

          <div className="mt-3 flex justify-end gap-2">
            <button
              onClick={() => setPoints([])}
              className="px-3 py-1.5 rounded-md bg-white/10 text-white text-sm"
            >
              Clear
            </button>
            <button
              onClick={() => setPoints((ps) => ps.slice(0, ps.length - 1))} // Add this line for undo functionality
              className="px-3 py-1.5 rounded-md bg-gray-600 text-white text-sm"
              disabled={points.length === 0}
            >
              Undo
            </button>
            <button
              onClick={save}
              className="px-3 py-1.5 rounded-md bg-emerald-600 text-white text-sm"
            >
              Save zone
            </button>
          </div>
        </div>

        {/* Right Panel — Grid and Saved Worlds */}
        <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur p-4">
          <h2 className="text-lg font-semibold mb-3">Grid Settings</h2>

          <label className="text-sm">Grid step (meters)</label>
          <input
            type="number"
            value={grid}
            onChange={(e) => setGrid(Number(e.target.value))}
            className="mt-1 w-full px-3 py-2 rounded-md border border-white/10 bg-white/10"
          />

          <div className="mt-3 flex justify-between">
            <button
              onClick={() => setModal(true)}
              className="px-3 py-1.5 rounded-md bg-emerald-600 text-white text-sm"
            >
              Save world
            </button>
            <button
              onClick={applyGrid}
              className="px-3 py-1.5 rounded-md bg-cyan-600 text-white text-sm"
            >
              Apply grid
            </button>
          </div>

          {/* Existing Zones */}
          <h3 className="text-sm font-semibold mt-6 mb-2">Existing Zones</h3>
          <div className="space-y-2 max-h-56 overflow-auto pr-2 text-sm">
            {world.restrictedZones.length > 0 ? (
              world.restrictedZones.map((z) => (
                <div
                  key={z.id}
                  className="flex items-center justify-between rounded-md border border-white/10 bg-white/10 px-2 py-1"
                >
                  <div>
                    {z.name} <span className="text-white/60">({z.id})</span>
                  </div>
                  <button
                    onClick={() => removeZone(z.id)}
                    className="px-2 py-1 rounded-md bg-red-600 text-white"
                  >
                    Delete
                  </button>
                </div>
              ))
            ) : (
              <div className="text-white/60 italic">
                No restricted zones added yet.
              </div>
            )}
          </div>

          {/* Saved Worlds */}
          <h3 className="text-sm font-semibold mt-6 mb-2">Saved Worlds</h3>
          <div className="space-y-2 max-h-56 overflow-auto pr-2 text-sm">
            {list.length > 0 ? (
              list.map((w) => (
                <div
                  key={w._id}
                  className="flex items-center justify-between rounded-md border border-white/10 bg-white/10 px-2 py-1"
                >
                  <div>{w.name}</div>
                  <div className="flex gap-2">
                    <button
                      onClick={async () => {
                        applyWorld(w.world);
                      }}
                      className="px-2 py-1 rounded-md bg-slate-700 text-white"
                    >
                      Load
                    </button>
                    <button
                      onClick={async () => {
                        await fetch(`/api/worlds/${w._id}`, { method: "DELETE" });
                        refresh();
                      }}
                      className="px-2 py-1 rounded-md bg-red-600 text-white"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-white/60 italic">No saved worlds yet.</div>
            )}
          </div>
        </div>
      </div>

      <SaveWorldModal open={modal} onClose={() => setModal(false)} onSaved={refresh} />
    </div>
  );
}
