"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/signup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, password }) });
    const data = await res.json();
    if (!res.ok) { setError(data?.error || "Signup failed"); return; }
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
      <div className="w-full max-w-md rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur p-6">
        <h1 className="text-xl font-semibold mb-2">Create your account</h1>
        <p className="text-sm text-black/60 dark:text-white/60 mb-4">Start simulating with AeroSafe</p>
        <form onSubmit={onSubmit} className="space-y-3">
          <label className="block">
            <div className="text-xs mb-1">Name</div>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 rounded-md border border-black/10 bg-white/80 dark:bg-white/10" required />
          </label>
          <label className="block">
            <div className="text-xs mb-1">Email</div>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="w-full px-3 py-2 rounded-md border border-black/10 bg-white/80 dark:bg-white/10" required />
          </label>
          <label className="block">
            <div className="text-xs mb-1">Password</div>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="w-full px-3 py-2 rounded-md border border-black/10 bg-white/80 dark:bg-white/10" required />
          </label>
          {error && <div className="text-sm text-red-600">{error}</div>}
          <button type="submit" className="w-full px-3 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700">Create account</button>
        </form>
        <div className="text-sm mt-4 text-center">Already have an account? <Link href="/auth/login" className="text-emerald-700 dark:text-emerald-400 hover:underline">Login</Link></div>
      </div>
    </div>
  );
}


