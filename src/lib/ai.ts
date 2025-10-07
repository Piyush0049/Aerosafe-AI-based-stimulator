import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY as string;
if (!apiKey) throw new Error("Missing GEMINI_API_KEY env var");

export const genAI = new GoogleGenerativeAI(apiKey);

export function getGeminiModel(name = "gemini-2.5-flash-lite") {
  return genAI.getGenerativeModel({ model: name });
}


