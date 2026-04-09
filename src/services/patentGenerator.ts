import { ai, MODELS } from "./gemini";
import { Type } from "@google/genai";

export interface PatentDocument {
  title: string;
  abstract: string;
  background: string;
  summary: string;
  detailedDescription: string;
  advantages: string[];
  diagramInstructions: string[];
}

export async function generatePatentDocument(description: string, analysis: any, claims: any): Promise<PatentDocument> {
  const response = await ai.models.generateContent({
    model: MODELS.PRO,
    contents: `Generate a full structured patent application document based on the following innovation.
    
    Innovation: ${description}
    
    Context:
    Technical Field: ${analysis.technicalField}
    Claims: ${claims.independentClaims.join("; ")}
    
    The document must include:
    1. A formal Title.
    2. An Abstract (max 150 words).
    3. Background of the invention (describing the state of the art and the problem).
    4. Summary of the invention.
    5. Detailed Description (explaining how it works in detail).
    6. List of Advantages.
    7. Diagram Instructions (text descriptions of what should be in Figure 1, Figure 2, etc.).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          abstract: { type: Type.STRING },
          background: { type: Type.STRING },
          summary: { type: Type.STRING },
          detailedDescription: { type: Type.STRING },
          advantages: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          diagramInstructions: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["title", "abstract", "background", "summary", "detailedDescription", "advantages", "diagramInstructions"]
      }
    }
  });

  return JSON.parse(response.text);
}
