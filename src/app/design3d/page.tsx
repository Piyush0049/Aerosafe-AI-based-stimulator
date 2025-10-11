"use client";

import { Canvas, ThreeEvent } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import { useState } from "react";
import { useSimStore } from "@/store/useSimStore";

export default function Design3DPage() {
  const { addZone } = useSimStore();
  const [points, setPoints] = useState<[number, number, number][]>([]);
  const [name, setName] = useState("Zone3D");

  const onGroundClick = (e: ThreeEvent<MouseEvent>) => {
    const p = e.point as { x: number; y: number; z: number };
    setPoints((ps) => [...ps, [p.x, 0, p.z]]);
  };

  const save = () => {
    if (points.length < 3) return;
    addZone({ name, polygon: points.map(([x, , z]) => ({ x, y: z, z: 0 })) });
    setPoints([]);
  };

  const undo = () => {
    setPoints((ps) => ps.slice(0, ps.length - 1));
  };

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center items-start sm:gap-2">
        <div className="mb-3 flex items-center gap-2">
          <span className="text-sm">Name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} className="px-2 py-1 rounded-md border border-white/10 bg-white/10" />
        </div>
        <div className="mb-3 flex items-center gap-2">
          <button onClick={save} className="px-3 py-1.5 rounded-md bg-emerald-600 text-white text-sm">Save</button>
          <button onClick={undo} className="px-3 py-1.5 rounded-md bg-gray-600 text-white text-sm" disabled={points.length === 0}>Undo</button>
        </div>
      </div>
      <div className="h-[70vh] rounded-xl overflow-hidden border border-white/10">
        <Canvas camera={{ position: [200, 180, 200], fov: 60 }} dpr={[1, 2]}>
          <color attach="background" args={["#0b1020"]} />
          <ambientLight intensity={0.7} />
          <directionalLight position={[200, 200, 200]} intensity={1.2} />
          <mesh rotation={[-Math.PI / 2, 0, 0]} onClick={onGroundClick}>
            <planeGeometry args={[4000, 4000]} />
            <meshBasicMaterial color="#0b1020" />
          </mesh>
          {points.map((p, i) => (
            <mesh key={i} position={[p[0], 1, p[2]]}>
              <sphereGeometry args={[2, 12, 12]} />
              <meshStandardMaterial color="#ff3860" />
            </mesh>
          ))}
          <Html position={[0, 0, 0]}></Html>
          <OrbitControls enableDamping dampingFactor={0.08} />
        </Canvas>
      </div>
      <div className="text-xs text-white/70 mt-2">Tip: Click on the ground to add vertices. Save to add this as a restricted zone.</div>
    </div>
  );
}


