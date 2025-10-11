"use client";

import { SessionProvider } from "@/components/providers/SessionProvider";
import { Header } from "@/components/Header";
import { Chatbot } from "@/components/Chatbot";
import { Loader } from "@/components/Loader";
import { BottomBar } from "@/components/BottomBar";
import { useSession } from "next-auth/react";
import React from "react";

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const { status } = useSession();

  return (
    <SessionProvider>
      <Header />
      {status === "loading" ? <Loader /> : children}
      <Chatbot />
      <BottomBar />
    </SessionProvider>
  );
}