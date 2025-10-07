"use client";

import { Shape, ShapeGeometry, Vector2, Mesh } from "three";
import { useMemo, useRef } from "react";
import type { RestrictedZone } from "@/lib/types";
import { useFrame } from "@react-three/fiber";

export function ZoneMesh({ zone }: { zone: RestrictedZone }) {
  const shape = useMemo(() => {
    const s = new Shape();
    const pts = zone.polygon.map((p) => new Vector2(p.x, p.y));
    if (pts.length) s.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) s.lineTo(pts[i].x, pts[i].y);
    s.closePath();
    return s;
  }, [zone.polygon]);

  const geom = useMemo(() => new ShapeGeometry(shape, 1), [shape]);
  const ref = useRef<Mesh>(null!);
  useFrame(() => {
    ref.current.position.set(0, 0, 0);
    ref.current.rotation.set(-Math.PI / 2, 0, 0);
  });

  return (
    <mesh ref={ref} geometry={geom} receiveShadow>
      <meshStandardMaterial color="#ff3860" transparent opacity={0.2} />
    </mesh>
  );
}


