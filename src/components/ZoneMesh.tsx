"use client";

import { Shape, ShapeGeometry, Vector2, Mesh } from "three";
import { useMemo, useRef } from "react";
import type { RestrictedZone } from "@/lib/types";
import { Html } from "@react-three/drei";

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

  return (
    <group>
      <mesh ref={ref} geometry={geom} receiveShadow rotation={[Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <meshStandardMaterial color="#ff3860" transparent opacity={0.18} polygonOffset polygonOffsetFactor={-2} polygonOffsetUnits={-2} />
      </mesh>
      <Html position={[0, 0.5, 0]} center distanceFactor={20}>
        <div style={{ fontFamily: 'Poppins, sans-serif' }} className="px-1.5 py-0.5 rounded-md text-[10px] bg-[#ff3860]/80 text-white border border-white/20 whitespace-nowrap">
          Restricted: {zone.name}
        </div>
      </Html>
    </group>
  );
}


