import { GoogleGenAI } from "@google/genai";

// NOTE: In AI Studio, frontend calls are preferred. 
// This is provided for architectural completeness as requested.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function analyzeInnovation(description: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze this invention and extract technical components:
    Description: ${description}
    Return JSON with: problem, solution, technicalField, noveltyPoints (array).`,
    config: {
      responseMimeType: "application/json"
    }
  });
  
  return JSON.parse(response.text);
}
