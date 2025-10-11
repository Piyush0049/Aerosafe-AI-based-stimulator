import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectToDatabase } from "@/lib/db";
import { WorldDesign } from "@/lib/models/WorldDesign";

interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  // Add other properties if they exist on the session.user object
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as SessionUser).id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await connectToDatabase();
    await WorldDesign.deleteOne({ _id: params.id, userId: (session.user as SessionUser).id });
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    let errorMessage = "Failed to delete";
    if (err instanceof Error) {
      errorMessage = err.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}


