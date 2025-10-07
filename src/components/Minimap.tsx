"use client";

import { useEffect, useRef } from "react";
import { useSimStore } from "@/store/useSimStore";

export function Minimap() {
  const { world, uavs } = useSimStore();
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cvs = ref.current!;
    const ctx = cvs.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      const w = 220, h = 220;
      cvs.width = Math.floor(w * dpr);
      cvs.height = Math.floor(h * dpr);
      cvs.style.width = w + "px"; cvs.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const draw = () => {
      const w = cvs.width / dpr, h = cvs.height / dpr;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#0b1020"; ctx.globalAlpha = 0.8; ctx.fillRect(0, 0, w, h); ctx.globalAlpha = 1;
      const half = world.sizeMeters / 2; const s = Math.min(w, h) / (world.sizeMeters || 1);
      const to = (x: number, y: number) => ({ x: w / 2 + x * s, y: h / 2 - y * s });

      // Zones
      ctx.strokeStyle = "rgba(255,56,96,0.8)"; ctx.fillStyle = "rgba(255,56,96,0.2)"; ctx.lineWidth = 1;
      for (const z of world.restrictedZones) {
        ctx.beginPath();
        z.polygon.forEach((p, i) => { const t = to(p.x, p.y); if (i === 0) ctx.moveTo(t.x, t.y); else ctx.lineTo(t.x, t.y); });
        ctx.closePath(); ctx.fill(); ctx.stroke();
      }

      // UAVs
      for (const u of uavs) {
        const t = to(u.position.x, u.position.y);
        ctx.beginPath(); ctx.arc(t.x, t.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = u.color; ctx.fill();
      }
    };

    let raf = 0; const loop = () => { draw(); raf = requestAnimationFrame(loop); }; loop();
    return () => cancelAnimationFrame(raf);
  }, [world, uavs]);

  return (
    <div className="absolute top-3 right-3 z-10 rounded-md border border-white/15 bg-black/40 backdrop-blur p-2">
      <canvas ref={ref} />
    </div>
  );
}


