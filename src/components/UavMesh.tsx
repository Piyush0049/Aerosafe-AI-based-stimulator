"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";
import type { Uav } from "@/lib/types";

export function UavMesh({ uav }: { uav: Uav }) {
  const ref = useRef<Mesh>(null!);
  useFrame(() => {
    ref.current.position.set(uav.position.x, uav.position.z, uav.position.y);
  });
  return (
    <mesh ref={ref} castShadow receiveShadow>
      <sphereGeometry args={[uav.radius, 20, 20]} />
      <meshStandardMaterial color={uav.color} emissive={uav.color} emissiveIntensity={0.35} metalness={0.2} roughness={0.35} />
    </mesh>
  );
}


