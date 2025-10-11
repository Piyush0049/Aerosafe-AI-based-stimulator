"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc"; // full-color Google logo


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = await signIn("credentials", { email, password, redirect: true, callbackUrl: "/" });
    if (res?.error) setError(res.error);
  };

  return (
    <div className="h-screen flex items-center justify-center p-6 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
      <div className="w-full max-w-md rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur p-6">
        <h1 className="text-xl font-semibold mb-2">Welcome back</h1>
        <p className="text-sm text-black/60 dark:text-white/60 mb-4">Login to continue to AeroSafe</p>
        <button onClick={() => signIn("google", { callbackUrl: "/" })} className="w-full mb-4 px-3 py-2 rounded-md bg-white text-black border border-black/10 hover:bg-slate-50 flex items-center justify-center gap-2">
          <FcGoogle size={18}/> Continue with Google
        </button>
        <div className="text-xs text-center uppercase text-black/40 dark:text-white/40 mb-4">or</div>
        <form onSubmit={onSubmit} className="space-y-3">
          <label className="block">
            <div className="text-xs mb-1">Email</div>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="w-full px-3 py-2 rounded-md border border-black/10 bg-white/80 dark:bg-white/10" required />
          </label>
          <label className="block">
            <div className="text-xs mb-1">Password</div>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="w-full px-3 py-2 rounded-md border border-black/10 bg-white/80 dark:bg-white/10" required />
          </label>
          {error && <div className="text-sm text-red-600">{error}</div>}
          <button type="submit" className="w-full px-3 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700">Login</button>
        </form>
        <div className="text-sm mt-4 text-center">No account? <Link href="/auth/signup" className="text-emerald-700 dark:text-emerald-400 hover:underline">Sign up</Link></div>
      </div>
    </div>
  );
}


