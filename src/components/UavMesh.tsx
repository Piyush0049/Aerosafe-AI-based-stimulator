"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";
import { Html, Line } from "@react-three/drei";
import type { Uav } from "@/lib/types";
import { useSimStore } from "@/store/useSimStore";

export function UavMesh({ uav }: { uav: Uav }) {
  const ref = useRef<Mesh>(null!);
  const velocityEnd = useRef<[number, number, number]>([0, 0, 0]);
  const directionEnd = useRef<[number, number, number]>([0, 0, 0]);
  const color = useMemo(() => uav.color, [uav.color]);
  const setSelected = useSimStore((s) => s.setSelectedUav);
  const hold = useSimStore((s) => s.holdUav);
  const rtb = useSimStore((s) => s.returnUav);

  useFrame(() => {
    // Rotate 180° about data z-axis: (x, y, z) -> (-x, -y, z)
    ref.current.position.set(uav.position.x, uav.position.z, -uav.position.y);

    // Keep altitude (data z) unchanged; invert ground-plane x,y for vectors too
    velocityEnd.current = [
      uav.position.x + uav.velocity.x * 0.8,
      uav.position.z + uav.velocity.z * 0.8,
      -uav.position.y - uav.velocity.y * 0.8,
    ];
    directionEnd.current = [
      uav.position.x + uav.direction.x * uav.radius * 2,
      uav.position.z + uav.direction.z * uav.radius * 2,
      -uav.position.y - uav.direction.y * uav.radius * 2,
    ];
  });

  const displayColor = uav.battery <= 10 ? "#ff0000" : color; // Red if battery is 10% or less

  return (
    <group>
      <mesh ref={ref} castShadow receiveShadow onClick={(e) => { e.stopPropagation(); setSelected(uav.id); }}>
        <sphereGeometry args={[uav.radius + 8, 20, 20]} />
        <meshStandardMaterial color={displayColor} emissive={displayColor} emissiveIntensity={0.2} metalness={0.9} roughness={0.1} />
        {/* Label */}
        <Html center distanceFactor={8} position={[0, uav.radius + 6, 0]}>
          <div style={{ fontFamily: 'Poppins, sans-serif' }} className="px-2 py-0.5 rounded-md text-xs bg-black/70 text-white border border-white/10 whitespace-nowrap">
            {uav.id} • {Math.round(uav.position.z)} m • {uav.battery.toFixed(0)}%
          </div>
        </Html>
      </mesh>
      <Html center distanceFactor={10} position={[0, -uav.radius - 8, 0]}>
        <div className="flex gap-1">
          <button onClick={(e) => { e.stopPropagation(); hold(uav.id); }} className="px-1.5 py-0.5 text-[10px] rounded bg-white/10 border border-white/10">Hold</button>
          <button onClick={(e) => { e.stopPropagation(); rtb(uav.id); }} className="px-1.5 py-0.5 text-[10px] rounded bg-white/10 border border-white/10">Return</button>
        </div>
      </Html>
    </group>
  );
}


