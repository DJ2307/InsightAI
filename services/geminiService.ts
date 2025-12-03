import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { UserEvent, MarketingInsight } from "../types";

// Initialize the Gemini client securely using the environment variable.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeUserBehavior = async (events: UserEvent[]): Promise<MarketingInsight> => {
  if (events.length === 0) {
    return {
      summary: "No user data collected yet.",
      userPersona: "Unknown",
      predictedInterests: [],
      marketingStrategy: "Wait for user interaction."
    };
  }

  // Convert complex event objects into a readable string for the AI
  const eventLog = events.map(e => 
    `[${new Date(e.timestamp).toLocaleTimeString()}] ${e.type}: ${e.details}`
  ).join('\n');

  const prompt = `
    You are a Senior Marketing Data Analyst AI.
    Analyze the following raw user interaction logs from an e-commerce session.
    
    USER LOGS:
    ${eventLog}

    Your goal is to "Simplified for Marketers". 
    1. Identify the user's intent (what are they actually looking for?).
    2. Build a brief "User Persona".
    3. Suggest what products to show them next.
    4. Propose a one-sentence marketing hook.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "A brief 2 sentence summary of what the user did." },
            userPersona: { type: Type.STRING, description: "e.g., 'Budget-conscious Tech Enthusiast' or 'Health-focused Gift Shopper'" },
            predictedInterests: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "List of 3-5 keywords of what they want."
            },
            marketingStrategy: { type: Type.STRING, description: "Actionable advice for the marketer." }
          }
        }
      }
    });

    const text = response.text;
    if (!text) {
        throw new Error("No text returned from AI");
    }

    // Clean up any potential markdown formatting if the model adds it
    const cleanJson = text.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    
    return JSON.parse(cleanJson) as MarketingInsight;

  } catch (error) {
    console.error("AI Analysis failed:", error);
    return {
      summary: "AI analysis failed due to technical error.",
      userPersona: "Error",
      predictedInterests: [],
      marketingStrategy: "Check API Configuration or Logs."
    };
  }
};