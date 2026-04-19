# JOJI.DEV Brand Kit — Oppenheimer Palette Redesign

**Date:** 2026-03-04
**Purpose:** Redesign brand-kit.html to use actual Oppenheimer in-film color palette
**Scope:** Brand kit page only (site migration planned separately)

## Color Source

Colors extracted from the Oppenheimer film's color grading. Approach: "Dark Olive Core" — cool blacks and dark olives as primary, olive greens as accent, warm browns as secondary earth tones.

## Color Groups

### 1. Primary — Dark Olive (5 swatches)
| Name | Hex | Role |
|------|-----|------|
| Obsidian | #000103 | True black, deepest bg |
| Nightfall | #0C0F14 | Dark backgrounds |
| Dark Olive | #15170C | Cards, panels |
| Forest | #293122 | Secondary surfaces |
| Military Sage | #3F523F | Borders, lighter dark |

### 2. Accent — Olive Green (4 swatches)
| Name | Hex | Role |
|------|-----|------|
| Muted Olive | #5F7161 | **Primary accent** (CTAs, logo dot) |
| Sage | #8D9A7C | Hover states, lighter accent |
| Pale Sage | #C3C9A5 | Subtle highlights, badges |
| Sage Mist | #DFE3D0 | Faint tints, borders (derived) |

### 3. Earth — Warm Browns (3 swatches)
| Name | Hex | Role |
|------|-----|------|
| Espresso | #4D2E1C | Deep warm accent |
| Leather | #6E5133 | Secondary accent |
| Camel | #967856 | Light warm accent |

### 4. Neutrals (7 swatches, warm-tinted)
| Name | Hex | Role |
|------|-----|------|
| Parchment | #F5F3EE | Page bg |
| Linen | #EBE8E2 | Cards |
| Stone | #D4D0C8 | Borders |
| Pewter | #9C9890 | Muted text |
| Graphite | #5C5850 | Body text |
| Charcoal | #2A2820 | Headings |
| Ink | #141310 | Near black |

### 5. Status (unchanged)
- Success: #22C55E
- Alert: #EF4444

## CSS Variable Mapping
```
--navy-* → --olive-* (900 through 500)
--amber-* → --green-* (500 through 200)
NEW: --brown-* (700, 600, 500)
--off-white → --parchment (#F5F3EE)
--gray-* → warm-tinted neutrals
```

## Page Styling
- Background: Parchment (#F5F3EE)
- Headings: Dark Olive (#15170C)
- Logo dot: Muted Olive (#5F7161)
- Dark panel: Nightfall (#0C0F14)
- Dark panel accent: Pale Sage (#C3C9A5)
- Dot grid: Stone color at low opacity

## Description Text
> Drawn from the color grading of Oppenheimer — the film's cool-tinted blacks and dark olive greens form the primary palette, while the muted sage tones provide accent. Warm leather browns add earthiness and depth.

## Future: Site Migration Plan
After brand kit is complete, update theme.ts dark/light themes to use Oppenheimer colors across the portfolio site.
