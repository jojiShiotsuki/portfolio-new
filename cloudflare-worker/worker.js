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
      const systemPrompt = `You are Joji's portfolio assistant. You help visitors learn about Joji Shiotsuki, a freelance WordPress & web developer based in Cebu, Philippines.

Key facts about Joji:
- Builds WordPress websites using Bricks, Elementor, and Divi
- Also does full-stack development with React/Node.js
- Helps businesses in construction, real estate, and e-commerce
- Works with clients in US, Australia, and Philippines
- Offers SEO, e-commerce (WooCommerce), and maintenance services
- Previously worked at Toyota as Team Lead, then 100Devs bootcamp, then Polianna LLC

Keep responses concise and helpful. If someone wants to work with Joji, direct them to the contact section or email: jojishiotsuki0@gmail.com`;

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
