
import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

export const getAIConciergeResponse = async (userInput: string) => {
  if (!API_KEY) return "AI services are currently unavailable. Please contact us via phone.";

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: userInput,
      config: {
        systemInstruction: `You are the friendly AI Concierge for Mountain View RV Park in Van Horn, Texas. 
        General Park info: 
        - Location: Van Horn, TX (West Texas, halfway between El Paso and Fort Stockton).
        - Views: Panoramic views of the Guadalupe Mountains and Sierra Blanca.
        - Amenities: 30/50 Amp, Full hookups, High-speed Wi-Fi, Laundry, Pet friendly, Clean showers.
        - Nearby: Guadalupe Mountains National Park (about 1 hour north), McDonald Observatory, Big Bend.
        - Atmosphere: Peaceful, desert landscape, stargazing.
        Your goal is to help guests with local tips, weather-related advice for RVers, and park information. 
        Keep your tone warm, helpful, and Texan.`,
      },
    });

    return response.text || "I'm sorry, I couldn't process that request right now.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The stars are a bit fuzzy right now! Please try asking again in a moment.";
  }
};
