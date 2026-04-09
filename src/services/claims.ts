import { ai, MODELS } from "./gemini";
import { Type } from "@google/genai";

export interface PatentClaims {
  independentClaims: string[];
  dependentClaims: string[];
}

export async function generateClaims(description: string, analysis: any): Promise<PatentClaims> {
  const response = await ai.models.generateContent({
    model: MODELS.PRO, // Use Pro for complex legal language
    contents: `Generate formal patent claims for the following innovation. 
    Use precise legal patent language (e.g., "A system comprising...", "wherein...").
    
    Innovation Description:
    ${description}
    
    Analysis Context:
    Problem: ${analysis.problem}
    Solution: ${analysis.solution}
    Novelty: ${analysis.noveltyPoints.join(", ")}
    
    Generate:
    1. At least 2 Independent Claims.
    2. At least 4 Dependent Claims that build on the independent ones.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          independentClaims: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          dependentClaims: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["independentClaims", "dependentClaims"]
      }
    }
  });

  return JSON.parse(response.text);
}
