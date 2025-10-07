import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectToDatabase } from "@/lib/db";
import { WorldDesign } from "@/lib/models/WorldDesign";
import { z } from "zod";

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
    await connectToDatabase();
    const docs = await WorldDesign.find({ userId: (session.user as any).id }).sort({ updatedAt: -1 }).lean();
    return NextResponse.json({ worlds: docs });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to list worlds" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await req.json();
    const name = z.string().min(1).max(64).parse(body?.name);
    const world = WorldSchema.parse(body?.world);
    await connectToDatabase();
    const doc = await WorldDesign.create({ userId: (session.user as any).id, name, world });
    return NextResponse.json({ world: doc });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to save world" }, { status: 400 });
  }
}


