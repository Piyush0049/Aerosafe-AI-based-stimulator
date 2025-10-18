"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { OrbitControls, GizmoHelper, GizmoViewport, Html, Environment, ContactShadows, Sky } from "@react-three/drei";
import { EffectComposer, SMAA, Bloom, Vignette } from "@react-three/postprocessing";
import { StableGrid } from "@/components/StableGrid";
import { SceneLegend } from "@/components/SceneLegend";
import { Suspense, useEffect } from "react";
import { useSimStore } from "@/store/useSimStore";
import { UavMesh } from "@/components/UavMesh";
import { UavTrail } from "@/components/UavTrail";
import { ZoneMesh } from "@/components/ZoneMesh";
import { Minimap } from "@/components/Minimap";
import { RiskLinks } from "@/components/RiskLinks";

function Ticker() {
  const tickDt = useSimStore((s) => s.tickDt);
  const running = useSimStore((s) => s.running);
  useFrame((_, delta) => {
    if (running) tickDt(delta);
  });
  return null;
}

function StabilizeControls() {
  const controls = useThree((s) => s.controls) as OrbitControlsImpl;
  useEffect(() => {
    if (controls) {
      controls.enableDamping = true;
      controls.dampingFactor = 0.08;
      controls.target.set(0, 0, 0);
      controls.update?.();
    }
  }, [controls]);
  return null;
}

export function Scene3D() {
  const { world, uavs, start } = useSimStore();
  console.log(world);

  useEffect(() => {
    start();
  }, [start]);

  const UAV_SCALE = 3.0; // Size of UAV mesh only
  const SKY_SCALE = world.sizeMeters * 10;

  return (
    <div className="w-full h-full rounded-t-xl overflow-hidden border border-black/10 dark:border-white/10 bg-white/40 dark:bg-black/20 backdrop-blur relative">
      <SceneLegend />
      <Canvas
        camera={{ position: [320, 260, 320], fov: 60, near: 0.1, far: 5000 }}
        dpr={[1, 2]}
        shadows
        gl={{ antialias: true, powerPreference: "high-performance", logarithmicDepthBuffer: true }}
      >
        <color attach="background" args={["#0b1020"]} />

        <directionalLight
          position={[300, 400, 200]}
          intensity={1.1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />

        <Suspense fallback={<Html center style={{ color: "white" }}>Loading…</Html>}>
          <Environment preset="night" />

          <Sky
            sunPosition={[100, 20, 400]}
            distance={SKY_SCALE}
            inclination={0.49}
            azimuth={0.75}
            mieCoefficient={0.005}
            rayleigh={3}
          />

          <group>
            {/* Green Ground - centered at origin */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
              <planeGeometry args={[world.sizeMeters, world.sizeMeters]} />
              <meshStandardMaterial color="#02B34A" />
            </mesh>

            {/* Restricted Zones in RED */}
            {world.restrictedZones.map((z) => (
              <ZoneMesh key={z.id} zone={z} />
            ))}

            <RiskLinks />

            {/* UAVs and Trails - NO GROUP SCALING */}
            {uavs.map((u) => (
              <group key={u.id}>
                <UavMesh uav={u} />
                <UavTrail uav={u} />
              </group>
            ))}
          </group>

          {/* Shadows */}
          <ContactShadows
            position={[0, 0.01, 0]}
            opacity={0.35}
            scale={world.sizeMeters}
            blur={1.8}
            far={120}
          />

          <Ticker />
          <StabilizeControls />

          <EffectComposer enableNormalPass={false}>
            <SMAA />
            <Bloom intensity={0.55} luminanceThreshold={0.8} luminanceSmoothing={0.15} mipmapBlur />
            <Vignette eskil={false} offset={0.25} darkness={0.6} />
          </EffectComposer>
        </Suspense>

        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.08}
          minDistance={120}
          maxDistance={3000}
          enablePan={true}
        />

        <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
          <GizmoViewport labelColor="white" axisHeadScale={1} />
        </GizmoHelper>
      </Canvas>

      <Minimap />
    </div>
  );
}
