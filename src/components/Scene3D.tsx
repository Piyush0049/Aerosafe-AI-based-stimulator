"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Grid, GizmoHelper, GizmoViewport, Html } from "@react-three/drei";
import { Suspense, useEffect } from "react";
import { useSimStore } from "@/store/useSimStore";
import { UavMesh } from "./UavMesh";
import { UavTrail } from "./UavTrail";
import { ZoneMesh } from "./ZoneMesh";

function Ticker() {
  const tickDt = useSimStore((s) => s.tickDt);
  const running = useSimStore((s) => s.running);
  useFrame((_, delta) => {
    if (running) tickDt(delta);
  });
  return null;
}

export function Scene3D() {
  const { world, uavs, start } = useSimStore();

  useEffect(() => { start(); }, [start]);

  return (
    <div className="w-full h-full rounded-xl overflow-hidden border border-black/10 dark:border-white/10 bg-white/40 dark:bg-black/20 backdrop-blur">
      <Canvas camera={{ position: [320, 260, 320], fov: 60 }} dpr={[1, 2]} shadows>
        <color attach="background" args={["#0b1020"]} />
        <fog attach="fog" args={["#0b1020", 600, 2200]} />
        <hemisphereLight args={[0xffffff, 0x444444, 0.6]} />
        <directionalLight position={[300, 400, 200]} intensity={1.2} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
        <Suspense fallback={<Html center style={{ color: "white" }}>Loading…</Html>}>
          <Grid args={[world.sizeMeters, world.sizeMeters]} cellSize={25} cellThickness={0.7} sectionSize={250} sectionThickness={1.2} fadeDistance={1400} infiniteGrid position={[0, 0, 0]} />
          {world.restrictedZones.map((z) => (
            <ZoneMesh key={z.id} zone={z} />
          ))}
          {uavs.map((u) => (
            <group key={u.id}>
              <UavMesh uav={u} />
              <UavTrail uav={u} />
            </group>
          ))}
          <Ticker />
        </Suspense>
        <OrbitControls makeDefault enableDamping dampingFactor={0.08} minDistance={120} maxDistance={1600} enablePan={true} />
        <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
          <GizmoViewport labelColor="white" axisHeadScale={1} />
        </GizmoHelper>
      </Canvas>
    </div>
  );
}


