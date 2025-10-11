import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectToDatabase } from "@/lib/db";
import { WorldDesign } from "@/lib/models/WorldDesign";
import { z } from "zod";

interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  // Add other properties if they exist on the session.user object
}

const WorldSchema = z.object({
  sizeMeters: z.number().positive(),
  heightMeters: z.number().positive(),
  gridStepMeters: z.number().positive().optional(),
  restrictedZones: z
    .array(
      z.object({
        id: z.string().optional(),
        name: z.string().min(1).max(64),
        polygon: z.array(z.object({ x: z.number(), y: z.number(), z: z.number() })).min(3),
      })
    )
    .default([]),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await connectToDatabase(); // Assuming session.user is of type SessionUser
    const docs = await WorldDesign.find({ userId: (session.user as SessionUser).id }).sort({ updatedAt: -1 }).lean();
    return NextResponse.json({ worlds: docs });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to list worlds";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await req.json();
    const name = z.string().min(1).max(64).parse(body?.name);
    const world = WorldSchema.parse(body?.world);
    await connectToDatabase(); // Assuming session.user is of type SessionUser
    const doc = await WorldDesign.create({ userId: (session.user as SessionUser).id, name, world });
    return NextResponse.json({ world: doc });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to list worlds";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}


