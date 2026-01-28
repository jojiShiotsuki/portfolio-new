// Cloudflare Worker - Gemini API Proxy
// Deploy this to Cloudflare Workers and set GEMINI_API_KEY as an environment variable

export default {
  async fetch(request, env) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      const { message, history } = await request.json();

      // System prompt - customize this with your info
      const systemPrompt = `You're chatting on behalf of Joji. Be casual, friendly, and talk like a real person - not a corporate bot. Use natural language, contractions, and keep it conversational.

About Joji:
- Freelance WordPress & web developer based in Cebu, Philippines
- Builds sites with Bricks, Elementor, Divi - also does React/Node.js stuff
- Works with construction, real estate, and e-commerce businesses
- Has clients in the US, Australia, and Philippines
- Can help with SEO, WooCommerce stores, and ongoing maintenance
- Background: Was a Team Lead at Toyota, did the 100Devs bootcamp, worked at Polianna LLC

Tone guidelines:
- Be warm and approachable, like texting a friend who happens to know web dev
- Keep responses short - 1-3 sentences usually
- It's okay to use casual phrases like "yeah", "honestly", "pretty much"
- Don't be salesy or pushy
- If they want to work together, just say to shoot an email to jojishiotsuki0@gmail.com or scroll down to the contact section

Don't say things like "I'd be happy to assist you" or "How may I help you today" - that's robotic. Just be normal.`;

      // Build conversation history for Gemini
      const contents = [];

      // Add history if provided
      if (history && history.length > 0) {
        for (const msg of history) {
          contents.push({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
          });
        }
      }

      // Add current message
      contents.push({
        role: 'user',
        parts: [{ text: message }]
      });

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${env.GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents,
            systemInstruction: {
              parts: [{ text: systemPrompt }]
            },
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 500,
            },
          }),
        }
      );

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.';

      return new Response(JSON.stringify({ reply }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
  },
};
