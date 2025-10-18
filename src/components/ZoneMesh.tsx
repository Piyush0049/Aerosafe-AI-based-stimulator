"use client";

import { useMemo } from "react";
import * as THREE from "three";

interface Zone {
  id: string;
  polygon: Array<{ x: number; y: number }>;
}

interface ZoneMeshProps {
  zone: Zone;
}

export function ZoneMesh({ zone }: ZoneMeshProps) {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    zone.polygon.forEach((p, i) => {
      // Match minimap transformation: y is negated in minimap, 
      // so we negate here to align with ground plane coordinates
      if (i === 0) {
        s.moveTo(p.x, -p.y);
      } else {
        s.lineTo(p.x, -p.y);
      }
    });
    s.closePath();
    return s;
  }, [zone.polygon]);

  const geometry = useMemo(() => {
    return new THREE.ShapeGeometry(shape);
  }, [shape]);

  return (
    <mesh
      geometry={geometry}
      rotation={[Math.PI / 2, 0, 0]}
      position={[0, 0.5, 0]}
      receiveShadow
    >
      <meshStandardMaterial
        color="#FF2900"
        transparent
        opacity={0.4}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
