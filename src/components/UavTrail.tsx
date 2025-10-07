"use client";

import { useMemo, useRef } from "react";
import { Line } from "@react-three/drei";
import type { Uav } from "@/lib/types";

export function UavTrail({ uav }: { uav: Uav }) {
  const pointsRef = useRef<[number, number, number][]>([]);
  const maxPoints = 50;
  const color = useMemo(() => uav.color, [uav.color]);
  pointsRef.current.push([uav.position.x, uav.position.z, uav.position.y]);
  if (pointsRef.current.length > maxPoints) pointsRef.current.shift();
  return <Line points={pointsRef.current} color={color} lineWidth={1.5} transparent opacity={0.6} />;
}


