"use client";

export function SceneLegend() {
  return (
    <div className="absolute top-3 left-3 z-10 rounded-md border border-white/15 bg-black/40 backdrop-blur px-3 py-2 text-xs text-white/90" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <div className="font-semibold mb-1">Legend</div>
      <div className="flex items-center gap-2"><span className="inline-block h-2 w-2 rounded-full bg-white"></span> UAV</div>
      <div className="flex items-center gap-2"><span className="inline-block h-2 w-2 rounded-full bg-[#ff3860]"></span> Restricted Zone</div>
      <div className="flex items-center gap-2"><span className="inline-block h-0.5 w-3 bg-white"></span> Velocity Vector</div>
    </div>
  );
}


