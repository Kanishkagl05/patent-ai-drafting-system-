import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function searchPriorArt(description: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Simulate prior art for: ${description}. 
    Return JSON array of objects with: title, description, similarityScore, uniquenessFactor.`,
    config: {
      responseMimeType: "application/json"
    }
  });

  return JSON.parse(response.text);
}
