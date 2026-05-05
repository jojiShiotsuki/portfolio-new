# Portfolio Repositioning — Job Application Mode

**Date:** 2026-05-05
**Author:** Joji Shiotsuki (with brainstorming assistance)
**Status:** Draft for review

## Context

The portfolio at `jojishiotsuki.com` is currently positioned as a freelance/service offering: hero pitches "I help [Barbershops/Salons/Clinics/Cafes/Gyms/Spas] get found on Google," CTAs route to a Calendly booking link, an "Available for Projects 2025" urgency banner sits at the top of every page, and the home includes Services / How It Works / Who I Work With sections that read as a sales funnel for SMB clients.

Joji is now applying for **mid-level web developer roles in AU and US (remote)** — code + WordPress generalist. The current site, opened cold by a hiring manager, reads as "this person is selling websites to barbershops" rather than "this person is a web developer I should interview."

The work itself is strong and relevant: 8+ shipped WordPress client builds (Bricks, Elementor, custom booking calculators, multi-location SEO, schema markup) plus React/TS apps (Vertex, KontentFire) and the portfolio site itself (3 home variants, Cloudflare Worker chat, theme system). The problem is framing, not substance.

## Goals

1. The public home page reads as a developer portfolio for hiring managers — confident, evidence-led, no marketing-speak.
2. All existing visual design, layout, animations, components, color system, fonts, and home variants are preserved exactly. Only words change.
3. Service-business positioning is preserved off-nav at `/freelance` so it can be shared with returning clients without polluting the public job-application surface.
4. The PixelAssistant chat answers as Joji-the-developer (stack, work, availability for hiring managers) instead of Joji-the-sales-vendor (booking funnel).
5. Total scope is small enough to ship in 1–2 days so Joji can apply this week.

## Non-Goals

- No design, layout, animation, color, typography, or component changes.
- No new components.
- No restructure of the projects data — case studies are kept as-is, only outermost framing copy changes.
- No additions to the `/home-2`, `/home-3`, `/home-4` variant pages (they're left alone).
- No changes to `/projects` page beyond minor copy on the page header.
- No changes to the chat worker's deployment, model, or transport — only the `SYSTEM_PROMPT` constant.

## Scope: What Changes

### Stays on home (with rewritten copy)
- Hero
- Results section (reframed as "Track Record" with developer-relevant stats)
- ProjectsPreview (heading and lead-in rewritten; project data untouched)
- About (rewritten body; component shell untouched)
- Contact (CTA buttons + body text rewritten; component shell untouched)

### Removed from home, mounted at `/freelance` route
- Services
- HowItWorks
- WhoIWorkWith

The `/freelance` route renders the full original home (including original Hero copy, Services, HowItWorks, WhoIWorkWith, Results with original stats, original Contact with Calendly). It is reachable only by direct URL — not linked from any nav. This preserves the freelance pitch for returning clients without exposure to job-application visitors.

### Persistent UI elements
- **UrgencyBanner:** copy changes from "Currently booking for [month] · 2 SPOTS LEFT" to a neutral one-liner: `OPEN TO MID-LEVEL WEB DEVELOPER ROLES · AU/US REMOTE · 2026`. Component shell untouched.
- **StickyCTA:** button text changes from "BOOK A CALL" to `RESUME`, link changes from Calendly URL to `/resume.pdf`. Component shell untouched.
- **PixelAssistant button:** unchanged. Routes to `/talk`.
- **Navbar:** `NAV_ITEMS` data array changes — `Results` and `Services` removed, `Work` added pointing to `#projects`. Footer wording updated.

### Worker
- `worker/src/index.ts` `SYSTEM_PROMPT` rewritten for developer-portfolio context (see "Worker System Prompt" section).

## Voice & Positioning

**Role:** Web Developer (drop "for Service Businesses" suffix in `PERSONAL_INFO.role`).

**Positioning:** Mid-level web developer · 4 years experience · code + WordPress generalist · based in Cebu, Philippines · open to AU and US-remote roles.

**Tone rules:**
- No marketing-speak ("turn visitors into customers," "lead-generating")
- No sales CTAs ("book a call," "discovery call")
- No urgency framing ("Available for projects 2025," "2 spots left")
- Lead with evidence (shipped work, real outcomes), not promises
- Confident, not eager; direct, not hedged
- "Here's what I built" beats "I can build for you"

**What hiring managers should feel after 30 seconds on the home:** *"This person ships real work, has range across WordPress and modern JS, is mid-level seriously — not a junior pretending — and could join my team Monday."*

## Section-by-Section Copy

> All sections below dispatch their copy via `COPY[mode]` using the `useMode()` hook. The default mode is `"developer"` (route `/`); the `/freelance` route forces `"freelance"` and preserves the original strings exactly. Per-section copy fields (`headlineLine1`, `morphWords`, `verticalText`, `ctaPrimary`, `ctaSecondary`, `aboutTitle`, `aboutBody`, `contactBody`, etc.) are added to the `COPY` object during implementation as they're encountered. Implementation may consolidate or split these for ergonomics, but the principle holds: zero hardcoded strings remain in components for fields that differ between modes.

### `constants.tsx` — `PERSONAL_INFO` (split into mode-keyed copy)

`PERSONAL_INFO` keeps the truly invariant identity fields (`name`, `email`, `location`). The mode-varying fields (`role`, `tagline`, `subHeadline`, `availability`) move into the new `COPY` object so `/freelance` keeps its original strings while `/` gets the developer pitch.

```typescript
export const PERSONAL_INFO = {
  name: "Joji Shiotsuki",
  email: "jojishiotsuki0@gmail.com",
  location: "Cebu, Philippines",
};

export const COPY = {
  developer: {
    role: "Web Developer",
    tagline: "Web Developer · WordPress + JavaScript",
    subHeadline: "Mid-level web developer with 4 years shipping client sites, custom apps, and SEO-driven builds. WordPress (Bricks, Elementor) and modern JavaScript (React, TypeScript). Open to AU and US remote roles.",
    availability: "Open to AU/US remote roles",
    // ... per-section copy fields populated below
  },
  freelance: {
    role: "Web Developer for Service Businesses",
    tagline: "I Help Service Businesses Get Found on Google",
    subHeadline: "I build websites for barbershops, salons, clinics, cafes, and service businesses that rank on Google and turn visitors into paying customers. No fluff. Just results.",
    availability: "Available for projects",
    // ... original per-section copy preserved
  },
};
```

Components read via a tiny `useMode()` hook:
```typescript
// hooks/useMode.ts
import { useLocation } from 'react-router-dom';
export const useMode = (): 'developer' | 'freelance' =>
  useLocation().pathname.startsWith('/freelance') ? 'freelance' : 'developer';
```

**Note on "just words" constraint:** introducing `COPY` keyed by mode and a 5-line `useMode()` hook is content routing, not design. Zero visual elements, layouts, components, animations, fonts, or colors are added or changed. The mechanism exists solely so the same set of components renders different *strings* depending on which route is mounted.

### `constants.tsx` — `NAV_ITEMS` (mode-keyed)

```typescript
export const NAV_ITEMS = {
  developer: [
    { label: 'Work', href: '#projects' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ],
  freelance: [
    { label: 'Results', href: '#results' },
    { label: 'Services', href: '#services' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ],
} as const;
```

`Navbar.tsx` reads `NAV_ITEMS[mode]` via the `useMode()` hook. The freelance route preserves its original nav exactly.

### Hero (`components/Hero.tsx`)

All copy reads via `COPY[mode]` (using `useMode()` hook).

- Tagline kicker: `COPY[mode].role` → renders as `WEB DEVELOPER` on `/`, original `WEB DEVELOPER FOR SERVICE BUSINESSES` on `/freelance`.
- Vertical text: `COPY[mode].verticalText` — `OPEN TO ROLES // ${year}` for developer, `Available for Projects // ${year}` for freelance.
- Morph words: `COPY[mode].morphWords`:
  - developer: `["Sites", "Apps", "Tools", "Stores", "Microsites", "Dashboards"]`
  - freelance: `["Barbershops", "Salons", "Clinics", "Cafes", "Gyms", "Spas"]` (unchanged)
- Headline structure (3 lines): `COPY[mode].headlineLine1` / [morph] / `COPY[mode].headlineLine3`:
  - developer: `"I Build"` / [morph] / `"That Ship"`
  - freelance: `"I Help"` / [morph] / `"Get Found"` (unchanged)
- Subhead: `COPY[mode].subHeadline`.
- CTA buttons — read from `COPY[mode].ctaPrimary` and `COPY[mode].ctaSecondary`:
  - developer primary: `{ text: "View Work", href: "#projects" }`
  - developer secondary: `{ text: "Resume", href: "/resume.pdf" }`
  - freelance primary: `{ text: "Book a Call", href: "https://calendly.com/jojishiotsuki0/30min" }` (unchanged)
  - freelance secondary: `{ text: "See My Results", href: "#results" }` (unchanged)

### Results (`components/Results.tsx`)

Reframe as "Track Record" — developer-relevant proof.

- Section kicker: change `Proof` to `TRACK RECORD`
- Heading copy: replace any service-business framing with neutral developer-outcomes phrasing (will tune to existing line-break structure during implementation)
- Stats array — replace:
  ```typescript
  const stats = [
    { value: '4', label: 'Years Shipping' },
    { value: '12+', label: 'Sites Delivered' },
    { value: 'WP + JS', label: 'Production Stack' },
    { value: 'AU / US', label: 'Open To Remote' },
  ];
  ```
- Carousel images: keep `pundok-google-ranking.webp` and `pundok-screenshot.webp` (real work). Change `alt` text from "Pundok Studios ranking #1 on Google" to neutral developer-friendly: `"Pundok Studios — WordPress site I built, ranked #1 on Google for client"` and `"Pundok Studios homepage — barbershop site, Cebu"`. Keeps the proof, drops the sales tone.

### ProjectsPreview (`components/ProjectsPreview.tsx`)

- Section heading: change from current service framing (e.g., "Recent Wins" or similar) to `SELECTED WORK`.
- Lead-in copy: `"A mix of agency client builds, custom apps, and SEO-led sites. WordPress and React, mostly."`
- Project cards: data-driven from `PROJECTS` constant — no changes here unless a card has overt sales copy in its description (audit during implementation, sand off any "more bookings" / "more calls" / "service business" language in descriptions).

### About (`components/About.tsx`)

- Section kicker: keep `ABOUT` or change to `BACKGROUND`.
- Title (currently service-pitch framing): replace with something like `"Mid-level web developer. WordPress, React, and the bits in between."`
- Body paragraphs: rewrite to a developer bio. Draft:

  > Four years building for the web — agency client work, in-house tools, side projects that taught me how production really behaves. I started in WordPress (Bricks, Elementor, custom themes) and grew into modern JavaScript (React, TypeScript, Tailwind, Cloudflare Workers). Most of my shipped work is for small teams and agencies in the Philippines and US: marketing sites, e-commerce, SEO-driven builds, and the occasional custom app when an off-the-shelf plugin won't cut it.
  >
  > I care about what hiring managers also care about: things actually shipping, page speed that survives real traffic, SEO that holds up in audits, and code another developer can pick up without ceremony. I'm open to mid-level roles in AU and US remote.

- Stats grid (if `EXPERIENCE` constant feeds it): tune values to match — 4 years, 12+ sites, WordPress + React production, AU/US-remote.

### Contact (`components/Contact.tsx`)

- Kicker: keep `CONTACT` or change to `GET IN TOUCH`.
- Title: keep current bold heading style; copy options like `"Let's talk."` or `"Get in touch."`
- Body copy: replace service-availability framing with: `"Open to mid-level web developer roles in AU and US (remote). Drop me a line — happy to share work samples, walk through case studies, or just chat about a role."`
- CTA buttons (currently "Book a Call" → Calendly + "Email" → mailto):
  - Primary: `Email` → `mailto:${PERSONAL_INFO.email}`
  - Secondary: `Resume` → `/resume.pdf`
- Email display block (the small mono email at the bottom): keep as-is, it's already neutral.

### UrgencyBanner (`components/UrgencyBanner.tsx`)

Replace the dynamic month + spots-left text:
```jsx
<p style={textStyle} className="urgency-text">
  OPEN TO MID-LEVEL WEB DEVELOPER ROLES
  <span style={highlightStyle}>AU / US REMOTE</span>
</p>
```

### StickyCTA (`components/StickyCTA.tsx`)

- Button text: `"BOOK A CALL"` → `"RESUME"`
- href: `"https://calendly.com/jojishiotsuki0/30min"` → `"/resume.pdf"`
- Pulse dot: keep (it draws attention without being sales-y).

### Footer (`components/Footer.tsx`)

- Tagline beneath the `[JOJI.DEV]` logo: change from `"I help service businesses in the Philippines and US get found on Google and generate leads."` to `"Web developer based in Cebu. Available for mid-level roles, AU and US remote."`
- Location chip text (`Philippines | United States`): keep.
- Social icons: keep all (TikTok, LinkedIn, GitHub, Instagram, mailto). Drop `Website` link from `SOCIAL_LINKS` since it's circular (links to own site).

### Worker System Prompt (`worker/src/index.ts`)

Rewrite `SYSTEM_PROMPT` constant. New shape:

- **Identity:** AI assistant for Joji's portfolio. Speaks on behalf of Joji to visitors who are likely hiring managers, recruiters, or fellow developers.
- **Goal:** Answer questions about Joji's experience, stack, work, and availability. Help visitors quickly understand if Joji is a fit for a role they're hiring for. Surface relevant projects when asked.
- **Tone:** Confident, direct, no marketing-speak. Like Joji texting a friend who's a recruiter.
- **Proof points (factual):**
  - 4 years building for the web (agency + freelance)
  - 8+ WordPress client builds (Bricks, Elementor, custom booking calculators, multi-location SEO, schema)
  - React/TypeScript apps (Vertex productivity tool, KontentFire SaaS)
  - This portfolio site itself: React 19, TypeScript, Vite, Tailwind 4, Cloudflare Workers — three home variants (Editorial, Pixel, Glass)
  - Based in Cebu, Philippines · open to AU and US remote roles · mid-level
- **No-go behaviors:** No "book a call" pitching. No urgency. No sales framing. If asked about availability/rates/freelance, be direct: "I'm primarily applying for full-time roles right now. If you're hiring, here's how to reach Joji directly: [email]."
- **Hand-off:** When the visitor signals interest in hiring or wants to talk further, surface email + LinkedIn + resume link instead of a Calendly URL.

Concrete prompt text drafted in implementation phase.

### `App.tsx` — Routing

Add a new route below the existing `/` route:

```typescript
<Route path="/freelance" element={<FreelancePage />} />
```

`FreelancePage` is a new tiny component that mounts the original home: `<Hero />` + `<Results />` + `<Services />` + `<HowItWorks />` + `<WhoIWorkWith />` + `<ProjectsPreview />` + `<About />` + `<Contact />`. Critically, the Hero, Results, About, Contact rendered here use the **original** service-business copy, not the new developer copy.

This means we either:

- **(A)** Have `Hero`, `Results`, `About`, `Contact` accept a `mode: "developer" | "freelance"` prop that selects the copy, or
- **(B)** Move the copy strings out of components into `constants.tsx` keyed by mode, components read from a context/prop.

**Decision: (B) — keyed copy in `constants.tsx`.** Simpler, no prop drilling, easy to add modes later. Add `COPY` export with `developer` and `freelance` keys; components consume via a tiny `useMode()` hook that reads route. Path-based: if `location.pathname === "/freelance"`, mode is `freelance`; else `developer`.

This is a small structural change but no visual change — fits inside the "words only" constraint.

## Configuration Changes

| File | Change |
|------|--------|
| `constants.tsx` | `PERSONAL_INFO`, `NAV_ITEMS`, new `COPY` object keyed by mode, `SOCIAL_LINKS` (drop Website self-link) |
| `App.tsx` | Add `/freelance` route, add `<FreelancePage />` lazy import |
| `components/FreelancePage.tsx` | **New file** — composes original home with `freelance` mode |
| `components/Hero.tsx` | Read morph words + line-1/line-3 from `COPY[mode]`; CTAs from `COPY[mode]` |
| `components/Results.tsx` | Stats + kicker + heading from `COPY[mode]` |
| `components/ProjectsPreview.tsx` | Section heading + lead-in from `COPY[mode]` |
| `components/About.tsx` | Body paragraphs + title from `COPY[mode]` |
| `components/Contact.tsx` | Body + CTA labels/hrefs from `COPY[mode]` |
| `components/UrgencyBanner.tsx` | Banner text from `COPY[mode]` |
| `components/StickyCTA.tsx` | Button text + href from `COPY[mode]` |
| `components/Footer.tsx` | Tagline from `COPY[mode]`; drop self-Website social link |
| `components/Navbar.tsx` | Reads `NAV_ITEMS` (already does) — no code change beyond data |
| `hooks/useMode.ts` | **New file** — tiny hook returning `"developer" \| "freelance"` based on route |
| `worker/src/index.ts` | Rewrite `SYSTEM_PROMPT` |

Note: project descriptions in `PROJECTS` array are read by both modes. Audit each description for service-business phrasing that's too sales-y (e.g., "more bookings," "service businesses") and rewrite to neutral developer phrasing that works in both contexts.

## Prerequisites (block until resolved)

1. **Resume PDF — RESOLVED.** Source file exists at `C:\Users\Shiot\Downloads\Joji_Shiotsuki_Resume.docx (1).pdf` (94 KB). Implementation plan will copy and rename it to `public/resume.pdf`.
2. **Verify experience numbers** — confirm "4 years" matches the start of agency/freelance work (Joji confirmed during brainstorming). Confirm "12+ sites" matches actual count in `PROJECTS` data (currently 8–10 in the websites category — adjust the stat to the real count during implementation).
3. **AU/US-remote messaging** — Joji has confirmed both, no further validation needed.

## Out of Scope

- Visual design changes (explicit non-goal)
- New routes beyond `/freelance`
- Resume PDF authoring (treated as a prerequisite, not part of this work)
- LinkedIn / GitHub profile updates (separate effort)
- The three home variant pages (`/home-2`, `/home-3`, `/home-4`) — left alone unless a quick copy sweep is needed for consistency
- SEO / meta tag updates beyond what naturally results from copy changes
- Analytics or tracking changes

## Acceptance Criteria

A hiring manager opens `jojishiotsuki.com` cold and within 30 seconds:

- ☐ Sees role positioning ("Web Developer") and seniority ("mid-level") clearly
- ☐ Sees the geographic availability (AU/US remote)
- ☐ Sees concrete evidence (shipped work, stack, years)
- ☐ Has a way to download a resume and contact via email — with no prompt to "book a call"
- ☐ Sees no urgency framing or sales language
- ☐ Can chat with the assistant about Joji's work without being pitched a discovery call
- ☐ The site visually looks identical to before (same design, layout, animations, theme)

A returning freelance client visits `jojishiotsuki.com/freelance` and sees the original service-business pitch intact (Services, HowItWorks, WhoIWorkWith, Calendly CTAs).
