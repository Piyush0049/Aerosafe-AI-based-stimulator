import { NextResponse } from "next/server";
import { getGeminiModel } from "@/lib/ai";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { uavs, zones } = body as { uavs: any[]; zones: any[] };
  const model = getGeminiModel();
  const prompt = `You are an AI ATC assistant. Given UAV states and restricted zones, provide:
  - Immediate safety advisories (collisions/geofencing)
  - Suggested heading/altitude changes for top 3 risky UAVs
  - One-paragraph summary for the operator

  UAVs (JSON): ${JSON.stringify(uavs).slice(0, 10000)}
  Zones (JSON): ${JSON.stringify(zones).slice(0, 4000)}
  `;
  const res = await model.generateContent(prompt);
  const text = res.response.text();
  return NextResponse.json({ advice: text });
}


