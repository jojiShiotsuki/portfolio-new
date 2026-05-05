# Portfolio Repositioning to Job-Application Mode — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reposition `jojishiotsuki.com` from a freelance/service-business pitch into a job-application portfolio for mid-level web developer roles (AU + US remote), while archiving the original service-business pages off-nav at `/freelance`.

**Architecture:** Strictly content-only changes. A new `useMode()` hook plus a `COPY` object in `constants.tsx` keyed by `developer | freelance` route components to read different strings depending on which route mounted them. Zero design, layout, animation, or component-shell changes. New route `/freelance` mounts a `FreelancePage` that composes the original home with the original copy. The Cloudflare Worker chat assistant gets a new `SYSTEM_PROMPT` aligned to the developer-portfolio context.

**Tech Stack:** React 19 + TypeScript, Vite 6, Tailwind 4, react-router-dom 7, Cloudflare Workers (chat). No test framework currently configured — verification per task is `tsc --noEmit` + `npm run build`. Final task adds a Playwright smoke test via the `playwright` MCP browser tools to verify both routes render the right copy.

**Spec reference:** `docs/superpowers/specs/2026-05-05-portfolio-job-repositioning-design.md`

**Migration strategy:** Additive first, cleanup last. Task 2 adds the `COPY` object **alongside** the existing `PERSONAL_INFO` fields so unmigrated components keep building. Tasks 3–8 migrate components one at a time; build is green after each commit. Task 12 removes the now-obsolete `PERSONAL_INFO.role/tagline/subHeadline/availability` fields and consolidates.

---

## File Structure

**New files:**
- `hooks/useMode.ts` — 5-line route-aware mode hook
- `components/FreelancePage.tsx` — composes original home for `/freelance` route
- `public/resume.pdf` — copied from `C:\Users\Shiot\Downloads\Joji_Shiotsuki_Resume.docx (1).pdf`

**Modified files:**
- `types.ts` — add `Mode` and `ModeCopy` types; update `NavItem` usage
- `constants.tsx` — split `PERSONAL_INFO`, add `COPY` object, mode-keyed `NAV_ITEMS`, drop self-Website from `SOCIAL_LINKS`, sand off service-business phrasing in `PROJECTS` descriptions
- `App.tsx` — add `/freelance` route + lazy import
- `components/Hero.tsx` — read from `COPY[mode]`, swap CTAs
- `components/Results.tsx` — read from `COPY[mode]`, replace stats
- `components/ProjectsPreview.tsx` — read from `COPY[mode]` for header + lead-in
- `components/About.tsx` — read from `COPY[mode]` for title + body
- `components/Contact.tsx` — read from `COPY[mode]` for body + CTAs
- `components/UrgencyBanner.tsx` — read from `COPY[mode]`
- `components/StickyCTA.tsx` — read from `COPY[mode]` for text + href
- `components/Footer.tsx` — read from `COPY[mode]` for tagline; consume revised `SOCIAL_LINKS`
- `components/Navbar.tsx` — read from `NAV_ITEMS[mode]`
- `worker/src/index.ts` — rewrite `SYSTEM_PROMPT`

---

## Task 1: Foundation — Mode types, useMode hook, resume PDF

**Files:**
- Modify: `types.ts`
- Create: `hooks/useMode.ts`
- Create: `public/resume.pdf`

- [ ] **Step 1.1: Copy the resume PDF**

```bash
cp "/c/Users/Shiot/Downloads/Joji_Shiotsuki_Resume.docx (1).pdf" public/resume.pdf
ls -la public/resume.pdf
```

Expected: file exists in `public/`, ~94 KB.

- [ ] **Step 1.2: Add Mode type to `types.ts`**

Append to `types.ts`:

```typescript
export type Mode = 'developer' | 'freelance';
```

- [ ] **Step 1.3: Create `hooks/useMode.ts`**

Create file with:

```typescript
import { useLocation } from 'react-router-dom';
import type { Mode } from '../types';

export const useMode = (): Mode =>
  useLocation().pathname.startsWith('/freelance') ? 'freelance' : 'developer';
```

- [ ] **Step 1.4: Type-check**

Run: `npx tsc --noEmit`
Expected: PASS (no errors).

- [ ] **Step 1.5: Commit**

```bash
git add public/resume.pdf types.ts hooks/useMode.ts
git commit -m "feat: add useMode hook, Mode type, and resume PDF asset"
```

---

## Task 2: Constants — COPY object, mode-keyed NAV_ITEMS, sand off SOCIAL_LINKS

**Files:**
- Modify: `constants.tsx` (replace head section, keep `PROJECTS` / `EXPERIENCE` / `SERVICES` arrays unchanged for now)

This task is additive at the type level — it adds the `COPY` and revised `NAV_ITEMS` structures alongside the existing `PERSONAL_INFO` fields so components that still reference `PERSONAL_INFO.role` / `.subHeadline` / etc. keep building. Task 12 cleans them up.

- [ ] **Step 2.1: Edit `constants.tsx`**

Replace the top section (imports through `SOCIAL_LINKS`) with:

```typescript
import {
  Github,
  Linkedin,
  Globe,
  Instagram,
  Layout,
  LineChart,
  Wrench,
  Music2
} from 'lucide-react';
import { NavItem, SocialLink, Project, Experience, Service, Mode } from './types';

// --- IDENTITY (mode-invariant) ---

export const PERSONAL_INFO = {
  name: "Joji Shiotsuki",
  email: "jojishiotsuki0@gmail.com",
  location: "Cebu, Philippines",
  // The fields below are retained as DEPRECATED for backwards compatibility
  // until all components migrate to COPY[mode]. Removed in Task 12.
  role: "Web Developer",
  tagline: "Web Developer · WordPress + JavaScript",
  subHeadline: "Mid-level web developer with 4 years shipping client sites, custom apps, and SEO-driven builds. WordPress (Bricks, Elementor) and modern JavaScript (React, TypeScript). Open to AU and US remote roles.",
  availability: "Open to AU/US remote roles",
};

// --- MODE-KEYED COPY ---

interface CtaButton {
  text: string;
  href: string;
}

interface ModeCopy {
  // Identity / framing
  role: string;
  tagline: string;
  subHeadline: string;
  availability: string;

  // Hero
  heroVerticalText: string;
  heroMorphWords: string[];
  heroHeadlineLine1: string;
  heroHeadlineLine3: string;
  heroCtaPrimary: CtaButton;
  heroCtaSecondary: CtaButton;

  // Results section
  resultsKicker: string;
  resultsHeadlineLine1: string;
  resultsHeadlineLine2: string;
  resultsStats: { value: string; label: string }[];
  resultsCarouselAlts: string[];

  // ProjectsPreview
  projectsKicker: string;
  projectsHeadlineLine1: string;
  projectsHeadlineLine2: string;
  projectsLeadIn: string;

  // About
  aboutKicker: string;
  aboutTitle: string;
  aboutBody: string[]; // paragraphs

  // Contact
  contactKicker: string;
  contactTitle: string;
  contactBody: string;
  contactCtaPrimary: CtaButton;
  contactCtaSecondary: CtaButton;

  // UrgencyBanner
  bannerText: string;
  bannerBadge: string;

  // StickyCTA
  stickyCtaText: string;
  stickyCtaHref: string;

  // Footer
  footerTagline: string;
}

export const COPY: Record<Mode, ModeCopy> = {
  developer: {
    role: "Web Developer",
    tagline: "Web Developer · WordPress + JavaScript",
    subHeadline: "Mid-level web developer with 4 years shipping client sites, custom apps, and SEO-driven builds. WordPress (Bricks, Elementor) and modern JavaScript (React, TypeScript). Open to AU and US remote roles.",
    availability: "Open to AU/US remote roles",

    heroVerticalText: `Open to Roles // ${new Date().getFullYear()}`,
    heroMorphWords: ["Sites", "Apps", "Tools", "Stores", "Microsites", "Dashboards"],
    heroHeadlineLine1: "I Build",
    heroHeadlineLine3: "That Ship",
    heroCtaPrimary: { text: "View Work", href: "#projects" },
    heroCtaSecondary: { text: "Resume", href: "/resume.pdf" },

    resultsKicker: "TRACK RECORD",
    resultsHeadlineLine1: "Real Work,",
    resultsHeadlineLine2: "Shipped & Live",
    resultsStats: [
      { value: "4", label: "Years Shipping" },
      { value: "10+", label: "Sites Delivered" },
      { value: "WP + JS", label: "Production Stack" },
      { value: "AU / US", label: "Open To Remote" },
    ],
    resultsCarouselAlts: [
      "Pundok Studios — WordPress site I built, ranked #1 on Google for client",
      "Pundok Studios homepage — barbershop site, Cebu",
    ],

    projectsKicker: "SELECTED WORK",
    projectsHeadlineLine1: "Recent",
    projectsHeadlineLine2: "Projects",
    projectsLeadIn: "A mix of agency client builds, custom apps, and SEO-led sites. WordPress and React, mostly.",

    aboutKicker: "BACKGROUND",
    aboutTitle: "Mid-level web developer. WordPress, React, and the bits in between.",
    aboutBody: [
      "Four years building for the web — agency client work, in-house tools, side projects that taught me how production really behaves. I started in WordPress (Bricks, Elementor, custom themes) and grew into modern JavaScript (React, TypeScript, Tailwind, Cloudflare Workers).",
      "Most of my shipped work is for small teams and agencies in the Philippines and US: marketing sites, e-commerce, SEO-driven builds, and the occasional custom app when an off-the-shelf plugin won't cut it. I care about what hiring managers also care about: things actually shipping, page speed that survives real traffic, SEO that holds up in audits, and code another developer can pick up without ceremony.",
      "Open to mid-level web developer roles in AU and US (remote).",
    ],

    contactKicker: "GET IN TOUCH",
    contactTitle: "Let's talk.",
    contactBody: "Open to mid-level web developer roles in AU and US (remote). Drop me a line — happy to share work samples, walk through case studies, or just chat about a role.",
    contactCtaPrimary: { text: "Email", href: "mailto:jojishiotsuki0@gmail.com" },
    contactCtaSecondary: { text: "Resume", href: "/resume.pdf" },

    bannerText: "OPEN TO MID-LEVEL WEB DEVELOPER ROLES",
    bannerBadge: "AU / US REMOTE",

    stickyCtaText: "RESUME",
    stickyCtaHref: "/resume.pdf",

    footerTagline: "Web developer based in Cebu. Available for mid-level roles, AU and US remote.",
  },

  freelance: {
    role: "Web Developer for Service Businesses",
    tagline: "I Help Service Businesses Get Found on Google",
    subHeadline: "I build websites for barbershops, salons, clinics, cafes, and service businesses that rank on Google and turn visitors into paying customers. No fluff. Just results.",
    availability: "Available for projects",

    heroVerticalText: `Available for Projects // ${new Date().getFullYear()}`,
    heroMorphWords: ["Barbershops", "Salons", "Clinics", "Cafes", "Gyms", "Spas"],
    heroHeadlineLine1: "I Help",
    heroHeadlineLine3: "Get Found",
    heroCtaPrimary: { text: "Book a Call", href: "https://calendly.com/jojishiotsuki0/30min" },
    heroCtaSecondary: { text: "See My Results", href: "#results" },

    resultsKicker: "Proof",
    resultsHeadlineLine1: "Real Results,",
    resultsHeadlineLine2: "Real Businesses",
    resultsStats: [
      { value: "#1", label: "Google Ranking" },
      { value: "60%", label: "More Walk-ins" },
      { value: "More", label: "Inquiries & Bookings" },
      { value: "100%", label: "Client Satisfaction" },
    ],
    resultsCarouselAlts: [
      "Pundok Studios ranking #1 on Google search results",
      "Pundok Studios website homepage",
    ],

    projectsKicker: "Portfolio",
    projectsHeadlineLine1: "Other",
    projectsHeadlineLine2: "Projects",
    projectsLeadIn: "While I specialize in service business websites, here's some other work I've done showcasing my technical skills.",

    aboutKicker: "ABOUT",
    aboutTitle: "I help service businesses win online.",
    aboutBody: [
      "I'm a web developer based in Cebu, Philippines, focused on building high-converting websites and local SEO systems for service businesses.",
      "I work with barbershops, salons, clinics, cafes, gyms, and spas — primarily in the Philippines, with select clients in the US. The goal is simple: get you found on Google and turn visitors into paying customers.",
    ],

    contactKicker: "CONTACT",
    contactTitle: "Let's build something.",
    contactBody: "Tell me about your service business and what you're trying to grow. I'll show you how to get found on Google and turn your website into a lead-generating machine.",
    contactCtaPrimary: { text: "Book a Call", href: "https://calendly.com/jojishiotsuki0/30min" },
    contactCtaSecondary: { text: "Email", href: "mailto:jojishiotsuki0@gmail.com" },

    bannerText: `Currently booking for ${new Date().toLocaleString('default', { month: 'long' })}`,
    bannerBadge: "2 SPOTS LEFT",

    stickyCtaText: "BOOK A CALL",
    stickyCtaHref: "https://calendly.com/jojishiotsuki0/30min",

    footerTagline: "I help service businesses in the Philippines and US get found on Google and generate leads.",
  },
};

// --- NAVIGATION (mode-keyed) ---

export const NAV_ITEMS: Record<Mode, NavItem[]> = {
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
};

// --- SOCIAL LINKS ---

export const SOCIAL_LINKS: SocialLink[] = [
  { platform: 'TikTok', url: 'https://tiktok.com/@_shiotsuki', icon: Music2 },
  { platform: 'LinkedIn', url: 'https://linkedin.com/in/jojishiotsuki', icon: Linkedin },
  { platform: 'GitHub', url: 'https://github.com/jojiShiotsuki', icon: Github },
  { platform: 'Instagram', url: 'https://instagram.com/_shiotsuki', icon: Instagram },
];
```

Note: the self-referencing `Website` social link (with the `Globe` icon) is removed. The `Globe` import is left in the import list because it's harmless; if `tsc --noEmit` flags it as unused with strict settings, also remove `Globe` from the imports.

- [ ] **Step 2.2: Type-check**

Run: `npx tsc --noEmit`
Expected: PASS — `NAV_ITEMS` has changed shape (was `NavItem[]`, now `Record<Mode, NavItem[]>`), so `Navbar.tsx` will fail to compile if it does `NAV_ITEMS.map(...)` directly. **If type errors surface in `Navbar.tsx` referencing `NAV_ITEMS`, that's expected — Task 8 fixes Navbar.** Continue if `Navbar.tsx` is the only file failing. Otherwise, fix any other unintended errors before committing.

If `Navbar.tsx` is the only error: temporarily make `NAV_ITEMS` reverse-compatible by exporting an additional alias for the freelance array as the legacy default. Add at the bottom of `constants.tsx`:

```typescript
// Legacy alias — remove in Task 12 after Navbar migrates
export const NAV_ITEMS_LEGACY: NavItem[] = NAV_ITEMS.freelance;
```

Then in `components/Navbar.tsx`, change the import line `import { NAV_ITEMS } from ...` to `import { NAV_ITEMS_LEGACY as NAV_ITEMS } from ...`. This is a 1-line change to keep the build green; Task 8 reverses it.

- [ ] **Step 2.3: Run dev build**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 2.4: Commit**

```bash
git add constants.tsx components/Navbar.tsx
git commit -m "feat: add COPY mode-keyed object and mode-keyed NAV_ITEMS"
```

---

## Task 3: Migrate Hero, UrgencyBanner, StickyCTA

**Files:**
- Modify: `components/Hero.tsx`
- Modify: `components/UrgencyBanner.tsx`
- Modify: `components/StickyCTA.tsx`

- [ ] **Step 3.1: Migrate `components/Hero.tsx`**

Replace the top imports + `BUSINESS_WORDS` constant + the relevant render blocks. Specifically:

Add to imports:
```typescript
import { COPY } from '../constants';
import { useMode } from '../hooks/useMode';
```

Remove:
```typescript
const BUSINESS_WORDS = ["Barbershops", "Salons", "Clinics", "Cafes", "Gyms", "Spas"];
```

Inside the `Hero` component body, after `const { theme } = useTheme();`, add:
```typescript
const mode = useMode();
const copy = COPY[mode];
```

Replace `PERSONAL_INFO.role` with `copy.role` (in the tagline kicker, line ~178).

Replace `PERSONAL_INFO.subHeadline` with `copy.subHeadline` (line ~199).

Replace the vertical text content (line ~164):
```jsx
{`Available for Projects // ${new Date().getFullYear()}`}
```
with:
```jsx
{copy.heroVerticalText}
```

Replace the headline lines (lines ~182–195):
- `I Help` → `{copy.heroHeadlineLine1}`
- `texts={BUSINESS_WORDS}` → `texts={copy.heroMorphWords}`
- `Get Found` → `{copy.heroHeadlineLine3}`

Replace the two CTA buttons (lines ~203–212):
```jsx
<InteractiveHoverButton
  text={copy.heroCtaPrimary.text}
  variant="primary"
  href={copy.heroCtaPrimary.href}
/>
<InteractiveHoverButton
  text={copy.heroCtaSecondary.text}
  variant="outline"
  href={copy.heroCtaSecondary.href}
/>
```

- [ ] **Step 3.2: Migrate `components/UrgencyBanner.tsx`**

Add imports:
```typescript
import { COPY } from '../constants';
import { useMode } from '../hooks/useMode';
```

Inside the component body, after `const { theme } = useTheme();`, add:
```typescript
const mode = useMode();
const copy = COPY[mode];
```

Replace the banner text (lines ~58–61):
```jsx
<p style={textStyle} className="urgency-text">
  {copy.bannerText}
  <span style={highlightStyle}>{copy.bannerBadge}</span>
</p>
```

- [ ] **Step 3.3: Migrate `components/StickyCTA.tsx`**

Add imports:
```typescript
import { COPY } from '../constants';
import { useMode } from '../hooks/useMode';
```

Inside the component body, after `const { theme } = useTheme();`, add:
```typescript
const mode = useMode();
const copy = COPY[mode];
```

Replace the InteractiveHoverButton (lines ~53–58):
```jsx
<InteractiveHoverButton
  text={copy.stickyCtaText}
  variant="primary"
  href={copy.stickyCtaHref}
  style={{ padding: '18px 32px', fontSize: '14px', boxShadow: `0 4px 30px ${theme.accentGlow}` }}
/>
```

- [ ] **Step 3.4: Type-check + build**

Run: `npx tsc --noEmit && npm run build`
Expected: PASS.

- [ ] **Step 3.5: Commit**

```bash
git add components/Hero.tsx components/UrgencyBanner.tsx components/StickyCTA.tsx
git commit -m "feat: migrate Hero, UrgencyBanner, StickyCTA to mode-keyed COPY"
```

---

## Task 4: Migrate Results

**Files:**
- Modify: `components/Results.tsx`

- [ ] **Step 4.1: Replace the local `stats` and `carouselImages` arrays + the kicker/headline blocks**

Add imports:
```typescript
import { COPY } from '../constants';
import { useMode } from '../hooks/useMode';
```

Remove the local `stats` array (lines 16–21) and the inline `carouselImages` literal — replace `carouselImages` with a derived value inside the component:

Inside the component body, after `const { theme } = useTheme();`:

```typescript
const mode = useMode();
const copy = COPY[mode];
const stats = copy.resultsStats;
const carouselImages = [
  { src: '/pundok-google-ranking.webp', alt: copy.resultsCarouselAlts[0] },
  { src: '/pundok-screenshot.webp', alt: copy.resultsCarouselAlts[1] },
];
```

Replace the kicker text in the `<div>` that currently renders `Proof` (around line 54) with `{copy.resultsKicker}`.

Replace the heading content. Find the `<h2>` that contains the section headline (around line 57). The current structure is two-line; preserve the structure but replace the text with:
- Line 1 → `{copy.resultsHeadlineLine1}`
- Line 2 → `{copy.resultsHeadlineLine2}`

Read the file at `components/Results.tsx` lines 60–110 to find the exact JSX shape and make minimal edits. Do not change any styles or wrapping markup.

- [ ] **Step 4.2: Type-check + build**

Run: `npx tsc --noEmit && npm run build`
Expected: PASS.

- [ ] **Step 4.3: Commit**

```bash
git add components/Results.tsx
git commit -m "feat: migrate Results to mode-keyed COPY"
```

---

## Task 5: Migrate ProjectsPreview

**Files:**
- Modify: `components/ProjectsPreview.tsx`

- [ ] **Step 5.1: Replace the header + lead-in copy**

Add imports:
```typescript
import { COPY } from '../constants';
import { useMode } from '../hooks/useMode';
```

Inside the `ProjectsPreview` component body (around line 224), after `const { theme } = useTheme();`, add:
```typescript
const mode = useMode();
const copy = COPY[mode];
```

Replace the kicker text (currently `Portfolio` around line 277) with `{copy.projectsKicker}`.

Replace the `<h2>` content (around line 279):
```jsx
<h2 style={titleStyle}>
  {copy.projectsHeadlineLine1}<br />
  <span style={{ color: 'transparent', WebkitTextStroke: `2px ${theme.accentLight}` }}>{copy.projectsHeadlineLine2}</span>
</h2>
```

Replace the lead-in `<p>` text (around line 291):
```jsx
{copy.projectsLeadIn}
```

- [ ] **Step 5.2: Type-check + build**

Run: `npx tsc --noEmit && npm run build`
Expected: PASS.

- [ ] **Step 5.3: Commit**

```bash
git add components/ProjectsPreview.tsx
git commit -m "feat: migrate ProjectsPreview to mode-keyed COPY"
```

---

## Task 6: Migrate About

**Files:**
- Modify: `components/About.tsx`

- [ ] **Step 6.1: Identify the existing kicker, title, and body locations**

Read the full file `components/About.tsx`. Find the `<div>` that contains the kicker (likely renders text like `ABOUT` or similar), the `<h2>` for the title, and the paragraphs for the body.

- [ ] **Step 6.2: Migrate copy to `COPY[mode]`**

Add imports:
```typescript
import { COPY } from '../constants';
import { useMode } from '../hooks/useMode';
```

Inside the component body, after `const { theme } = useTheme();`:
```typescript
const mode = useMode();
const copy = COPY[mode];
```

Replace the kicker text with `{copy.aboutKicker}`.

Replace the `<h2>` body with `{copy.aboutTitle}`.

Replace the paragraph stack — the body is now an array of paragraph strings. Render with:
```jsx
{copy.aboutBody.map((paragraph, i) => (
  <p key={i} style={textStyle}>{paragraph}</p>
))}
```

Preserve any existing `highlightStyle` usage inside paragraphs only if the original About had inline highlights — if it did, keep them; if not, leave the simpler form above.

If the existing About also renders `EXPERIENCE` or stats based on `EXPERIENCE` constant, do not change those references in this task. They stay the same and read from existing data.

- [ ] **Step 6.3: Type-check + build**

Run: `npx tsc --noEmit && npm run build`
Expected: PASS.

- [ ] **Step 6.4: Commit**

```bash
git add components/About.tsx
git commit -m "feat: migrate About to mode-keyed COPY"
```

---

## Task 7: Migrate Contact

**Files:**
- Modify: `components/Contact.tsx`

- [ ] **Step 7.1: Migrate copy to `COPY[mode]`**

Add imports:
```typescript
import { COPY } from '../constants';
import { useMode } from '../hooks/useMode';
```

Inside the component body, after `const { theme } = useTheme();`:
```typescript
const mode = useMode();
const copy = COPY[mode];
```

Replace the kicker text (the small mono label near top of the section) with `{copy.contactKicker}`.

Replace the `<h1>` (around line 35) body with `{copy.contactTitle}`.

Replace the description paragraph (around line 43) body with `{copy.contactBody}`.

Replace the two `<InteractiveHoverButton>` CTAs in the `ctaContainer` (the existing buttons that link to `#book` / Calendly / mailto). The new render:
```jsx
<InteractiveHoverButton
  text={copy.contactCtaPrimary.text}
  variant="primary"
  href={copy.contactCtaPrimary.href}
/>
<InteractiveHoverButton
  text={copy.contactCtaSecondary.text}
  variant="outline"
  href={copy.contactCtaSecondary.href}
/>
```

The small mono email display block at the bottom (using `PERSONAL_INFO.email`) stays exactly as-is.

- [ ] **Step 7.2: Type-check + build**

Run: `npx tsc --noEmit && npm run build`
Expected: PASS.

- [ ] **Step 7.3: Commit**

```bash
git add components/Contact.tsx
git commit -m "feat: migrate Contact to mode-keyed COPY"
```

---

## Task 8: Migrate Navbar and Footer

**Files:**
- Modify: `components/Navbar.tsx`
- Modify: `components/Footer.tsx`

- [ ] **Step 8.1: Migrate `components/Navbar.tsx`**

If Task 2 added the `NAV_ITEMS_LEGACY` alias, undo that workaround now: change the import in `Navbar.tsx` back to:
```typescript
import { NAV_ITEMS } from '../constants';
```

Add:
```typescript
import { useMode } from '../hooks/useMode';
```

Inside the component body, after the existing hooks (around `const { mode: themeMode, theme, toggleTheme } = useTheme();`), pick a different name for the page mode to avoid colliding with `theme.mode`:
```typescript
const pageMode = useMode();
const navItems = NAV_ITEMS[pageMode];
```

Find any place the component currently iterates `NAV_ITEMS` (e.g. `NAV_ITEMS.map(...)`) and change it to `navItems.map(...)`. If the component had been reading from `NAV_ITEMS_LEGACY` via the alias, it's already in scope as `NAV_ITEMS` — just confirm the iteration uses `navItems`.

Note: `useTheme()` already returns a property named `mode` (light/dark). The variable `pageMode` keeps the route-mode separate. Do not rename either.

- [ ] **Step 8.2: Migrate `components/Footer.tsx`**

Add imports:
```typescript
import { COPY } from '../constants';
import { useMode } from '../hooks/useMode';
```

Inside the component body, after `const { theme } = useTheme();`:
```typescript
const mode = useMode();
const copy = COPY[mode];
```

Replace the tagline text (around line 89, currently `"I help service businesses in the Philippines and US..."`) with `{copy.footerTagline}`.

Confirm the `SOCIAL_LINKS.map(...)` block now renders 4 icons (TikTok, LinkedIn, GitHub, Instagram) — no `Website` self-link. If the JSX renders them in the order from `SOCIAL_LINKS`, no further change is needed.

- [ ] **Step 8.3: Remove `NAV_ITEMS_LEGACY` alias from `constants.tsx`**

If Step 2.2 added the legacy alias:
```typescript
export const NAV_ITEMS_LEGACY: NavItem[] = NAV_ITEMS.freelance;
```
delete that line. It's no longer referenced.

- [ ] **Step 8.4: Type-check + build**

Run: `npx tsc --noEmit && npm run build`
Expected: PASS.

- [ ] **Step 8.5: Commit**

```bash
git add components/Navbar.tsx components/Footer.tsx constants.tsx
git commit -m "feat: migrate Navbar and Footer to mode-keyed copy and remove legacy alias"
```

---

## Task 9: FreelancePage and `/freelance` route

**Files:**
- Create: `components/FreelancePage.tsx`
- Modify: `App.tsx`

- [ ] **Step 9.1: Create `components/FreelancePage.tsx`**

Create file with:

```typescript
import React from 'react';
import Hero from './Hero';
import Results from './Results';
import Services from './Services';
import HowItWorks from './HowItWorks';
import WhoIWorkWith from './WhoIWorkWith';
import ProjectsPreview from './ProjectsPreview';
import About from './About';
import Contact from './Contact';

const FreelancePage: React.FC = () => (
  <>
    <Hero />
    <Results />
    <Services />
    <HowItWorks />
    <WhoIWorkWith />
    <ProjectsPreview />
    <About />
    <Contact />
  </>
);

export default FreelancePage;
```

- [ ] **Step 9.2: Add the `/freelance` route to `App.tsx`**

Add the lazy import alongside the other lazy imports (around line 23):
```typescript
const FreelancePage = React.lazy(() => import('./components/FreelancePage'));
```

Add the route inside `<Routes>` (after `/` and before `/home-2`):
```typescript
<Route path="/freelance" element={<FreelancePage />} />
```

- [ ] **Step 9.3: Type-check + build**

Run: `npx tsc --noEmit && npm run build`
Expected: PASS.

- [ ] **Step 9.4: Manually verify both routes load**

Run: `npm run dev`

Open `http://localhost:5173/` — verify:
- Hero says "I Build [Sites] That Ship"
- Tagline says "Web Developer"
- Vertical text says "Open to Roles // 2026"
- Sticky CTA (after scrolling) says "RESUME"
- Banner says "OPEN TO MID-LEVEL WEB DEVELOPER ROLES · AU / US REMOTE"

Open `http://localhost:5173/freelance` — verify:
- Hero says "I Help [Barbershops] Get Found"
- Tagline says "Web Developer for Service Businesses"
- Vertical text says "Available for Projects // 2026"
- Services / How It Works / Who I Work With sections render
- Sticky CTA says "BOOK A CALL"
- Banner says "Currently booking for [month] · 2 SPOTS LEFT"

Stop the dev server (Ctrl+C).

- [ ] **Step 9.5: Commit**

```bash
git add components/FreelancePage.tsx App.tsx
git commit -m "feat: add FreelancePage component and /freelance route"
```

---

## Task 10: Worker SYSTEM_PROMPT rewrite

**Files:**
- Modify: `worker/src/index.ts` (only the `SYSTEM_PROMPT` constant; nothing else changes)

- [ ] **Step 10.1: Read the current `SYSTEM_PROMPT` block**

Read `worker/src/index.ts` and locate the `const SYSTEM_PROMPT = \`...\`;` block (starts around line 13). Note the start and end lines so you can replace the block precisely.

- [ ] **Step 10.2: Replace the `SYSTEM_PROMPT` block**

Replace the entire `const SYSTEM_PROMPT = \`...\`;` template literal with:

```typescript
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
```

- [ ] **Step 10.3: Verify the worker still type-checks**

Run from project root: `cd worker && npx tsc --noEmit`
Expected: PASS. Return to project root: `cd ..`

- [ ] **Step 10.4: Commit**

```bash
git add worker/src/index.ts
git commit -m "feat: rewrite chat worker SYSTEM_PROMPT for developer-portfolio context"
```

Note: the deployed worker is updated separately via Wrangler/CI — that deployment is out of scope for this plan and happens at the user's discretion after merge.

---

## Task 11: Audit and sand off project descriptions

**Files:**
- Modify: `constants.tsx` (the `PROJECTS` array, individual `.description` and `.challenge` / `.solution` strings only)

The `PROJECTS` data is shared between developer and freelance modes. Some descriptions contain phrases that are too sales-y for the developer view (e.g. "more bookings", "service business", "lead-generating"). The goal is neutral developer-portfolio language that still works on `/freelance`.

- [ ] **Step 11.1: Read each project description**

Read `constants.tsx`, the `PROJECTS` array (starts around line 65, ends ~line 280). For each project, scan `description`, `challenge`, and `solution` strings for these patterns:
- "lead-generating"
- "service business" (in description body, not category)
- "more bookings" / "more calls" / "turn visitors into customers"
- "Get Found" framing
- Any first-person sales pitch ("I'll help you...", "your customers will...")

- [ ] **Step 11.2: Rewrite the offending phrases**

For each match found, rewrite to neutral developer-portfolio language. Example transformations:

| Before | After |
|--------|-------|
| "Lead-generating website for a barbershop" | "WordPress website with local SEO for a barbershop in Cebu" |
| "Custom WordPress site that turns visitors into paying customers" | "Custom WordPress site with conversion-optimized layout and on-page SEO" |
| "Designed to bring you more bookings 24/7" | "Designed for fast load times, accessible navigation, and clear booking flows" |

The case studies (`challenge` / `solution` paragraphs) describe real client problems and solutions — keep them factual and specific, but trim any second-person ("your business", "you") that pretends the case study is a sales pitch.

Do not remove or rewrite `results` arrays — those are real client outcomes and read fine in both modes.

- [ ] **Step 11.3: Type-check + build**

Run: `npx tsc --noEmit && npm run build`
Expected: PASS.

- [ ] **Step 11.4: Commit**

```bash
git add constants.tsx
git commit -m "docs: sand off service-business sales language from project descriptions"
```

---

## Task 12: Cleanup — remove deprecated PERSONAL_INFO fields

**Files:**
- Modify: `constants.tsx`

After Tasks 3–8, no component reads `PERSONAL_INFO.role`, `.tagline`, `.subHeadline`, or `.availability` directly. They all go through `COPY[mode]`. Remove them.

- [ ] **Step 12.1: Verify no remaining references**

Run a Grep for each deprecated field:

```bash
# Use the Grep tool, not raw shell grep
```

Patterns to search across the project (excluding `constants.tsx` itself):
- `PERSONAL_INFO.role`
- `PERSONAL_INFO.tagline`
- `PERSONAL_INFO.subHeadline`
- `PERSONAL_INFO.availability`

Expected: no matches (only `PERSONAL_INFO.name`, `.email`, `.location` should remain in use).

If any remain, fix them — most likely candidates: `Footer.tsx` may still display the name, `Contact.tsx` the email; both are fine. Anything referencing the deprecated fields needs migration to `COPY[mode]`.

- [ ] **Step 12.2: Remove the deprecated fields from `PERSONAL_INFO`**

Edit `constants.tsx` — replace the existing `PERSONAL_INFO` object with the slim version:

```typescript
export const PERSONAL_INFO = {
  name: "Joji Shiotsuki",
  email: "jojishiotsuki0@gmail.com",
  location: "Cebu, Philippines",
};
```

- [ ] **Step 12.3: Type-check + build**

Run: `npx tsc --noEmit && npm run build`
Expected: PASS. If anything fails referencing removed fields, migrate the reference in the offending file before continuing.

- [ ] **Step 12.4: Commit**

```bash
git add constants.tsx
git commit -m "refactor: remove deprecated PERSONAL_INFO mode-varying fields"
```

---

## Task 13: Final verification — Playwright smoke test

**Files:**
- None modified (read-only verification)

This task uses the `playwright` MCP browser tools to visit both routes and confirm the right copy renders. If the MCP isn't available in your environment, fall back to the manual verification described in Step 9.4 plus a quick visual diff between `/` and `/freelance`.

- [ ] **Step 13.1: Start the dev server in the background**

Run: `npm run dev`
(Run with `run_in_background: true` if using a background-capable tool. Otherwise note the URL — usually `http://localhost:5173`.)

- [ ] **Step 13.2: Navigate to `/` and verify developer-mode copy**

Use the playwright MCP browser tools (or, fallback, manual browser):

1. `mcp__playwright__browser_navigate` to `http://localhost:5173/`
2. `mcp__playwright__browser_snapshot` — confirm the page tree includes:
   - Tagline kicker text containing `WEB DEVELOPER`
   - Headline containing `I Build` and `That Ship`
   - At least one of: `Sites`, `Apps`, `Tools`, `Stores`, `Microsites`, `Dashboards` (the morph cycles, so any one match is fine)
   - Hero subheadline containing `Mid-level web developer with 4 years`
   - Vertical text containing `Open to Roles`
   - Track Record / stats containing `4` years and `WP + JS`
   - Section heading `SELECTED WORK` (or `Recent Projects`)
   - About title `Mid-level web developer.`
   - Banner text `OPEN TO MID-LEVEL WEB DEVELOPER ROLES`

3. `mcp__playwright__browser_console_messages` — confirm no console errors.

- [ ] **Step 13.3: Navigate to `/freelance` and verify freelance-mode copy**

1. `mcp__playwright__browser_navigate` to `http://localhost:5173/freelance`
2. `mcp__playwright__browser_snapshot` — confirm the page tree includes:
   - Tagline kicker `WEB DEVELOPER FOR SERVICE BUSINESSES`
   - Headline containing `I Help` and `Get Found`
   - At least one of: `Barbershops`, `Salons`, `Clinics`, `Cafes`, `Gyms`, `Spas`
   - Subheadline containing `barbershops, salons, clinics`
   - Vertical text containing `Available for Projects`
   - Sections present: Services, How It Works, Who I Work With (heading text matches each)
   - Banner containing `Currently booking for`
   - Sticky CTA (after scrolling) text `BOOK A CALL`

3. `mcp__playwright__browser_console_messages` — confirm no console errors.

- [ ] **Step 13.4: Test the resume PDF link**

Navigate to `http://localhost:5173/resume.pdf`. Expected: the browser displays the PDF (94 KB) — same file as the source in Downloads.

- [ ] **Step 13.5: Stop the dev server and run a production build**

Stop the dev server. Run: `npm run build`
Expected: PASS, no warnings about missing files (`/resume.pdf` should be picked up from `public/` and emitted to `dist/`).

- [ ] **Step 13.6: Final commit / tag (optional)**

If everything passes, no further commit needed — all changes are already committed across Tasks 1–12. Optionally tag the release:

```bash
git tag -a portfolio-job-mode-v1 -m "Portfolio repositioned to job-application mode"
```

---

## Self-Review Checklist (run after writing the plan, before handing off)

**Spec coverage:**
- [x] Hero copy and CTAs — Task 3
- [x] Results stats and kicker — Task 4
- [x] ProjectsPreview header and lead-in — Task 5
- [x] About body rewrite — Task 6
- [x] Contact body and CTAs — Task 7
- [x] UrgencyBanner copy — Task 3
- [x] StickyCTA — Task 3
- [x] Footer tagline + dropped Website self-link — Task 8 / Task 2
- [x] Navbar mode-keyed nav — Task 8 / Task 2
- [x] PERSONAL_INFO split into invariant + COPY — Tasks 2 + 12
- [x] NAV_ITEMS mode-keyed — Task 2
- [x] useMode hook — Task 1
- [x] FreelancePage component — Task 9
- [x] /freelance route — Task 9
- [x] Worker SYSTEM_PROMPT rewrite — Task 10
- [x] Project description audit — Task 11
- [x] Resume PDF — Task 1

**Acceptance criteria from spec — all verified in Task 13:**
- [x] Developer role / seniority / geography visible on `/`
- [x] Resume + email reachable, no Calendly on `/`
- [x] No urgency / sales language on `/`
- [x] Visual identical to before
- [x] `/freelance` preserves original service-business pitch

**Placeholder scan:** none. All steps include actual code or commands.

**Type consistency:**
- `useMode()` returns `Mode` (`'developer' | 'freelance'`) — used consistently across Tasks 1–9.
- `COPY` is `Record<Mode, ModeCopy>` — used consistently.
- `NAV_ITEMS` is `Record<Mode, NavItem[]>` — used consistently after Task 2.
- `Mode` exported from `types.ts` and imported wherever needed.

No mismatches found.
