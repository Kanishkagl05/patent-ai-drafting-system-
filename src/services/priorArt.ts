import { ai, MODELS } from "./gemini";
import { Type } from "@google/genai";

export interface PriorArtItem {
  title: string;
  description: string;
  similarityScore: number;
  uniquenessFactor: string;
}

export async function searchPriorArt(description: string): Promise<PriorArtItem[]> {
  const response = await ai.models.generateContent({
    model: MODELS.FLASH,
    contents: `Simulate a prior art search for the following innovation. 
    Generate 3-4 hypothetical existing inventions or patents that might be similar.
    For each, provide a title, a brief description, a similarity score (0-100), and explain why the user's innovation is still unique compared to it.
    
    Innovation:
    ${description}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            similarityScore: { type: Type.NUMBER },
            uniquenessFactor: { type: Type.STRING }
          },
          required: ["title", "description", "similarityScore", "uniquenessFactor"]
        }
      }
    }
  });

  return JSON.parse(response.text);
}
