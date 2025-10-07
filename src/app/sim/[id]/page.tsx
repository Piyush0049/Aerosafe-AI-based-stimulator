import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectToDatabase } from "@/lib/db";
import { WorldDesign, type IWorldDesign } from "@/lib/models/WorldDesign";
import { ApplyWorldClient } from "@/components/clients/ApplyWorldClient";

export default async function SimByIdPage({ params }: { params: { id: string } }) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  await connectToDatabase();
  const doc = (await WorldDesign.findOne({ _id: id, userId: (session.user as any).id }).lean<IWorldDesign>()) as IWorldDesign | null;
  if (!doc) return null;

  return <ApplyWorldClient world={doc.world} />;
}



