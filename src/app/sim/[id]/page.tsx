import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectToDatabase } from "@/lib/db";
import { WorldDesign, type IWorldDesign } from "@/lib/models/WorldDesign";
import { ApplyWorldClient } from "@/components/clients/ApplyWorldClient";

interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export default async function SimByIdPage({
  params,
}: {
  params: Promise<{ id: string }>; 
}) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  const user = session?.user as SessionUser | undefined;

  if (!user?.id) return null;

  await connectToDatabase();

  const doc = await WorldDesign.findOne({ _id: id, userId: user.id }).lean<IWorldDesign>();
  if (!doc) return null;

  return <ApplyWorldClient world={doc.world} />;
}
