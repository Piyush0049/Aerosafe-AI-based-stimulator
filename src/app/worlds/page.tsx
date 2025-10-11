
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectToDatabase } from "@/lib/db";
import { WorldDesign, type IWorldDesign } from "@/lib/models/WorldDesign";
import { DeleteWorldButton } from "@/components/DeleteWorldButton";
import Link from "next/link";

interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  // Add other properties if they exist on the session.user object
}

export default async function WorldsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return <div className="p-6">Please login to view your worlds.</div>;
  await connectToDatabase();
  const docs = (await WorldDesign.find({ userId: (session.user as SessionUser).id })
    .sort({ updatedAt: -1 })
    .lean<IWorldDesign[]>()) as IWorldDesign[];
  return (
    <div className="min-h-screen p-6 sm:p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">My Worlds</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {docs.map((w: IWorldDesign) => (
          <div key={w._id} className="rounded-xl border border-white/10 bg-white/5 backdrop-blur p-4 flex flex-col gap-3">
            <div className="font-medium">{w.name}</div>
            <div className="text-xs text-white/60">Zones: {w.world?.restrictedZones?.length || 0} • Grid: {w.world?.gridStepMeters || 100}m</div>
            <div className="mt-auto flex gap-2">
  <Link href={`/sim/${w._id}`} className="px-3 py-1.5 rounded-md bg-emerald-600 text-white text-sm">Simulate</Link>
  <DeleteWorldButton id={String(w._id)} />
</div>

          </div>
        ))}
        {docs.length === 0 && <div className="text-white/70">No worlds yet. Create one in the Design page.</div>}
      </div>
    </div>
  );
}



