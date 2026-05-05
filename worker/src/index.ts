interface Env {
  ANTHROPIC_API_KEY: string;
  ALLOWED_ORIGIN: string;
  RATE_LIMIT: KVNamespace;
}

// --- Rate limit config ---
const MAX_PER_IP_PER_HOUR = 20;    // Messages per IP per hour
const MAX_GLOBAL_PER_DAY = 500;     // Total messages across all users per day
const MAX_MESSAGE_LENGTH = 500;     // Characters per message
const MAX_HISTORY_LENGTH = 30;      // Messages in conversation history

const SYSTEM_PROMPT = `# ROLE & IDENTITY

You are an AI assistant on Joji Shiotsuki's portfolio website. Joji is a mid-level web developer based in Cebu, Philippines, currently applying for full-time roles in AU and US (remote). You speak on behalf of Joji to visitors, who are typically hiring managers, recruiters, or fellow developers.

## YOUR JOB

Help visitors quickly understand if Joji is a fit for a role they're hiring for. Answer questions about his experience, stack, work, and availability with confidence and specifics. Surface relevant projects when asked.

You do NOT pitch discovery calls, freelance services, or sales offers. Joji is primarily applying for full-time employment right now.

## ABOUT JOJI (factual, do not embellish)

- 4 years building for the web — agency client work and freelance.
- 8+ shipped WordPress client builds. Tools: Bricks Builder, Elementor, custom booking calculators, multi-location SEO, schema markup, WP Rocket.
- React/TypeScript apps: Vertex (productivity tool with natural-language input), KontentFire (multi-platform social SaaS for home service businesses).
- This portfolio site itself: React 19, TypeScript, Vite, Tailwind 4, Cloudflare Workers, three home variants (Editorial, Pixel, Glass).
- Stack: WordPress + Bricks/Elementor on the CMS side, React + TypeScript + Tailwind on the JS side, Node + Cloudflare Workers for backend services.
- Based in Cebu, Philippines. Open to AU and US remote roles. Mid-level positioning.
- Notable client work: Knock Knock HVAC (Cincinnati, Bricks Builder), Pundok Studios barbershop (Cebu, ranked #1 on Google), Maid To Please cleaning (DC/MD/VA, custom booking calculator, multi-location SEO), Trade Titans podcast, Knock Out Renovation (commercial), plus a US strategic-branding consultancy and a Cebu web design company.

## TONE

Confident, direct, factual. Like Joji texting a friend who's a recruiter. No marketing-speak. No hedging. Use specifics over generalities.

## WHAT TO DO

- If asked about WordPress experience: cite specific shipped sites, the page builders used (Bricks, Elementor), and one or two outcomes (e.g. "ranked Pundok #1 on Google in 3 months", "built a custom booking calculator for Maid To Please that quotes in under 60 seconds").
- If asked about React/TS/JavaScript: mention Vertex, KontentFire, and that the portfolio itself is React 19 + TypeScript + Cloudflare Workers.
- If asked about availability: "Joji is open to mid-level web developer roles, AU and US remote. Best way to reach him is jojishiotsuki0@gmail.com or LinkedIn (linkedin.com/in/jojishiotsuki). Resume is at /resume.pdf on this site."
- If asked about freelance: "Joji is primarily applying for full-time roles right now. If you specifically need freelance work, you can reach him at jojishiotsuki0@gmail.com — but full-time is the priority."
- If asked something off-topic, be brief and friendly and redirect to portfolio context.

## WHAT NOT TO DO

- No "book a call" / "discovery call" / Calendly pitches.
- No urgency framing ("limited spots", "act now").
- No exaggeration. Stick to factual claims.
- Don't invent projects or experience that isn't listed above.
- Don't be sycophantic.

## CONTACT INFO (when asked)

- Email: jojishiotsuki0@gmail.com
- LinkedIn: linkedin.com/in/jojishiotsuki
- GitHub: github.com/jojiShiotsuki
- Resume: /resume.pdf (linked in the site header and sticky CTA)
`;

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

function isLocalOrigin(origin: string): boolean {
  return origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1');
}

function corsHeaders(origin: string, allowedOrigin: string): Record<string, string> {
  const allowed = origin === allowedOrigin || isLocalOrigin(origin);

  return {
    'Access-Control-Allow-Origin': allowed ? origin : allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

function isAllowedOrigin(origin: string, allowedOrigin: string): boolean {
  return origin === allowedOrigin || isLocalOrigin(origin);
}

// KV key helpers
function ipKey(ip: string): string {
  const hour = Math.floor(Date.now() / 3600000);
  return `ip:${ip}:${hour}`;
}

function dailyKey(): string {
  const day = new Date().toISOString().slice(0, 10);
  return `global:${day}`;
}

// NOTE: The KV get-then-put pattern below has an inherent race condition due to
// KV eventual consistency. Under concurrent requests the counters may undercount,
// allowing slightly more messages than the configured limits. This is an accepted
// tradeoff for a portfolio site where the traffic volume is low and the risk of
// meaningful abuse is minimal. A stricter approach would use Durable Objects or
// an atomic counter, but that is unnecessary at this scale.
async function checkRateLimit(env: Env, ip: string): Promise<{ allowed: boolean; reason?: string }> {
  // Check per-IP hourly limit
  const ipk = ipKey(ip);
  const ipCount = parseInt(await env.RATE_LIMIT.get(ipk) || '0', 10);
  if (ipCount >= MAX_PER_IP_PER_HOUR) {
    return { allowed: false, reason: 'Too many messages. Try again in a bit!' };
  }

  // Check global daily limit
  const dk = dailyKey();
  const globalCount = parseInt(await env.RATE_LIMIT.get(dk) || '0', 10);
  if (globalCount >= MAX_GLOBAL_PER_DAY) {
    return { allowed: false, reason: "Joji's assistant is maxed out today! Shoot him an email at jojishiotsuki0@gmail.com or book a call at calendly.com/jojishiotsuki0/30min" };
  }

  // Increment both counters (TTL: IP=1hr, global=24hr)
  await Promise.all([
    env.RATE_LIMIT.put(ipk, String(ipCount + 1), { expirationTtl: 3600 }),
    env.RATE_LIMIT.put(dk, String(globalCount + 1), { expirationTtl: 86400 }),
  ]);

  return { allowed: true };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get('Origin') || '';
    const headers = corsHeaders(origin, env.ALLOWED_ORIGIN);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers });
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...headers, 'Content-Type': 'application/json' },
      });
    }

    // Strict origin check — block requests from unknown origins
    if (!isAllowedOrigin(origin, env.ALLOWED_ORIGIN)) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { ...headers, 'Content-Type': 'application/json' },
      });
    }

    // Get client IP
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';

    // Rate limit check
    const rateCheck = await checkRateLimit(env, ip);
    if (!rateCheck.allowed) {
      return new Response(JSON.stringify({ reply: rateCheck.reason }), {
        status: 429,
        headers: { ...headers, 'Content-Type': 'application/json' },
      });
    }

    try {
      const body = await request.json() as { message: string; history?: ChatMessage[] };
      let { message, history = [] } = body;

      if (!message || typeof message !== 'string') {
        return new Response(JSON.stringify({ error: 'Message is required' }), {
          status: 400,
          headers: { ...headers, 'Content-Type': 'application/json' },
        });
      }

      // Cap message length
      if (message.length > MAX_MESSAGE_LENGTH) {
        message = message.slice(0, MAX_MESSAGE_LENGTH);
      }

      // Cap history length (keep most recent messages)
      if (history.length > MAX_HISTORY_LENGTH) {
        history = history.slice(-MAX_HISTORY_LENGTH);
      }

      // Sanitize history entries
      history = history
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .map((m) => ({
          role: m.role,
          content: typeof m.content === 'string' ? m.content.slice(0, MAX_MESSAGE_LENGTH) : '',
        }));

      // Claude API requires the first message to be role: "user"
      // Strip any leading assistant messages (e.g. the hardcoded greeting)
      while (history.length > 0 && history[0].role === 'assistant') {
        history.shift();
      }

      // Build messages array for Claude
      const messages = [
        ...history.map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
        { role: 'user' as const, content: message },
      ];

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 512,
          system: SYSTEM_PROMPT,
          messages,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Claude API error:', response.status, errorText);
        return new Response(JSON.stringify({ error: 'AI service error' }), {
          status: 502,
          headers: { ...headers, 'Content-Type': 'application/json' },
        });
      }

      const data = await response.json() as {
        content: Array<{ type: string; text?: string }>;
      };

      const reply = data.content
        .filter((b) => b.type === 'text')
        .map((b) => b.text)
        .join('');

      return new Response(JSON.stringify({ reply }), {
        headers: { ...headers, 'Content-Type': 'application/json' },
      });
    } catch (err) {
      console.error('Worker error:', err instanceof Error ? err.message : err);
      return new Response(JSON.stringify({ error: 'Internal error' }), {
        status: 500,
        headers: { ...headers, 'Content-Type': 'application/json' },
      });
    }
  },
};
