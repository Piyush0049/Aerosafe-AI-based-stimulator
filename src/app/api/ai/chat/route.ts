import { NextResponse } from "next/server";
import { getGeminiModel } from "@/lib/ai";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { message, currentPath } = body as { message: string; currentPath?: string };
  if (!message) return NextResponse.json({ error: "Missing message" }, { status: 400 });
  const model = getGeminiModel();
  let context = '';
  if (currentPath) {
    context += `The user is currently on the page: ${currentPath}. Do not mention the page in your response. And be professional.`;
    switch (true) {
      case currentPath.startsWith('/sim'):
        context += 'On this page, the user is interacting with the drone simulation, observing UAV movements, restricted zones, and risk assessments. Provide answers related to simulation parameters, drone behavior, safety protocols, and how to interpret the visual data presented.';
        break;
      case currentPath === '/design2d':
        context += 'On this page, the user is likely designing or configuring restricted zones in 2D domain. Provide answers related to 2D scenario creation, world parameters, and design best practices.';
        break;
      case currentPath === '/design3d':
        context += 'On this page, the user is likely designing or configuring restricted zones in 3D domain. Provide answers related to 3D restricted zone creation, and design best practices.';
        break;
      case currentPath === '/worlds':
        context += 'On this page, the user is managing different simulation worlds. Provide answers related to only loading and deleting different environments.';
        break;
      default:
        context += 'The user is on a general page. Provide general information about AeroSafe.';
        break;
    }
  }
  console.log(context);
  const res = await model.generateContent(`${context}You are an AI assistant for AeroSafe, a drone simulation platform focused on safety and risk assessment. Your purpose is to provide clear, concise answers (5-6 lines maximum) related to drone operations, safety protocols, risk analysis, website page, and simulation parameters within the AeroSafe context. Do not answer unrelated queries. If asked about topics outside AeroSafe, respond with: "I'm sorry, I can only answer questions about AeroSafe". Consider Aerosafe a tech project, not a company."

User query: ${message}`);
  const text = res.response.text();
  return NextResponse.json({ reply: text });
}


