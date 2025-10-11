"use client";

import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { GridHelper, Color, Material } from "three";

export function StableGrid({ size = 4000, divisions = 160, color1 = "#2e3b6b", color2 = "#1b2547" }: { size?: number; divisions?: number; color1?: string; color2?: string }) {
  const ref = useRef<GridHelper>(null!);
  const { scene } = useThree();

  useEffect(() => {
    const grid = new GridHelper(size, divisions, new Color(color1), new Color(color2));
    grid.position.set(0, -0.1, 0);
    // Prevent z-fighting shimmer when orbiting
    const material = grid.material as Material;
    material.depthWrite = false;
    material.depthTest = false;
    grid.renderOrder = -1;
    scene.add(grid);
    ref.current = grid;
    return () => void scene.remove(grid);
  }, [scene, size, divisions, color1, color2]);

  return null;
}


