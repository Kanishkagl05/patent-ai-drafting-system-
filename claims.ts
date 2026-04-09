import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateClaims(description: string, analysis: any) {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: `Generate patent claims in legal format for: ${description}.
    Context: ${JSON.stringify(analysis)}
    Return JSON with: independentClaims (array), dependentClaims (array).`,
    config: {
      responseMimeType: "application/json"
    }
  });

  return JSON.parse(response.text);
}
