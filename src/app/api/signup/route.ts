import { NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/lib/models/User";
import bcrypt from "bcryptjs";

const schema = z.object({ name: z.string().min(1).max(64), email: z.string().email(), password: z.string().min(6).max(100) });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = schema.parse(body);
    await connectToDatabase();
    const existing = await User.findOne({ email });
    if (existing) return NextResponse.json({ error: "Email already in use" }, { status: 400 });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash: hash, provider: "credentials" });
    return NextResponse.json({ id: user._id, email: user.email, name: user.name });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Invalid request" }, { status: 400 });
  }
}


