"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { Plane, LogIn, LogOut, Shield, Github, Map } from "lucide-react";

export function Header() {
  const { data: session } = useSession();
  const isAuthed = Boolean(session?.user);

  return (
    <div className="sticky top-0 z-40 w-full backdrop-blur bg-white/60 dark:bg-black/30 border-b border-black/10 dark:border-white/10">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Plane size={18} className="text-emerald-600" />
          <Link href="/" className="font-semibold">AeroSafe</Link>
          <nav className="hidden sm:flex items-center gap-4 ml-6 text-sm text-black/70 dark:text-white/70">
            <Link href="/" className="hover:text-black dark:hover:text-white flex items-center gap-1"><Map size={16}/>Home</Link>
            <Link href="/sim" className="hover:text-black dark:hover:text-white flex items-center gap-1"><Map size={16}/>Simulator</Link>
            <Link href="https://github.com" target="_blank" className="hover:text-black dark:hover:text-white flex items-center gap-1"><Github size={16}/>GitHub</Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {isAuthed ? (
            <>
              <div className="text-sm hidden sm:block">{session?.user?.email}</div>
              <button onClick={() => signOut()} className="px-3 py-1.5 rounded-md bg-slate-800 text-white text-sm hover:bg-slate-900 flex items-center gap-1"><LogOut size={16}/>Logout</button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth/login" className="px-3 py-1.5 rounded-md bg-slate-800 text-white text-sm hover:bg-slate-900 flex items-center gap-1"><LogIn size={16}/>Login</Link>
              <Link href="/auth/signup" className="px-3 py-1.5 rounded-md bg-emerald-600 text-white text-sm hover:bg-emerald-700 flex items-center gap-1"><Shield size={16}/>Sign up</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


