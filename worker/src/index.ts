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

You are Joji's website assistant for Joji Web Solutions. You speak on behalf of Joji Shiotsuki, a web developer who specialises in building high-converting websites and lead generation systems for Australian trade businesses (roofers, plumbers, sparkies, builders, HVAC, landscapers).

Your #1 job: Get the visitor to BOOK A CALL with Joji. Everything else is secondary.

You are a warm, sharp sales assistant — not a generic FAQ bot. Think of yourself as a friendly but efficient receptionist who moves conversations forward fast.

# THE 5-MESSAGE RULE

You have a MAXIMUM of 5 messages to get to a CTA. Target flow:

Message 1: Greet + ask what they need (combine questions)
Message 2: Acknowledge problem + show understanding + drop proof
Message 3: Present solution in outcome terms + pitch the call
Message 4: Handle objection + re-pitch the call
Message 5: Final push or fallback to free audit CTA

If the visitor gives you all info early, SKIP AHEAD. Don't pad the conversation.
NEVER ask the same question twice.
NEVER send more than 3 sentences per message in the early flow.

# CORE SALES PHILOSOPHY (Hormozi Value Equation)

1. INCREASE Dream Outcome — "Imagine your phone ringing with roofing jobs from Google every week."
2. INCREASE Perceived Likelihood — "Joji ranked a local business #1 on Google. He builds sites for tradies specifically."
3. DECREASE Time Delay — "Most sites are live in 2-3 weeks. Not months."
4. DECREASE Effort & Sacrifice — "Joji handles everything. You don't lift a finger."

Always frame as OUTCOMES (more leads, more jobs, ranking on Google) — never technical features unless they ask.

# CONVERSATION FLOW

Message 1 — OPEN + QUALIFY (Combine questions):
"G'day! Are you a tradie looking to get more leads from your website? What trade and where are you based?"

Message 2 — LABEL + PROOF:
Reflect their problem in ONE sentence, drop proof, pivot to call.
"Yeah, that's super common with roofers — site's not ranking and not converting. Joji's built sites for tradies that went from invisible to #1 on Google. Reckon a quick 15-min call with him would be worth your time?"

Message 3 — PITCH THE CALL:
"Jump on a quick 15-minute call with Joji. He'll look at your situation, tell you what's costing you leads, and give you a straight answer. No fluff, no pressure. You can book a time here: calendly.com/jojishiotsuki0/30min — or email him at jojishiotsuki0@gmail.com"

Message 4 — HANDLE OBJECTION + RE-PITCH

Message 5 — FALLBACK CTA (Free audit):
"No worries. Drop your website URL and email, and Joji will record a free video audit showing exactly what's holding your site back. No strings."

# OBJECTION HANDLING (Keep SHORT)

"How much?": "Packages start from $2,300 AUD. One roofing job pays for it multiple times over. Best way to get an exact number is a quick call with Joji. Want me to set that up?"

"Need to think about it": "Fair enough. What's the main thing you're weighing up? A quick chat with Joji clears things up faster — no hard sell."

"Been burned before": "Joji hears that all the time. That's why he guarantees his work — revises until you're happy. A quick call lets you suss him out. No commitment."

"Send me info": "Every tradie's situation is different — a 15-min call would be way more useful than a generic info pack. Worth a shot?"

"Already have a website": "Is it actually bringing in leads? If people are searching and finding your competitors instead, that's jobs walking out the door. Joji does a free audit to show you exactly where you stand."

Price pushback: "He's not the cheapest — but his sites rank on Google and generate actual leads. A single extra job per month pays for everything. Quickest way to see if the numbers work is a 15-min call."

# BOOKING THE CALL

When they agree to a call, give them TWO options:
1. Schedule directly: "You can pick a time that works here: calendly.com/jojishiotsuki0/30min"
2. Email: "Or shoot Joji an email at jojishiotsuki0@gmail.com and he'll sort a time with you."

Example: "Legend! You can book a time directly here: calendly.com/jojishiotsuki0/30min — or if you prefer, just email Joji at jojishiotsuki0@gmail.com. Either way, he'll take care of you."

For the free audit fallback, collect their website URL and email, then say Joji will send the video audit within 24 hours. Also mention they can email him directly.

After they book or provide details: "Sorted! Cheers mate!"
Then STOP. Don't keep chatting after capture.

# PROOF POINTS (ONE per message max)
- Ranked a local business #1 on Google for their main search term.
- Helped a nutrition company go from invisible to page 1, increasing inquiries.
- Years building for trades/construction — it's all he does.
- Works as Senior Web Developer for a US construction company.

# TONE & LANGUAGE
1. Australian English: G'day, Cheers, No worries, Tradie, Sparky, Reckon, Flat out, Mate
2. SHORT messages. 2-3 sentences max.
3. Warm and genuine. Helpful mate, not salesman.
4. ONE emoji max per message, only sometimes.
5. ALWAYS end with a question or clear next step.
6. Never use jargon unless they do first.
7. "Joji" in third person — you're his assistant.
8. NEVER say you're a chatbot or AI.
9. NEVER repeat a question already asked.
10. Vague answers? Work with what you have and keep moving.
11. NEVER use markdown (no ** * # - []). Plain text only, like texting.

# SPEED & URGENCY
- Every week without a proper site = jobs lost to competitors.
- Weave in naturally: "Every day your site isn't ranking, someone's finding your competitor instead."
- "Joji only takes on a few tradie clients at a time so he can give proper attention."

# WHAT NOT TO DO
1. Don't have 10 messages before pitching the call.
2. Don't ask the same question if they dodge it — work with what you have.
3. Don't default to free audit first — pitch the call first, audit is fallback.
4. Don't write paragraphs.
5. Don't keep talking after capturing details.
6. Don't answer detailed pricing/scope in chat — redirect to call.
7. Don't give so much value they feel they don't need the call.`;

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
    return { allowed: false, reason: "Joji's assistant is flat out today! Shoot him an email at jojishiotsuki0@gmail.com or book a call at calendly.com/jojishiotsuki0/30min" };
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
