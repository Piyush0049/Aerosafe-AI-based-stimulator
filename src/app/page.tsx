import Link from "next/link";
import { Plane, Shield, LogIn } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen p-6 sm:p-8 max-w-6xl mx-auto">
      <section className="mt-10 sm:mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div>
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wide text-emerald-400/80 mb-3"><Plane size={16}/> Real-time Airspace Safety</div>
          <h1 className="text-3xl sm:text-5xl font-semibold leading-tight">Simulate. Detect. Prevent.</h1>
          <p className="mt-4 text-white/70 max-w-prose">AeroSafe predicts collisions, enforces geofences, and issues AI-grade alerts for UAV operations. Explore a beautiful 3D dashboard designed for clarity and control.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/auth/signup" className="px-4 py-2.5 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-2"><Shield size={18}/> Get started</Link>
            <Link href="/auth/login" className="px-4 py-2.5 rounded-md bg-white/10 text-white hover:bg-white/20 border border-white/10 flex items-center gap-2"><LogIn size={18}/> Login</Link>
          </div>
          <div className="mt-4 text-xs text-white/60">No credit card required.</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur p-4">
          <div className="aspect-video w-full rounded-lg bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 border border-white/10 flex items-center justify-center text-white/80">
            3D Simulator available after login →
          </div>
        </div>
      </section>
    </div>
  );
}
