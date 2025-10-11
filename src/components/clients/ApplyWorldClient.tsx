"use client";

import { useEffect } from "react";
import { useSimStore } from "@/store/useSimStore";
import { Dashboard } from "@/components/Dashboard";
import type { World } from "@/lib/types";

export function ApplyWorldClient({ world }: { world: World }) {
  const applyWorld = useSimStore((s) => s.applyWorld);
  useEffect(() => { if (world) applyWorld(world); }, [world, applyWorld]);
  return (
    <div className="min-h-screen p-3 sm:p-8 max-w-6xl mx-auto">
      <Dashboard />
    </div>
  );
}


