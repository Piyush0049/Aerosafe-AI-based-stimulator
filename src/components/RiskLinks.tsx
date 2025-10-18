"use client";

import { useMemo } from "react";
import { Line } from "@react-three/drei";
import { useSimStore } from "@/store/useSimStore";
import { predictClosestApproach } from "@/lib/engine";
import { Uav } from "@/lib/types";

export function RiskLinks() {
  const { uavs, settings } = useSimStore();
  const pairs = useMemo(() => {
    const out: { a: Uav; b: Uav; risk: number }[] = [];
    for (let i = 0; i < uavs.length; i++) for (let j = i + 1; j < uavs.length; j++) {
      const risk = predictClosestApproach(uavs[i], uavs[j]);
      const combined = uavs[i].radius + uavs[j].radius + settings.collisionThresholdMeters;
      if (risk.timeToClosest <= settings.lookaheadSeconds && risk.closestDistance < combined) {
        out.push({ a: uavs[i], b: uavs[j], risk: Math.max(0, combined - risk.closestDistance) });
      }
    }
    return out;
  }, [uavs, settings]);

  return (
    <group>
      {pairs.map((p, idx) => (
        <Line
          key={idx}
          points={[
            [p.a.position.x, p.a.position.z, -p.a.position.y],
            [p.b.position.x, p.b.position.z, -p.b.position.y],
          ]}
          color="#ffb703"
          lineWidth={2}
          transparent
          opacity={0.6}
        />
      ))}
    </group>
  );
}


