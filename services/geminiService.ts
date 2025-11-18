import { GoogleGenAI, Type } from "@google/genai";
import { GeminiResponse } from "../types";

const MODEL_NAME = "gemini-2.5-flash";

// Initialize the client. 
// Note: We create a new instance per request in the function to ensure we pick up the key if it changes,
// but for this simple app, a static instance is fine assuming the env var is constant.
// However, following best practices for resilience:

export const analyzeVideoContent = async (url: string, transcript?: string): Promise<GeminiResponse> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please ensure the environment variable is set.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    You are an expert productivity assistant and content strategist. 
    Your goal is to analyze the content associated with a YouTube video and extract highly actionable insights.
    
    Input:
    Video URL: ${url}
    ${transcript ? `Transcript/Context: ${transcript}` : 'Note: No transcript provided. Please infer the content from the URL if it is a well-known video, otherwise provide generic best-practices based on the likely topic inferred from the URL structure or title if visible.'}

    Instructions:
    1. Identify the likely title of the video.
    2. Write a concise summary (max 3 sentences).
    3. Extract 3-5 key highlights or "aha" moments.
    4. Extract concrete, actionable steps (Action Items) that the viewer can implement immediately.
    5. Suggest 3-5 short, relevant tags for organizing this note (e.g., "Productivity", "React", "Cooking").

    Return the response in strict JSON format matching the schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            videoTitle: { type: Type.STRING },
            summary: { type: Type.STRING },
            highlights: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            actionItems: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            suggestedTags: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["videoTitle", "summary", "highlights", "actionItems", "suggestedTags"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response text received from Gemini.");
    }

    const result = JSON.parse(text) as GeminiResponse;
    return result;

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    throw new Error("Failed to analyze video content. Please check the URL or try adding a transcript.");
  }
};