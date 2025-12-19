
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GroundingSource } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const SYSTEM_INSTRUCTION = `You are a professional AI Assistant for Sradex Learning Private Limited. 
Your primary goal is to provide accurate, detailed, and up-to-date information about Sradex Learning, its founders, educational programs, and corporate background. 
You must use the Google Search tool to verify details about the founders and the company's latest news. 
If asked about Sradex Learning, be helpful and informative. 
If a question is outside the scope of Sradex Learning, politely answer it while maintaining a professional tone. 
Always aim for precision.`;

export async function sendMessageToGemini(
  prompt: string,
  history: { role: string; parts: { text: string }[] }[]
) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...history,
        { role: "user", parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "I'm sorry, I couldn't process that request.";
    
    // Extract grounding sources
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const sources: GroundingSource[] = [];
    
    if (groundingChunks) {
      groundingChunks.forEach((chunk: any) => {
        if (chunk.web) {
          sources.push({
            title: chunk.web.title || 'Source',
            uri: chunk.web.uri
          });
        }
      });
    }

    return { text, sources };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to connect to the AI service. Please check your API key.");
  }
}
