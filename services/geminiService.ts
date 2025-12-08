import { GoogleGenAI, Type } from "@google/genai";
import { ScriptElement, BeatCard, CharacterProfile } from "../types";

const apiKey = process.env.API_KEY || ''; // Ensure API_KEY is available in env

const ai = new GoogleGenAI({ apiKey });

export const generateScriptContinuation = async (
  currentScript: ScriptElement[],
  prompt: string
): Promise<ScriptElement[]> => {
  const context = currentScript.slice(-20).map(e => `${e.type.toUpperCase()}: ${e.content}`).join('\n');
  
  const sysInstruction = `You are a professional Hollywood screenwriter. 
  Continue the script based on the context. 
  Return JSON format matching the ScriptElement structure strictly.
  Available types: scene-heading, action, character, dialogue, parenthetical, transition, shot.
  Do not include IDs.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Context:\n${context}\n\nUser Request: ${prompt}\n\nGenerate the next 3-5 lines of script.`,
      config: {
        systemInstruction: sysInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING },
              content: { type: Type.STRING }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text);
  } catch (error) {
    console.error("AI Generation Error", error);
    return [];
  }
};

export const analyzeScript = async (script: ScriptElement[]) => {
  const fullText = script.map(e => e.content).join('\n');
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze this script segment for pacing, emotional arc, and cliché detection. \n\nScript:\n${fullText.substring(0, 5000)}...`, // Truncate for demo limits
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            pacing: { type: Type.STRING },
            emotionalArc: { 
              type: Type.ARRAY, 
              items: { 
                type: Type.OBJECT, 
                properties: {
                  scene: { type: Type.STRING },
                  score: { type: Type.NUMBER, description: "1-10 emotional intensity" }
                } 
              } 
            },
            cliches: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Analysis Error", error);
    return null;
  }
};

export const generateBeats = async (premise: string): Promise<BeatCard[]> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Create a 8-point beat sheet for a movie with this premise: "${premise}"`,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            synopsis: { type: Type.STRING },
                            act: { type: Type.STRING, enum: ['1', '2a', '2b', '3'] },
                            color: { type: Type.STRING, description: "Hex code for the card" }
                        }
                    }
                }
            }
        });
        const data = JSON.parse(response.text || '[]');
        return data.map((d: any, i: number) => ({...d, id: `ai-beat-${i}`}));
    } catch (e) {
        console.error("Beat Gen Error", e);
        return [];
    }
}
