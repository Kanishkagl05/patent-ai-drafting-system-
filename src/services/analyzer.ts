import { ai, MODELS } from "./gemini";
import { Type } from "@google/genai";

export interface InnovationAnalysis {
  problem: string;
  solution: string;
  technicalField: string;
  noveltyPoints: string[];
}

export async function analyzeInnovation(description: string): Promise<InnovationAnalysis> {
  const response = await ai.models.generateContent({
    model: MODELS.FLASH,
    contents: `Analyze the following technical innovation and extract its core components:
    
    Innovation Description:
    ${description}
    
    Extract:
    1. The core problem being solved.
    2. The technical solution proposed.
    3. The specific technical field.
    4. Key points of novelty compared to standard solutions.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          problem: { type: Type.STRING },
          solution: { type: Type.STRING },
          technicalField: { type: Type.STRING },
          noveltyPoints: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["problem", "solution", "technicalField", "noveltyPoints"]
      }
    }
  });

  return JSON.parse(response.text);
}
