"use client";

import { useEffect, useRef, useState } from "react";
import { useSimStore } from "@/store/useSimStore";

export function DesignCanvas2D() {
  const { world, addZone } = useSimStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
  const [name, setName] = useState("Zone");

  useEffect(() => {
    const cvs = canvasRef.current!; const ctx = cvs.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;
    const resize = () => { const w = 520, h = 360; cvs.width = w * dpr; cvs.height = h * dpr; cvs.style.width = w+"px"; cvs.style.height = h+"px"; ctx.setTransform(dpr,0,0,dpr,0,0); };
    resize();
    const draw = () => {
      const w = cvs.width / dpr, h = cvs.height / dpr;
      ctx.clearRect(0,0,w,h); ctx.fillStyle = "#0b1020"; ctx.fillRect(0,0,w,h);
      // grid
      ctx.strokeStyle = "#213054"; ctx.lineWidth = 1; const step = (world.gridStepMeters||100) * (Math.min(w,h)/world.sizeMeters);
      for(let x=0;x<w;x+=step){ ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,h); ctx.stroke(); }
      for(let y=0;y<h;y+=step){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke(); }
      // polygon
      if(points.length){
        ctx.fillStyle = "rgba(255,56,96,0.2)"; ctx.strokeStyle = "rgba(255,56,96,0.8)"; ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y); points.slice(1).forEach(p=>ctx.lineTo(p.x,p.y));
        ctx.closePath(); ctx.fill(); ctx.stroke();
      }
      // points
      ctx.fillStyle = "#fff"; points.forEach(p=>{ ctx.beginPath(); ctx.arc(p.x,p.y,3,0,Math.PI*2); ctx.fill(); });
    };
    let raf=0; const loop=()=>{ draw(); raf=requestAnimationFrame(loop); }; loop();
    return ()=>cancelAnimationFrame(raf);
  }, [points, world]);

  const toWorld = (x:number, y:number) => {
    const cvs = canvasRef.current!; const w=cvs.clientWidth, h=cvs.clientHeight;
    const sx = (x - w/2) * (world.sizeMeters / Math.min(w,h));
    const sy = -(y - h/2) * (world.sizeMeters / Math.min(w,h));
    return { x: sx, y: sy };
  };

  const onClick = (e: React.MouseEvent) => {
    const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
    const x = e.clientX - rect.left; const y = e.clientY - rect.top;
    setPoints((ps)=>[...ps, { x, y }]);
  };

  const save = () => {
    if(points.length < 3) return;
    const poly = points.map(p=>{ const w = toWorld(p.x,p.y); return { x: w.x, y: w.y, z: 0 }; });
    addZone({ name, polygon: poly }); setPoints([]);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm"><span>Name</span><input value={name} onChange={(e)=>setName(e.target.value)} className="px-2 py-1 rounded-md border border-white/10 bg-white/10"/></div>
      <div className="text-xs text-white/70">Click to place vertices. Double-click to close, or press Save.</div>
      <canvas ref={canvasRef} onClick={onClick} className="rounded-md border border-white/10 bg-black/40 cursor-crosshair"/>
      <div className="flex gap-2">
        <button onClick={save} className="px-3 py-1.5 rounded-md bg-emerald-600 text-white text-sm">Save zone</button>
        <button onClick={()=>setPoints([])} className="px-3 py-1.5 rounded-md bg-white/10 text-white text-sm">Clear</button>
      </div>
    </div>
  );
}


