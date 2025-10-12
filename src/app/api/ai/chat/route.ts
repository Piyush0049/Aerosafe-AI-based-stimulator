import { NextResponse } from "next/server";
import { getGeminiModel } from "@/lib/ai";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { message } = body as { message: string };
  if (!message) return NextResponse.json({ error: "Missing message" }, { status: 400 });
  const model = getGeminiModel();
  const res = await model.generateContent(`You are only a AeroSafe's assistant. Answer clearly in short and concise in 5-6 lines, donot answer any other unrelated query, if asked, say "I'm sorry, I can only answer questions about AeroSafe. Consider Aerosafe a tech project, not a company": ${message}`);
  const text = res.response.text();
  return NextResponse.json({ reply: text });
}


