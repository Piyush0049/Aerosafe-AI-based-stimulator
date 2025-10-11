"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { LogIn, LogOut, Shield, Edit, Globe } from "lucide-react";

export function BottomBar() {
  const { data: session } = useSession();
  const isAuthed = Boolean(session?.user);

  return (
    <div className="sm:hidden fixed bottom-0 left-0 w-full bg-white dark:bg-gray-950 border-t-[1px] border-gray-400 dark:border-gray-200 z-40">
      <nav className="flex justify-around h-14 items-center text-xs">
        {isAuthed ? (
          <>
            <Link href="/design" className="flex flex-col items-center text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300">
              <Edit size={20} />
              <span className="text-[11px]">2D</span>
            </Link>
            <Link href="/design3d" className="flex flex-col items-center text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300">
              <Edit size={20} />
              <span className="text-[11px]">3D</span>
            </Link>
            <Link href="/worlds" className="flex flex-col items-center text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300">
              <Globe size={20} />
              <span className="text-[11px]">Worlds</span>
            </Link>
            <button onClick={() => signOut()} className="flex flex-col items-center text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300">
              <LogOut size={20} />
              <span className="text-[11px]">Logout</span>
            </button>
          </>
        ) : (
          <>
            <Link href="/auth/login" className="flex flex-col items-center text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300">
              <LogIn size={20} />
              <span className="text-[11px]">Login</span>
            </Link>
            <Link href="/auth/signup" className="flex flex-col items-center text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300">
              <Shield size={20} />
              <span className="text-[11px]">Sign up</span>
            </Link>
          </>
        )}
      </nav>
    </div>
  );
}