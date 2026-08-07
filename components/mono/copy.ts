/*
  Copy for the Mono Index design, kept in one place so a wording change is one edit.
  Project and job content is NOT here — that comes from PROJECTS and EXPERIENCE in
  constants.tsx, so the site and the case studies can never disagree.
*/

export const MONO_COPY = {
  hero: {
    kicker: 'Open to Roles // 2026',
    role: 'Senior Web Developer · WordPress + JavaScript',
    sub: 'Senior web developer shipping client sites, custom apps, and SEO-driven builds. WordPress (Bricks, Elementor) and modern JavaScript (React, TypeScript). Open to AU and US remote roles.',
  },

  /* The spec sheet beside the headline. Shown from 1020px up. */
  spec: [
    { term: 'Stack', value: 'WordPress, React, TypeScript' },
    { term: 'Builders', value: 'Bricks, Elementor' },
    { term: 'Status', value: 'Open to AU/US remote roles' },
  ],

  about: {
    lead: 'Senior web developer. WordPress, React, and the bits in between.',
    body: [
      'I build for the web across agency client work, in-house tools, and side projects that taught me how production really behaves. I started in WordPress (Bricks, Elementor, custom themes) and grew into modern JavaScript (React, TypeScript, Cloudflare Workers).',
      "Most of my shipped work is for small teams and agencies in the Philippines and US: marketing sites, e-commerce, SEO-driven builds, and the occasional custom app when an off-the-shelf plugin won't cut it. I care about what hiring managers also care about: things actually shipping, page speed that survives real traffic, SEO that holds up in audits, and code another developer can pick up without ceremony.",
      'Open to senior web developer roles in AU and US (remote).',
    ],
  },

  contact: {
    lead: "Let's talk.",
    body: 'Open to senior web developer roles in AU and US (remote). Drop me a line. Happy to share work samples, walk through case studies, or just chat about a role.',
  },

  colophon: {
    tag: 'Web developer based in Cebu. Available for senior roles, AU and US remote.',
    setIn: 'Set in Azeret Mono',
  },

  links: [
    { name: 'LinkedIn', handle: '/in/jojishiotsuki', url: 'https://linkedin.com/in/jojishiotsuki' },
    { name: 'GitHub', handle: '/jojiShiotsuki', url: 'https://github.com/jojiShiotsuki' },
    { name: 'TikTok', handle: '@_shiotsuki', url: 'https://tiktok.com/@_shiotsuki' },
    { name: 'Instagram', handle: '@_shiotsuki', url: 'https://instagram.com/_shiotsuki' },
  ],
} as const;

/*
  The six projects the front page leads with, by id, in the order they appear.
  A curated pick rather than "the six most recent" — this is the shortlist that was
  chosen when the design was reviewed. The full 16 live on /projects.
*/
export const FEATURED_PROJECT_IDS = [
  'spark-your-designs',
  'samantha-angeli',
  'youpercent',
  'pundok-studios',
  'kontentfire',
  'vertex',
] as const;

/*
  Which of the featured six show their testimonial on the FRONT page. Every quote still
  appears on its case study at /projects — this only controls the shortlist.

  Two reasons it is a list and not "show them all". The front page is an index and four
  block quotes turn it back into a scrolling brochure. And the Spark Your Designs quote
  is from Noura, while Spark Your Designs is Joji's own former agency rather than a
  client, so running it as a client testimonial on the front page states something that
  is not true. That is an open item on the copy pass; until it is settled it stays off.
*/
export const FEATURED_QUOTE_IDS: readonly string[] = ['pundok-studios'];

/* Zero-padded index numbers: 01, 02 … */
export const two = (n: number): string => String(n).padStart(2, '0');

/* '2025-05' -> '2025' */
export const yearOf = (date?: string): string => (date ?? '').slice(0, 4);

/*
  Some entries are unbuilt concepts and pitches. Saying "the site as built" about a
  concept is the one claim a portfolio cannot get wrong, so both the alt text and the
  visit link follow the category rather than being written by hand.
*/
export const isConcept = (category: string): boolean => /pitch|concept/i.test(category);

export const projectAlt = (title: string, category: string): string =>
  isConcept(category) ? `Design concept for ${title}` : `The ${title} site as built`;
