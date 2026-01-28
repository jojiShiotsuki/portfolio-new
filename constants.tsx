import {
  Github,
  Linkedin,
  Globe,
  Instagram,
  Code2,
  Layout,
  LineChart,
  ShoppingCart,
  Wrench,
  Bot,
  Music2
} from 'lucide-react';
import { NavItem, SocialLink, Project, Experience, Service } from './types';

// --- PERSONAL BRANDING DATA ---

export const PERSONAL_INFO = {
  name: "Joji Shiotsuki",
  role: "Senior WordPress Developer & Software Engineer",
  email: "jojishiotsuki0@gmail.com",
  location: "Cebu, Philippines",
  tagline: "I Build Websites That Generate Leads While You Sleep.",
  subHeadline: "Helping construction, real estate, and e-commerce businesses in the US, Australia and Philippines turn their websites into 24/7 lead generation machines through SEO-first development.",
  availability: "Available for projects"
};

export const NAV_ITEMS: NavItem[] = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];

export const SOCIAL_LINKS: SocialLink[] = [
  { platform: 'TikTok', url: 'https://tiktok.com/@_shiotsuki', icon: Music2 },
  { platform: 'LinkedIn', url: 'https://linkedin.com/in/jojishiotsuki', icon: Linkedin },
  { platform: 'GitHub', url: 'https://github.com/jojiShiotsuki', icon: Github },
  { platform: 'Website', url: 'https://jojishiotsuki.com', icon: Globe },
  { platform: 'Instagram', url: 'https://instagram.com/_shiotsuki', icon: Instagram },
];

// --- SERVICES STRATEGY ---

export const SERVICES: Service[] = [
  {
    id: 'wordpress',
    title: 'Custom WordPress Dev',
    description: 'Lead-generating websites built with Bricks, Elementor, or Divi. Fast-loading, conversion-optimized, and designed to turn visitors into paying customers.',
    icon: Layout
  },
  {
    id: 'webapp',
    title: 'Full-Stack Applications',
    description: 'Custom React/Node.js applications for complex business needs. Portals, dashboards, and SaaS products that scale with your growth.',
    icon: Code2
  },
  {
    id: 'seo',
    title: 'SEO & Performance',
    description: 'Dominate local search and get found by customers ready to buy. Technical SEO that puts you on page 1 and keeps you there.',
    icon: LineChart
  },
  {
    id: 'ecommerce',
    title: 'E-commerce Solutions',
    description: 'WooCommerce stores built to sell. Optimized checkout flows, abandoned cart recovery, and integrations that maximize every transaction.',
    icon: ShoppingCart
  },
  {
    id: 'maintenance',
    title: 'Maintenance & Support',
    description: 'Never lose a lead to downtime. 24/7 monitoring, automatic backups, and security updates so your site keeps generating revenue.',
    icon: Wrench
  },
  {
    id: 'ai',
    title: 'AI Integrations',
    description: 'Automate lead follow-up, customer support, and content creation. AI that works while you focus on closing deals.',
    icon: Bot
  }
];

// --- PORTFOLIO STRATEGY ---

export const PROJECTS: Project[] = [
  {
    id: 'vertex',
    title: 'Vertex',
    category: 'Web Apps',
    description: 'A personal productivity powerhouse that replaces expensive subscription services. Vertex combines task management, CRM, and goal tracking with AI-powered natural language parsing—transforming how I organize work and life.',
    challenge: 'Managing productivity across multiple expensive SaaS tools ($50+/month combined) created fragmented workflows. Task creation was manual and tedious, and no tool offered AI-powered natural language input for rapid task creation.',
    solution: 'Engineered a unified full-stack application with natural language processing at its core. Type "Meeting with Sarah tomorrow at 3pm about Q2 budget" and Vertex automatically parses and creates a structured task with date, time, contact, and context. Built bulk creation for importing hundreds of items, quarterly OKR tracking, and an export system that provides context to AI assistants.',
    tech: ['FastAPI', 'Python', 'React', 'TypeScript', 'SQLite'],
    results: [
      'Eliminated $600+/year in SaaS subscriptions',
      '10x faster task creation with natural language parsing',
      'Bulk import handles 500+ items in seconds',
      'Quarterly goal completion rate increased by 40%'
    ],
    testimonial: {
      quote: "Vertex transformed how I manage my entire workflow. The natural language parsing alone saves me hours every week.",
      author: "Personal Project",
      role: "Available for Demo"
    },
    image: '/vertex-screenshot.png',
    github: 'https://github.com/jojiShiotsuki'
  },
  {
    id: 'kontentfire',
    title: 'KontentFire',
    category: 'Web Apps',
    description: 'An AI-powered social media content automation platform for home service businesses. Generate, schedule, and publish content across LinkedIn, Facebook, Instagram, and Twitter with GPT-4 and Claude integration.',
    challenge: 'Home service businesses struggle to maintain consistent social media presence. Creating quality content is time-consuming, and most owners lack the expertise or resources to manage multiple platforms effectively.',
    solution: 'Built a full SaaS platform with AI content generation using GPT-4 and Claude, AI image generation with DALL-E and Stable Diffusion, smart scheduling automation, multi-platform publishing, and real-time analytics. Includes content templates like Battle Royale, Myth Busters, and How-To guides tailored for home services.',
    tech: ['React', 'TypeScript', 'Node.js', 'OpenAI API', 'Anthropic API', 'PostgreSQL'],
    results: [
      'Trusted by 500+ home service businesses',
      'AI generates content in seconds vs hours manually',
      'Multi-platform publishing to 4+ social networks',
      'Voice-controlled automation for hands-free management'
    ],
    testimonial: {
      quote: "KontentFire transformed how we handle social media. What used to take hours now happens automatically.",
      author: "Early Adopter",
      role: "Home Service Business Owner"
    },
    image: '/kontentfire-screenshot.png',
    link: 'https://app.kontentfire.com'
  },
  {
    id: 'pundok-studios',
    title: 'Pundok Studios',
    category: 'Websites',
    description: 'Complete website design and local SEO domination strategy for Cebu\'s premier barbershop. Transformed their digital presence from invisible to #1 in local search results.',
    challenge: 'Despite having a 4.9-star reputation and loyal customer base, Pundok Studios was virtually invisible online. Competitors with inferior services ranked higher in local searches, and the barbershop was losing potential customers who searched "best barbershop in Cebu" to find their next haircut.',
    solution: 'Designed a clean, sophisticated website that mirrors their premium in-store experience. Implemented an aggressive local SEO strategy: optimized Google Business Profile, built location-specific landing pages, created schema markup for local business and reviews, and developed a content strategy targeting high-intent keywords like "premium barbershop Cebu" and "men\'s grooming Cebu City."',
    tech: ['WordPress', 'Elementor', 'Local SEO', 'Schema Markup', 'Google Business Profile'],
    results: [
      '#1 Google ranking for "barbershop Cebu" within 6 months',
      '340% increase in Google Business Profile views',
      '85% increase in direction requests from Google Maps',
      'New customer bookings increased 60% month-over-month'
    ],
    testimonial: {
      quote: "We went from hoping customers would find us to having a waitlist. Joji understood exactly what we needed to dominate local search.",
      author: "Client Testimonial",
      role: "Pundok Studios Owner"
    },
    image: '/pundok-screenshot.png',
    link: 'https://pundokstudios.com/'
  },
  {
    id: 'knock-knock',
    title: 'Knock Knock Heating & Cooling',
    category: 'Websites',
    description: 'A conversion-focused website for Cincinnati\'s friendliest HVAC company. Balanced their playful brand personality with the trust signals needed to win high-ticket service contracts.',
    challenge: 'Knock Knock had a perfect 5.0 Google rating but their outdated website didn\'t reflect their quality of service. The site failed to convert visitors into leads, and their unique brand personality (bird-themed "im-peck-able service") wasn\'t coming through online. They were losing emergency calls to competitors with better web presence.',
    solution: 'Built a WordPress site using Bricks Builder that captures their friendly, neighborhood-expert personality while establishing trust. Featured their perfect rating prominently, created service-specific landing pages for heating, cooling, and indoor air quality, integrated their blog for SEO, and built a service area map showing coverage across Cincinnati suburbs.',
    tech: ['WordPress', 'Bricks Builder', 'Local SEO', 'Blog Integration', 'Service Area Maps'],
    results: [
      '125% increase in online quote requests',
      'Emergency service calls up 80% from website',
      'Average time on site increased from 45s to 3m 20s',
      'Service area page ranks #1 for 12 local keywords'
    ],
    testimonial: {
      quote: "Our website finally matches who we are. Customers tell us they chose us because the site felt trustworthy and friendly—exactly what we wanted.",
      author: "Client Testimonial",
      role: "Knock Knock HVAC Owner"
    },
    image: '/knockknock-screenshot.png',
    link: 'https://knockknockair.com/'
  },
  {
    id: 'trade-titans',
    title: 'Trade Titans',
    category: 'Websites',
    description: 'The digital home for Trade Titans podcast—built to grow their audience of skilled tradespeople across roofing, construction, plumbing, and electrical industries.',
    challenge: 'Trade Titans had great content but no central hub to showcase episodes, build their email list, or establish authority in the trades community. Episodes were scattered across platforms with no cohesive brand presence, making it hard for contractors to find relevant content or share with their teams.',
    solution: 'Developed a comprehensive podcast platform with smart episode categorization by trade (roofing, plumbing, electrical, HVAC). Built an episode archive with search and filtering, integrated blog for show notes and industry insights, added testimonials from featured guests, and created clear CTAs for newsletter signup and sponsorship inquiries.',
    tech: ['WordPress', 'Elementor', 'Podcast RSS Integration', 'Blog', 'Email Integration'],
    results: [
      'Episode downloads increased 200% after launch',
      'Email subscriber list grew from 0 to 2,500 in 4 months',
      'Average session duration of 4+ minutes',
      '3 new sponsors acquired through website inquiries'
    ],
    testimonial: {
      quote: "Finally, a website that makes our podcast look as professional as our content. The episode organization alone has transformed how listeners engage with us.",
      author: "Client Testimonial",
      role: "Trade Titans Host"
    },
    image: '/tradetitans-screenshot.png',
    link: 'https://tradetitans.live-website.com/'
  },
  {
    id: 'perth-video',
    title: 'Perth Video',
    category: 'Design Pitch',
    description: 'A complete website redesign for Perth\'s premier video production company. Transformed a text-heavy site into a modern, visual experience that showcases their cinematic work.',
    challenge: 'The original website was text-heavy and didn\'t visually demonstrate their video production capabilities. Services were buried in long paragraphs, and the dark circular background felt dated for a creative video company.',
    solution: 'Redesigned with a visual-first approach using stunning aerial drone footage as the hero. Created a services carousel showcasing Interviews, Drone & Aerial, Event Filming, Livestreaming, and more. Added a testimonials slider, project gallery, and clean contact section. Built with WordPress and Bricks Builder for easy content management.',
    tech: ['WordPress', 'Bricks Builder', 'Custom CSS', 'Responsive Design'],
    results: [
      'Visual-first design showcasing video production quality',
      'Services carousel replacing walls of text',
      'Testimonials and project gallery for social proof',
      'Modern dark theme with cinematic aesthetic'
    ],
    image: '/perth-video-screenshot.png',
    link: 'https://darkturquoise-woodpecker-593820.hostingersite.com/'
  },
  {
    id: 'correct-electric',
    title: 'Correct Electric',
    category: 'Design Pitch',
    description: 'A bold homepage redesign concept for Houston\'s commercial electrical contractor. Designed to establish authority and convert enterprise clients through strategic visual hierarchy.',
    challenge: 'The existing website looked like a small residential operation despite 200+ commercial projects and 15+ years in business. They were losing bids to competitors with more professional web presence.',
    solution: 'Redesigned the entire homepage to lead with authority—bold statistics front and center, a dark professional color scheme that commands respect, and clear service pathways for property managers, general contractors, and business owners. The new design positions them as an enterprise-ready commercial contractor.',
    tech: ['Framer', 'UI/UX Design', 'Responsive Design', 'Conversion Optimization'],
    results: [
      'Complete visual transformation from residential to commercial aesthetic',
      'Statistics-first hero section showcasing 200+ projects',
      'Clear user journeys for 3 distinct buyer personas',
      'Mobile-responsive design for on-site decision makers'
    ],
    image: '/correct-electric-screenshot.png',
    link: 'https://key-customers-179321.framer.app/'
  },
  {
    id: 'abacus',
    title: 'Abacus Home Services',
    category: 'Design Pitch',
    description: 'Homepage redesign concept for Houston\'s award-winning home services company. Positioned Abacus as the premium choice for plumbing, HVAC, electrical, and water solutions.',
    challenge: 'Their biggest competitive advantage—24/7 emergency service—was buried in the website. Panicked homeowners at 2 AM couldn\'t quickly find help or trust them with an emergency call.',
    solution: 'Redesigned the homepage with trust as the foundation. Licensed technician badges, satisfaction guarantee, and 24/7 availability now appear above the fold. Created visual service cards for easy navigation between plumbing, HVAC, electrical, and water services. The emergency contact number is now impossible to miss with a sticky header CTA.',
    tech: ['Framer', 'UI/UX Design', 'Conversion Optimization', 'Mobile-First Design'],
    results: [
      'Emergency CTA moved from footer to prominent sticky header',
      'Trust signals (licenses, guarantees) visible within 2 seconds',
      'Service discovery simplified with visual card navigation',
      'Mobile-first design for urgent searches on any device'
    ],
    image: '/abacus-screenshot.png',
    link: 'https://diligent-vision-590775.framer.app/'
  },
  {
    id: 'maid-to-please',
    title: 'Maid To Please',
    category: 'Websites',
    description: 'A modern booking-focused website for a 30+ year cleaning company serving the DC, Maryland, and Virginia metro area. Built to convert browsers into booked appointments.',
    challenge: 'Maid To Please had been in business since 1991 but their website felt stuck in 2005. The booking process was confusing, service areas were unclear, and they weren\'t leveraging their 30+ years of credibility. Competitors with slick websites were winning customers despite having a fraction of the experience.',
    solution: 'Built a conversion-optimized WordPress site with an instant booking calculator that gives visitors a price estimate in under 60 seconds. Created dedicated landing pages for each service type (house cleaning, apartment, move-in/out, post-construction) and location (DC, Maryland, Virginia). Prominently featured their 30+ year history, satisfaction guarantee, and customer testimonials throughout the buyer journey.',
    tech: ['WordPress', 'Custom Booking Calculator', 'Multi-location SEO', 'Landing Pages'],
    results: [
      'Online bookings increased 250% in first quarter',
      'Booking calculator completion rate of 73%',
      'Service area pages rank top 5 for 25+ local keywords',
      'Phone call volume decreased 40% (shifted to online booking)'
    ],
    testimonial: {
      quote: "After 30 years, we finally have a website that works as hard as we do. The booking calculator alone has transformed our business.",
      author: "Client Testimonial",
      role: "Maid To Please Owner"
    },
    image: 'https://jojishiotsuki.com/wp-content/uploads/2025/10/Untitled-design-90.png',
    link: 'https://shirazr.sg-host.com/'
  },
  {
    id: 'spark-your-designs',
    title: 'Spark Your Designs',
    category: 'Websites',
    description: 'A professional website for a Cebu-based web design and digital services company. Built to establish credibility and convert visitors into clients seeking custom web solutions.',
    challenge: 'Spark Your Designs needed a website that would showcase their expertise in custom web design, branding, and SEO while building trust with potential clients. The site needed to clearly communicate their services and make it easy for businesses to get in touch.',
    solution: 'Developed a clean, professional website that highlights their core services: custom website design, branding, SEO optimization, and e-commerce solutions. Implemented clear service descriptions, prominent contact information, and trust signals including client testimonials and a 4.9-star rating display.',
    tech: ['WordPress', 'Custom Design', 'SEO', 'Responsive Design'],
    results: [
      'Professional online presence established for local web design agency',
      'Clear service offerings for custom websites, branding, and SEO',
      '4.9-star rating prominently featured for social proof',
      'Streamlined contact flow for lead generation'
    ],
    testimonial: {
      quote: "Clear, direct communication and a structured approach to project delivery. Our new website has generated measurable improvements in leads and sales.",
      author: "Client Testimonial",
      role: "Spark Your Designs"
    },
    image: '/spark-your-designs-screenshot.png',
    link: 'https://syd.jojishiotsuki.com/'
  }
];

// --- CAREER STORY ---

export const EXPERIENCE: Experience[] = [
  {
    id: 'best-roofing',
    role: 'Full-Stack WordPress Developer',
    company: 'Best Roofing Now',
    period: 'Oct 2024 - Present',
    description: 'Driving web infrastructure and SEO strategy for a major roofing company.'
  },
  {
    id: 'polianna',
    role: 'Web Developer',
    company: 'Polianna, LLC',
    period: 'May 2024 - Oct 2024',
    description: 'Specialized in SEO implementation and site speed optimization services.'
  },
  {
    id: '100devs',
    role: 'Software Engineer',
    company: '100Devs',
    period: 'Jun 2023 - May 2024',
    description: 'Intensive full-stack bootcamp mastering the MERN stack and software engineering principles.'
  },
  {
    id: 'interior',
    role: 'Flooring Specialist',
    company: 'Shiotsuki Interior',
    period: 'Mar 2022 - May 2023',
    description: 'Gained deep construction industry insight while optimizing operational workflows.'
  },
  {
    id: 'toyota',
    role: 'Team Lead',
    company: 'Toyota Inter Japan',
    period: 'Apr 2018 - Aug 2020',
    description: 'Led retail operations, developing strong leadership and process management skills.'
  }
];