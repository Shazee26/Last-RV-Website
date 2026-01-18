
import { GoogleGenAI } from "@google/genai";

export const getAIConciergeResponse = async (userInput: string) => {
  // Ensure the API key is available via process.env.API_KEY
  if (!process.env.API_KEY) {
    return "AI services are currently unavailable. Please contact us via phone.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: userInput,
      config: {
        systemInstruction: `You are the friendly AI Concierge for Mountain View RV Park in Van Horn, Texas. 
        General Park info: 
        - Location: 810 Frontage Rd, Van Horn, TX 79855 (West Texas, halfway between El Paso and Fort Stockton).
        - Views: Panoramic views of the Guadalupe Mountains and Sierra Blanca.
        - Amenities: 30/50 Amp, Full hookups, High-speed Wi-Fi, Laundry, Pet friendly, Clean showers.
        - Nearby: Guadalupe Mountains National Park (about 1 hour north), McDonald Observatory, Big Bend.
        - Atmosphere: Peaceful, desert landscape, stargazing.
        Your goal is to help guests with local tips, weather-related advice for RVers, and park information. 
        Keep your tone warm, helpful, and Texan.`,
      },
    });

    // Access the .text property directly as per Gemini API guidelines
    const text = response.text;
    if (typeof text === 'string' && text.length > 0) {
      return text;
    }
    return "I'm sorry, I couldn't process that request right now. Please try again.";
  } catch (error: any) {
    console.error("Gemini Error:", error);
    // Ensure we always return a string, never an object, to prevent [object Object] in the UI
    const errorMessage = error?.message || (typeof error === 'string' ? error : "The stars are a bit fuzzy right now! Please try asking again in a moment.");
    return errorMessage;
  }
};
