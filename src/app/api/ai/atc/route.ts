import { NextResponse } from "next/server";
import { getGeminiModel } from "@/lib/ai";

interface UAV {
  id: string;
  position: { x: number; y: number; z: number };
  velocity: { x: number; y: number; z: number };
  // Add other relevant UAV properties here
}

interface Zone {
  id: string;
  vertices: { x: number; y: number }[];
  height: number;
  // Add other relevant Zone properties here
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { uavs, zones } = body as { uavs: UAV[]; zones: Zone[] };
  const model = getGeminiModel();
  const prompt = `You are an AI ATC assistant. Given UAV states and restricted zones, provide:
  - Immediate safety advisories (collisions/geofencing)
  - Suggested heading/altitude changes for top 3 risky UAVs
  - One-paragraph summary for the operator
  - keep the paragraph short and concise

  UAVs (JSON): ${JSON.stringify(uavs).slice(0, 10000)}
  Zones (JSON): ${JSON.stringify(zones).slice(0, 4000)}
  `;
  const res = await model.generateContent(prompt);
  const text = res.response.text();
  return NextResponse.json({ advice: text });
}


