
import { GoogleGenAI, Type } from "@google/genai";
import { VisaAlert } from "./types";

export const getVisaInsights = async (alerts: VisaAlert[]) => {
  if (alerts.length === 0) return "No visa data available for analysis yet.";

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `
    Analyze the following visa slot alert data for "The Flying Panda" travel agency.
    Provide a concise executive summary (3-4 sentences) about current availability trends, 
    identifying high-demand hotspots or potential bottlenecks. 
    Format the response as clear professional advice for the internal team.
    
    Data: ${JSON.stringify(alerts.map(a => ({ country: a.country, type: a.visaType, status: a.status })))}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.95,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The AI assistant is currently unavailable to analyze trends. Please check back later.";
  }
};
