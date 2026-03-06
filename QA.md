# QA Audit Report

**Date:** 2026-03-06
**Audited by:** Frontend Developer, Backend Architect, Evidence Collector agents
**Project:** Portfolio Website (jojishiotsuki.com)
**Stack:** React 19 + TypeScript, Vite 6, Tailwind CSS 4, Cloudflare Workers
**Status:** ALL 35 ISSUES RESOLVED

---

## CRITICAL

### 1. API Key Leaked Into Client Bundle
- **File:** `vite.config.ts:14-16`
- **Detail:** The Vite `define` block injects `GEMINI_API_KEY` as a string literal directly into the client-side JS bundle. Anyone can extract the key from browser devtools.
- **Fix:** Remove the `define` block entirely. All AI calls should go through the Cloudflare Worker proxy (which already exists). Remove the `@google/genai` dependency from `package.json`.

### 2. Old Cloudflare Worker Has Wildcard CORS (`*`)
- **File:** `cloudflare-worker/worker.js:10,94,102`
- **Detail:** The legacy `gemini-proxy.shiotsuji1.workers.dev` worker sends `Access-Control-Allow-Origin: *` on every response. Any website on the internet can proxy free Gemini API calls at your expense. Zero rate limiting, zero input validation, no message length caps.
- **Fix:** Delete or disable this worker entirely. It is superseded by the `claude-proxy` worker.

### 3. Stale/Broken Production Build
- **File:** `dist/index.html`
- **Detail:** The `dist/` build is hours behind the latest source changes. The dist `index.html` is missing favicon/manifest links that exist in the source `index.html` (lines 8-11). The `.htaccess` for SPA routing is also missing from dist. Anyone visiting the deployed version sees an outdated build.
- **Fix:** Run `npm run build` and redeploy. Ensure `public/` assets (favicons, manifest, .htaccess) are copied to dist.

---

## HIGH

### 4. Outdated Hardcoded Dates
- **Files:** `components/UrgencyBanner.tsx:52`, `components/Hero.tsx:156`
- **Detail:** UrgencyBanner says "Currently booking for February" with "2 SPOTS LEFT". Hero says "Available for Projects // 2025". The current date is March 2026. This makes the site look abandoned.
- **Fix:** Make the urgency banner month dynamic. Update Hero year to 2026.

### 5. No Meta Description or OG Tags
- **File:** `index.html`
- **Detail:** For a portfolio advertising SEO services, the source `index.html` lacks a `<meta name="description">` tag, Open Graph tags, Twitter card tags, and canonical URL. This severely hurts search engine discoverability and social media link previews.
- **Fix:** Add meta description, OG tags (`og:title`, `og:description`, `og:image`, `og:url`), Twitter card tags, and a canonical URL.

### 6. 2 Known npm Vulnerabilities
- **Source:** `npm audit`
- **Detail:**
  - `minimatch` 9.0.0-9.0.6 — HIGH — ReDoS via repeated wildcards, combinatorial backtracking, catastrophic extglobs
  - `rollup` 4.0.0-4.58.0 — HIGH — Arbitrary file write via path traversal
- **Fix:** Run `npm audit fix` to update to patched versions.

### 7. Three Dead Chat Implementations (Unused Code)
- **Files:** `components/ChatBot.tsx`, `components/AIChat.tsx`, `services/geminiService.ts`
- **Detail:** Three separate chat implementations exist but none are imported by `App.tsx`. The active chat is `AssistantPage.tsx` using the `claude-proxy` worker. Dead code includes the old `@google/genai` direct-browser integration and a ChatBot pointing to the misspelled `shiotsuji1` worker domain.
- **Fix:** Delete `ChatBot.tsx`, `AIChat.tsx`, `geminiService.ts`, and `cloudflare-worker/worker.js`. Remove `@google/genai` from `package.json`.

### 8. 133 Untracked Screenshot PNGs (~246MB) in Project Root
- **Location:** Project root
- **Detail:** 133 `.png` screenshot files (debug/verification artifacts like `hero-ripple-v1.png`, `dark-mode-fullpage.png`, `mobile-hero-320-fixed.png`) totaling ~246MB clutter the working directory. These are not gitignored.
- **Fix:** Delete the screenshots. Add `*.png` (with `!public/**/*.png` exception) to `.gitignore`.

### 9. `body *` Transition Rule Degrades Performance
- **File:** `index.html:96-98`
- **Detail:** `body * { transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease; }` applies CSS transitions to every single DOM element. Causes jank during theme switching, unexpected animation on elements that should change instantly, and interference with component-specific transitions.
- **Fix:** Remove the `body *` rule. Apply transitions only to themed wrapper elements or specific components that need them.

---

## MEDIUM

### 10. Duplicate Animation Library
- **File:** `package.json:13,18`
- **Detail:** Both `framer-motion` (^12.35.0) and `motion` (^12.35.0) are installed. `motion` is the renamed successor to `framer-motion`. Some components import from `"framer-motion"` (`animated-social-icons.tsx`, `background-ripple-effect.tsx`) while others import from `"motion/react"` (`AssistantPage.tsx`, `ProjectsPage.tsx`). This ships two copies of the same library, inflating the bundle.
- **Fix:** Remove `framer-motion`. Keep `motion`. Update all `import ... from 'framer-motion'` to `import ... from 'motion/react'`.

### 11. Grain Overlay z-index:9999 Above All Floating UI
- **File:** `index.html:87-98`
- **Detail:** The `body::before` grain overlay uses `z-index: 9999` with `pointer-events: none`. Elements like PixelAssistant (z-index: 1000), StickyCTA (999), UrgencyBanner (101), and Navbar (100) all render below the grain. While `pointer-events: none` prevents click blocking on desktop, touch events on older iOS/Android may be unreliable. Also makes devtools element inspection difficult.
- **Fix:** Lower the grain z-index below floating UI components, or apply it only to the main content area.

### 12. Conflicting `@keyframes pulse` Definitions
- **Files:** `index.html:141`, `components/StickyCTA.tsx:45`
- **Detail:** `pulse` is defined with opacity-only in `index.html` and with transform+opacity in `StickyCTA.tsx`. Depending on render order, one overrides the other, causing the navbar status dot to unexpectedly scale or the CTA dot to not scale as intended.
- **Fix:** Rename one of the animations (e.g., `pulse-scale` for StickyCTA) to avoid conflicts.

### 13. ThemeToggle Not Keyboard Accessible
- **File:** `components/ui/theme-toggle.tsx:26-29`
- **Detail:** The theme toggle uses `role="button"` and `tabIndex={0}` but has no `onKeyDown` handler. Keyboard users can focus it but pressing Enter or Space does nothing. Fails WCAG 2.1 AA.
- **Fix:** Add `onKeyDown` handler that triggers the toggle on Enter or Space.

### 14. Localhost CORS Allowed in Production Worker
- **File:** `worker/src/index.ts:127-129`
- **Detail:** The production Claude proxy worker accepts requests from any `http://localhost:*` or `http://127.0.0.1:*` origin. Any local application or browser extension could call this endpoint.
- **Fix:** Use an environment variable to conditionally allow localhost origins only in development.

### 15. StickyCTA and PixelAssistant Near-Overlap
- **Files:** `components/StickyCTA.tsx:20-21`, `components/PixelAssistant.tsx:72-73`
- **Detail:** Both are `position: fixed` in the bottom-right. StickyCTA at `bottom: 32px, right: 32px`, PixelAssistant at `bottom: 100px, right: 32px`. Only ~8px gap between them. The pulse animation (`transform: scale(1.2)`) can cause visual overlap at certain zoom levels.
- **Fix:** Increase spacing between the two elements. Consider adjusting PixelAssistant's bottom position.

### 16. Dark Mode Anti-Flash Script Incomplete
- **Files:** `index.html:16-31`, `dist/index.html:11-31`
- **Detail:** The anti-flash script sets CSS variables for the `light` case but when `theme === 'dark'`, it only sets `data-theme` without setting dark-mode CSS variables. Dark-mode users see a brief flash of light-mode colors before React hydrates.
- **Fix:** Add dark-mode CSS variable assignments to the anti-flash script's dark branch.

### 17. Worker Rate Limit Race Condition
- **File:** `worker/src/index.ts:155-177`
- **Detail:** `checkRateLimit` reads current count then writes `count + 1`. Concurrent requests can all read the same count, bypassing the limit. KV is eventually consistent, making this worse under load.
- **Fix:** Accept as a tradeoff for a portfolio site, or use Cloudflare Durable Objects for atomic counters.

### 18. FTP Deployment Potentially Unencrypted
- **File:** `.github/workflows/deploy.yml:29`
- **Detail:** Uses `SamKirkland/FTP-Deploy-Action@v4.3.5`. Unless `FTP_HOST` is configured with `ftps://`, credentials and source code could be transmitted in plaintext.
- **Fix:** Add `protocol: ftps` to the action configuration or switch to SSH/SFTP.

### 19. GitHub Actions Workflow Lacks Security Hardening
- **File:** `.github/workflows/deploy.yml`
- **Detail:** Missing `permissions` block (overly broad default permissions), no `concurrency` block (parallel deployments could corrupt the site), no dependency pinning by hash.
- **Fix:** Add `permissions: contents: read` and `concurrency: group: deploy, cancel-in-progress: true`.

### 20. Missing Accessibility Landmarks
- **Files:** Various section components
- **Detail:** Most sections (`#results`, `#services`, `#about`, `#contact`) lack ARIA landmarks and `aria-label` attributes. The carousel in Results.tsx has no `aria-live` region. The chat input in AssistantPage.tsx lacks an associated label.
- **Fix:** Add `aria-label` to sections, `aria-live` to carousel, and proper labels to form inputs.

---

## LOW

### 21. No Code Splitting for Routes
- **File:** `App.tsx`
- **Detail:** All page components (`HomePage`, `ProjectsPage`, `AssistantPage`) are eagerly imported. `AssistantPage` contains ~1000 lines of pixel art sprite data and canvas animation code that is never needed unless the user visits `/talk`.
- **Fix:** Use `React.lazy()` + `Suspense` for route-based code splitting.

### 22. Hero mousemove Causes Excessive Re-renders
- **File:** `components/Hero.tsx:22-28`
- **Detail:** Every mouse movement triggers `setMousePos()` causing a full re-render of the Hero component. The position is only used for a parallax gradient effect.
- **Fix:** Use `useRef` and direct DOM manipulation, or throttle with `requestAnimationFrame`.

### 23. Four Unthrottled Scroll Event Listeners
- **Files:** `App.tsx`, `Navbar.tsx`, `UrgencyBanner.tsx`, `StickyCTA.tsx`
- **Detail:** Each registers its own `scroll` event listener with no throttle or debounce. Results in 4 separate state updates per scroll frame.
- **Fix:** Throttle scroll handlers or consolidate into a single shared scroll context.

### 24. `dist/` Not in `.gitignore`
- **File:** `.gitignore`
- **Detail:** Build artifacts are tracked by git. Old JS bundle (`index-bozhFHK2.js`) shows as deleted while the new one is untracked.
- **Fix:** Add `dist/` to `.gitignore`.

### 25. Unused npm Dependencies
- **File:** `package.json`
- **Detail:** `@radix-ui/react-slot` is imported nowhere. `@google/genai` is only used in dead `geminiService.ts`.
- **Fix:** Remove both dependencies.

### 26. Five Unused Component Files
- **Files:**
  - `components/ui/glassmorphism-trust-hero.tsx` — not imported anywhere
  - `components/ui/background-ripple-effect.tsx` — not imported anywhere
  - `components/ui/morphing-popover.tsx` — not imported anywhere
  - `components/Button.tsx` — not imported anywhere
  - `components/SectionHeading.tsx` — not imported anywhere
  - `components/Projects.tsx` — replaced by `ProjectsPreview.tsx` and `ProjectsPage.tsx`
- **Fix:** Delete unused component files.

### 27. CSS Variable Names Semantically Inverted
- **File:** `index.html`
- **Detail:** `--black` maps to `#FFFFFF` (white) in light mode. `--cream` maps to `#2A2820` (dark color). Variable names are the opposite of what they represent.
- **Fix:** Rename to semantic names like `--bg-primary`, `--text-primary`, etc.

### 28. Canvas Cache Memory Leak on Route Navigation
- **File:** `components/AssistantPage.tsx:40-41,317`
- **Detail:** Module-level `Map` objects (`frameCanvasCache`, `silhouetteCache`, `spriteCanvasCache`) accumulate cached canvases and are never cleared when navigating away from `/talk`.
- **Fix:** Clear caches in the `useEffect` cleanup function.

### 29. `nul` File in Project Root
- **File:** `nul` (429 bytes)
- **Detail:** A file literally named `nul` exists in the root. On Windows, `nul` is a reserved device name. Likely from a bash redirect to `/dev/null` accidentally written as `nul`.
- **Fix:** Delete the file.

### 30. `site.webmanifest` Missing `start_url`
- **File:** `public/site.webmanifest`
- **Detail:** The manifest lacks a `start_url` property, required for proper PWA installability.
- **Fix:** Add `"start_url": "/"`.

### 31. `.htaccess` Missing Security Headers
- **File:** `dist/.htaccess`
- **Detail:** Missing `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Content-Security-Policy`, and `Strict-Transport-Security` (HSTS).
- **Fix:** Add security headers to `.htaccess`.

### 32. `tsconfig.json` Missing `strict: true`
- **File:** `tsconfig.json`
- **Detail:** No strict null checks or strict function types. The worker `tsconfig.json` correctly has `strict: true` but the frontend does not.
- **Fix:** Add `"strict": true` to root `tsconfig.json`.

### 33. All Images Are Unoptimized PNGs
- **Files:** `public/`, `dist/`
- **Detail:** All project screenshots are PNG files (some over 1MB). No WebP/AVIF conversions, no responsive `srcset`, no `loading="lazy"`.
- **Fix:** Convert images to WebP, add `srcset` for responsive sizes, add `loading="lazy"`.

### 34. Inline `<style>` Tags in Every Component
- **Files:** Most component files
- **Detail:** Every component renders its own `<style>` tag with media queries into the DOM. Duplicate style injection on every render. Multiple conflicting `@keyframes` definitions. Tailwind CSS is barely utilized.
- **Fix:** Consolidate styles into CSS files or Tailwind classes. Remove inline `<style>` tags.

### 35. Worker CORS Origin Hardcoded
- **File:** `worker/wrangler.toml:6`
- **Detail:** `ALLOWED_ORIGIN = "https://jojishiotsuki.com"` means the chat will not work during local development unless the worker has localhost fallback logic (it does, but see issue #14).
- **Fix:** Use separate environment configs for dev vs production.

---

## Summary

| Severity | Count |
|----------|-------|
| CRITICAL | 3 |
| HIGH | 6 |
| MEDIUM | 11 |
| LOW | 15 |
| **TOTAL** | **35** |

## Priority Actions

1. Remove the `define` block from `vite.config.ts` and delete `@google/genai` dependency
2. Delete or disable the old `cloudflare-worker/worker.js` with wildcard CORS
3. Fix hardcoded dates — make urgency banner dynamic, update year to 2026
4. Add `<meta description>` and OG tags to `index.html`
5. Clean up dead code (ChatBot, AIChat, geminiService) and add `dist/` + `*.png` to `.gitignore`
6. Rebuild with `npm run build` and redeploy
