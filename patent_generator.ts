import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generatePatent(description: string, analysis: any, claims: any) {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: `Generate full patent application for: ${description}.
    Analysis: ${JSON.stringify(analysis)}
    Claims: ${JSON.stringify(claims)}
    Return JSON with: title, abstract, background, summary, detailedDescription, advantages (array), diagramInstructions (array).`,
    config: {
      responseMimeType: "application/json"
    }
  });

  return JSON.parse(response.text);
}
