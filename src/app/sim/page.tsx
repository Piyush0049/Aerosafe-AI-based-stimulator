import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions";
import { Dashboard } from "@/components/Dashboard";

export default async function SimPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login");
  return (
    <div className="min-h-screen p-6 sm:p-8 max-w-6xl mx-auto">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">AeroSafe Airspace Simulator</h1>
        <div className="text-xs sm:text-sm text-white/70">Geofencing • Collision Prediction • AI Alerts</div>
      </header>
      <Dashboard />
    </div>
  );
}


