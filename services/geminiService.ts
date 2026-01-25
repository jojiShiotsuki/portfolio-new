import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { PERSONAL_INFO, PROJECTS, SERVICES, EXPERIENCE } from '../constants';

// Context for the AI to understand who Joji is
const PORTFOLIO_CONTEXT = `
You are an AI assistant for Joji Shiotsuki's portfolio website. 
Joji is a ${PERSONAL_INFO.role} based in ${PERSONAL_INFO.location}.
He runs an agency called ${PERSONAL_INFO.agency}.
His contact email is ${PERSONAL_INFO.email}.

Key Strengths:
- Dual expertise in Design and Full-Stack Engineering.
- SEO-First approach (ranking is priority).
- High-performance WordPress builds (Bricks, Elementor).
- Full-stack apps using React, Node.js, Express.

Services:
${SERVICES.map(s => `- ${s.title}: ${s.description}`).join('\n')}

Recent Projects:
${PROJECTS.map(p => `- ${p.title} (${p.category}): ${p.description}`).join('\n')}

Experience Highlights:
${EXPERIENCE.map(e => `- ${e.role} at ${e.company}`).join('\n')}

Tone: Professional, helpful, concise, and encouraging the user to book a consultation.
If asked about pricing, suggest booking a consultation as every project is unique.
`;

export const sendMessageToGemini = async (userMessage: string): Promise<string> => {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.warn("API Key missing. Returning mock response.");
    // Fallback for demo purposes if no key is provided in the environment
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("I'm currently in demo mode because the API Key isn't configured in this preview environment. However, I can tell you that Joji specializes in high-performance WordPress sites and custom web apps! Please email him at jojishiotsuki0@gmail.com.");
      }, 1000);
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: apiKey });
    
    // Using the flash model for quick chat interactions
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userMessage,
      config: {
        systemInstruction: PORTFOLIO_CONTEXT,
      }
    });

    return response.text || "I'm sorry, I couldn't generate a response at the moment.";
  } catch (error) {
    console.error("Error communicating with Gemini:", error);
    return "I'm having trouble connecting to the brain right now. Please try again later or contact Joji directly.";
  }
};
