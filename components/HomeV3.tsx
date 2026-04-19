import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  Sparkles,
  Coins,
  MapPin,
  Sword,
  Scroll,
  Trophy,
  Zap,
  ArrowRight,
  ChevronRight,
  ExternalLink,
  Mail,
  CircleDot,
} from 'lucide-react';
import { useTheme } from '../ThemeContext';
import { PERSONAL_INFO, SERVICES, PROJECTS, EXPERIENCE } from '../constants';

// =============================================================================
// PIXEL DESIGN TOKENS
// =============================================================================

const fontPixelTitle = "'Press Start 2P', 'Courier New', monospace";
const fontPixelDisplay = "'Pixelify Sans', 'Courier New', monospace";
const fontPixelBody = "'VT323', 'Courier New', monospace";

// 8-bit palette derived from sage brand
const px = {
  // Primary sage variants (mapped to existing brand)
  sageDark: '#5F7161',
  sageMid: '#8D9A7C',
  sageLight: '#C3C9A5',
  // Accent pixel colors
  hpRed: '#D14D5C',
  mpBlue: '#5B7FB8',
  goldYellow: '#E0B84C',
  xpPurple: '#9B7BC4',
};

// Hard pixel shadow (no blur) — direction "down-right"
const pixelShadow = (color: string, size = 4) =>
  `${size}px ${size}px 0 0 ${color}`;

// =============================================================================
// REUSABLE PIXEL COMPONENTS
// =============================================================================

interface PixelBoxProps {
  children: React.ReactNode;
  bg?: string;
  border?: string;
  shadow?: string;
  padding?: string;
  className?: string;
  style?: React.CSSProperties;
}

const PixelBox: React.FC<PixelBoxProps> = ({
  children,
  bg,
  border,
  shadow,
  padding = '20px',
  className,
  style,
}) => (
  <div
    className={className}
    style={{
      background: bg,
      border: `4px solid ${border}`,
      boxShadow: shadow ? pixelShadow(shadow, 6) : 'none',
      padding,
      borderRadius: 0,
      imageRendering: 'pixelated',
      ...style,
    }}
  >
    {children}
  </div>
);

interface PixelButtonProps {
  children: React.ReactNode;
  primary?: boolean;
  href?: string;
  to?: string;
  external?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
}

const PixelButton: React.FC<PixelButtonProps> = ({
  children,
  primary,
  href,
  to,
  external,
  fullWidth,
  onClick,
  ariaLabel,
}) => {
  const { theme, mode } = useTheme();
  const [pressed, setPressed] = useState(false);
  const [hovered, setHovered] = useState(false);

  const isDark = mode === 'dark';
  const bg = primary ? px.sageMid : isDark ? '#1A1F18' : '#FFFFFF';
  const fg = primary ? '#0C0F14' : isDark ? '#F5F3EE' : '#2A2820';
  const border = primary ? px.sageDark : isDark ? px.sageMid : '#2A2820';
  const shadowColor = primary
    ? isDark ? '#3D4838' : '#3D4838'
    : isDark ? px.sageMid : '#2A2820';

  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    padding: '16px 24px',
    fontFamily: fontPixelDisplay,
    fontSize: '16px',
    fontWeight: 700,
    letterSpacing: '1px',
    textTransform: 'uppercase',
    background: hovered ? (primary ? px.sageLight : px.sageMid) : bg,
    color: hovered ? '#0C0F14' : fg,
    border: `4px solid ${border}`,
    borderRadius: 0,
    cursor: 'pointer',
    textDecoration: 'none',
    boxShadow: pressed ? 'none' : pixelShadow(shadowColor, 6),
    transform: pressed ? 'translate(6px, 6px)' : 'translate(0, 0)',
    transition: 'transform 60ms ease-out, box-shadow 60ms ease-out, background 0.2s ease',
    width: fullWidth ? '100%' : 'auto',
    imageRendering: 'pixelated',
    whiteSpace: 'nowrap',
  };

  const handlers = {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => {
      setHovered(false);
      setPressed(false);
    },
    onMouseDown: () => setPressed(true),
    onMouseUp: () => setPressed(false),
    onTouchStart: () => setPressed(true),
    onTouchEnd: () => setPressed(false),
    onClick,
    'aria-label': ariaLabel,
  };

  if (to) {
    return (
      <Link to={to} style={baseStyle} {...handlers}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        style={baseStyle}
        {...handlers}
      >
        {children}
      </a>
    );
  }
  return (
    <button type="button" style={baseStyle} {...handlers}>
      {children}
    </button>
  );
};

// Blinking cursor
const BlinkCursor: React.FC<{ color?: string }> = ({ color }) => {
  const { theme } = useTheme();
  return (
    <span
      style={{
        display: 'inline-block',
        width: '0.6em',
        height: '1em',
        background: color || theme.accent,
        verticalAlign: 'text-bottom',
        marginLeft: '4px',
        animation: 'homev3-blink 1s steps(2) infinite',
      }}
    />
  );
};

// ASCII pixel divider
const PixelDivider: React.FC<{ color?: string }> = ({ color }) => {
  const { theme } = useTheme();
  return (
    <div
      aria-hidden
      style={{
        display: 'flex',
        gap: '8px',
        margin: '16px 0',
        fontFamily: fontPixelTitle,
        fontSize: '8px',
        color: color || theme.accent,
        letterSpacing: '4px',
        userSelect: 'none',
      }}
    >
      ◆ ─── ◇ ─── ◆ ─── ◇ ─── ◆
    </div>
  );
};

// =============================================================================
// HERO V3 — World map / NPC dialog box
// =============================================================================

const HeroV3: React.FC = () => {
  const { theme, mode } = useTheme();
  const isDark = mode === 'dark';
  const borderColor = isDark ? px.sageMid : '#2A2820';
  const bgPanel = isDark ? '#15170C' : '#FFFFFF';

  // Dialog typing effect
  const dialogLines = [
    'Greetings, traveler!',
    'I forge websites for service shops',
    'and rank them on the Search Engine.',
    'Press [START] to begin your quest.',
  ];

  return (
    <section
      id="home-v3"
      aria-label="Pixel hero"
      className="homev3-hero"
      style={{
        padding: '120px 32px 80px',
        position: 'relative',
        background: theme.bgPrimary,
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Top status bar */}
        <div
          className="homev3-status-bar"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 16px',
            background: theme.bgSecondary,
            border: `4px solid ${borderColor}`,
            marginBottom: '32px',
            fontFamily: fontPixelTitle,
            fontSize: '10px',
            letterSpacing: '2px',
            color: theme.textPrimary,
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CircleDot size={12} style={{ color: px.sageMid }} />
            WORLD MAP — CEBU.PH
          </span>
          <span style={{ color: px.sageMid }}>SAVE FILE 002 // PIXEL.MODE</span>
          <span>LV. 27</span>
        </div>

        {/* Main hero grid */}
        <div
          className="homev3-hero-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1.4fr 1fr',
            gap: '24px',
            alignItems: 'flex-start',
          }}
        >
          {/* Left: Title + dialog box */}
          <div>
            <div
              style={{
                fontFamily: fontPixelTitle,
                fontSize: '12px',
                color: px.sageMid,
                letterSpacing: '3px',
                marginBottom: '24px',
              }}
            >
              ► PLAYER 1 SELECTED
            </div>

            <h1
              className="homev3-hero-h1"
              style={{
                fontFamily: fontPixelTitle,
                fontSize: 'clamp(28px, 5vw, 56px)',
                color: theme.textPrimary,
                lineHeight: 1.3,
                letterSpacing: '2px',
                marginBottom: '32px',
                textShadow: `4px 4px 0 ${px.sageDark}`,
              }}
            >
              JOJI.EXE
              <br />
              <span style={{ color: px.sageMid }}>LOADED</span>
              <BlinkCursor color={px.sageLight} />
            </h1>

            {/* NPC dialog box */}
            <div
              className="homev3-dialog"
              style={{
                position: 'relative',
                background: bgPanel,
                border: `4px solid ${borderColor}`,
                boxShadow: pixelShadow(px.sageMid, 6),
                padding: '24px 28px',
                marginBottom: '32px',
              }}
            >
              {/* Dialog corner marker */}
              <div
                aria-hidden
                style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '20px',
                  background: px.sageMid,
                  color: '#0C0F14',
                  padding: '4px 12px',
                  fontFamily: fontPixelTitle,
                  fontSize: '9px',
                  letterSpacing: '2px',
                  border: `4px solid ${borderColor}`,
                }}
              >
                JOJI.NPC
              </div>

              <div
                style={{
                  fontFamily: fontPixelBody,
                  fontSize: '22px',
                  lineHeight: 1.5,
                  color: theme.textPrimary,
                }}
              >
                {dialogLines.map((line, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'flex-start',
                      marginBottom: '6px',
                    }}
                  >
                    <span style={{ color: px.sageMid, flexShrink: 0 }}>{'>'}</span>
                    <span>{line}</span>
                  </div>
                ))}
              </div>

              {/* Continue triangle */}
              <div
                aria-hidden
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  right: '16px',
                  fontFamily: fontPixelTitle,
                  fontSize: '12px',
                  color: px.sageMid,
                  animation: 'homev3-bounce 1.2s ease-in-out infinite',
                }}
              >
                ▼
              </div>
            </div>

            <div
              className="homev3-hero-cta"
              style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}
            >
              <PixelButton
                primary
                href="https://calendly.com/jojishiotsuki0/30min"
                external
                ariaLabel="Start quest — book a call"
              >
                <Sword size={14} /> [A] START QUEST
              </PixelButton>
              <PixelButton href="#homev3-trophy" ariaLabel="View lore — see projects">
                <Scroll size={14} /> [B] VIEW LORE
              </PixelButton>
            </div>
          </div>

          {/* Right: Inventory grid */}
          <div
            className="homev3-inventory"
            style={{
              background: theme.bgSecondary,
              border: `4px solid ${borderColor}`,
              boxShadow: pixelShadow(px.sageMid, 6),
              padding: '24px',
            }}
          >
            <div
              style={{
                fontFamily: fontPixelTitle,
                fontSize: '11px',
                letterSpacing: '3px',
                color: theme.textPrimary,
                marginBottom: '20px',
                paddingBottom: '12px',
                borderBottom: `4px dotted ${borderColor}`,
              }}
            >
              ◆ INVENTORY
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                marginBottom: '24px',
              }}
            >
              <StatBlock theme={theme} icon={<Heart size={16} />} label="HP" value="100/100" color={px.hpRed} />
              <StatBlock theme={theme} icon={<Sparkles size={16} />} label="MP" value="LV.27" color={px.mpBlue} />
              <StatBlock theme={theme} icon={<Coins size={16} />} label="GLD" value="600+" color={px.goldYellow} />
              <StatBlock theme={theme} icon={<MapPin size={16} />} label="LOC" value="CEBU" color={px.sageMid} />
            </div>

            <div
              style={{
                fontFamily: fontPixelBody,
                fontSize: '18px',
                lineHeight: 1.4,
                color: theme.textSecondary,
                paddingTop: '16px',
                borderTop: `4px dotted ${borderColor}`,
              }}
            >
              <div style={{ color: px.sageMid, marginBottom: '6px', fontFamily: fontPixelTitle, fontSize: '10px', letterSpacing: '2px' }}>
                CURRENT QUEST
              </div>
              US Roofing Co. + new Cebu salon site
              <div
                style={{
                  marginTop: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontFamily: fontPixelTitle,
                  fontSize: '9px',
                  color: px.sageMid,
                  letterSpacing: '2px',
                }}
              >
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    background: px.sageMid,
                    animation: 'homev3-blink 1s steps(2) infinite',
                  }}
                />
                ACTIVE
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const StatBlock: React.FC<{
  theme: ReturnType<typeof useTheme>['theme'];
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}> = ({ theme, icon, label, value, color }) => (
  <div
    style={{
      background: theme.bgPrimary,
      border: `3px solid ${color}`,
      padding: '12px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    }}
  >
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontFamily: fontPixelTitle,
        fontSize: '9px',
        color,
        letterSpacing: '1.5px',
      }}
    >
      <span style={{ display: 'inline-flex' }}>{icon}</span>
      {label}
    </div>
    <div
      style={{
        fontFamily: fontPixelDisplay,
        fontSize: '18px',
        fontWeight: 700,
        color: theme.textPrimary,
        letterSpacing: '0.5px',
      }}
    >
      {value}
    </div>
  </div>
);

// =============================================================================
// PARTY STATS V3 — Achievement strip
// =============================================================================

const PartyStatsV3: React.FC = () => {
  const { theme, mode } = useTheme();
  const isDark = mode === 'dark';
  const borderColor = isDark ? px.sageMid : '#2A2820';

  const achievements = [
    { value: '#1', label: 'GOOGLE RANK', sub: 'Cebu Boss Defeated', color: px.goldYellow, icon: Trophy },
    { value: '60%', label: 'WALK-INS UP', sub: 'Pundok Combo +', color: px.sageMid, icon: Zap },
    { value: '600+', label: 'DEV XP HRS', sub: 'Lvl 27 Builder', color: px.mpBlue, icon: Sparkles },
    { value: 'PH+US', label: 'REGIONS', sub: '2 Continents', color: px.hpRed, icon: MapPin },
  ];

  return (
    <section
      aria-label="Achievements"
      className="homev3-section"
      style={{ padding: '80px 32px', background: theme.bgSecondary }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <PixelSectionTitle theme={theme} icon="★" title="PARTY STATS" sub="Achievements unlocked." />

        <div
          className="homev3-achievements-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px',
          }}
        >
          {achievements.map((a) => {
            const Icon = a.icon;
            return (
              <div
                key={a.label}
                style={{
                  background: theme.bgPrimary,
                  border: `4px solid ${borderColor}`,
                  boxShadow: pixelShadow(a.color, 6),
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}
                >
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      background: a.color,
                      border: `3px solid ${borderColor}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#0C0F14',
                    }}
                  >
                    <Icon size={18} />
                  </div>
                  <span
                    style={{
                      fontFamily: fontPixelTitle,
                      fontSize: '8px',
                      color: px.sageMid,
                      letterSpacing: '2px',
                    }}
                  >
                    +1 ACHV
                  </span>
                </div>
                <div
                  style={{
                    fontFamily: fontPixelTitle,
                    fontSize: 'clamp(20px, 3vw, 32px)',
                    color: theme.textPrimary,
                    letterSpacing: '1px',
                    lineHeight: 1.1,
                  }}
                >
                  {a.value}
                </div>
                <div
                  style={{
                    fontFamily: fontPixelTitle,
                    fontSize: '9px',
                    color: a.color,
                    letterSpacing: '2px',
                  }}
                >
                  {a.label}
                </div>
                <div
                  style={{
                    fontFamily: fontPixelBody,
                    fontSize: '16px',
                    color: theme.textTertiary,
                    lineHeight: 1.3,
                    marginTop: 'auto',
                  }}
                >
                  {a.sub}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// =============================================================================
// SHARED — Section title
// =============================================================================

const PixelSectionTitle: React.FC<{
  theme: ReturnType<typeof useTheme>['theme'];
  icon: string;
  title: string;
  sub?: string;
}> = ({ theme, icon, title, sub }) => (
  <div style={{ marginBottom: '40px' }}>
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '12px',
        padding: '8px 16px',
        background: px.sageMid,
        color: '#0C0F14',
        border: `4px solid ${px.sageDark}`,
        fontFamily: fontPixelTitle,
        fontSize: '10px',
        letterSpacing: '3px',
        marginBottom: '20px',
      }}
    >
      <span aria-hidden style={{ fontSize: '12px' }}>{icon}</span>
      {title}
    </div>
    {sub && (
      <div
        style={{
          fontFamily: fontPixelBody,
          fontSize: '24px',
          color: theme.textSecondary,
          maxWidth: '600px',
        }}
      >
        {sub}
      </div>
    )}
  </div>
);

// =============================================================================
// MERCHANT'S SHOP V3 — Services
// =============================================================================

const ShopV3: React.FC = () => {
  const { theme, mode } = useTheme();
  const isDark = mode === 'dark';
  const borderColor = isDark ? px.sageMid : '#2A2820';
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const itemMeta: Record<string, { tag: string; price: string; xp: string }> = {
    websites: { tag: 'BEST SELLER', price: 'CUSTOM QUOTE', xp: '+300 XP' },
    seo: { tag: 'POPULAR', price: 'MONTHLY', xp: '+200 XP' },
    maintenance: { tag: 'SUBSCRIPTION', price: 'MONTHLY', xp: '+100 XP' },
  };

  return (
    <section
      aria-label="Services shop"
      className="homev3-section"
      style={{ padding: '80px 32px', background: theme.bgPrimary }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <PixelSectionTitle
          theme={theme}
          icon="⚒"
          title="MERCHANT'S SHOP"
          sub="Pick your build. Three crafts, all forged by hand."
        />

        <div
          className="homev3-shop-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
          }}
        >
          {SERVICES.map((service, i) => {
            const meta = itemMeta[service.id] || { tag: 'ITEM', price: 'QUOTE', xp: '+XP' };
            const isHovered = hoveredItem === service.id;
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                onMouseEnter={() => setHoveredItem(service.id)}
                onMouseLeave={() => setHoveredItem(null)}
                style={{
                  background: theme.bgSecondary,
                  border: `4px solid ${borderColor}`,
                  boxShadow: pixelShadow(isHovered ? px.sageLight : px.sageMid, 6),
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  position: 'relative',
                  cursor: 'default',
                  transition: 'box-shadow 150ms ease-out',
                }}
              >
                {/* Tag */}
                <div
                  style={{
                    position: 'absolute',
                    top: '-12px',
                    right: '-4px',
                    background: i === 0 ? px.goldYellow : px.sageMid,
                    color: '#0C0F14',
                    padding: '4px 10px',
                    fontFamily: fontPixelTitle,
                    fontSize: '8px',
                    letterSpacing: '1.5px',
                    border: `3px solid ${borderColor}`,
                  }}
                >
                  {meta.tag}
                </div>

                {/* Icon + slot number */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      background: px.sageMid,
                      border: `4px solid ${borderColor}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#0C0F14',
                    }}
                  >
                    <Icon size={24} />
                  </div>
                  <span
                    style={{
                      fontFamily: fontPixelTitle,
                      fontSize: '10px',
                      color: theme.textMuted,
                      letterSpacing: '2px',
                    }}
                  >
                    SLOT 0{i + 1}
                  </span>
                </div>

                {/* Title */}
                <h3
                  style={{
                    fontFamily: fontPixelTitle,
                    fontSize: '13px',
                    color: theme.textPrimary,
                    letterSpacing: '1px',
                    lineHeight: 1.4,
                    minHeight: '70px',
                  }}
                >
                  {service.title}
                </h3>

                {/* Description */}
                <p
                  style={{
                    fontFamily: fontPixelBody,
                    fontSize: '18px',
                    lineHeight: 1.45,
                    color: theme.textSecondary,
                    flex: 1,
                  }}
                >
                  {service.description}
                </p>

                {/* Price + XP footer */}
                <div
                  style={{
                    paddingTop: '16px',
                    borderTop: `4px dotted ${borderColor}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span
                    style={{
                      fontFamily: fontPixelTitle,
                      fontSize: '10px',
                      color: px.goldYellow,
                      letterSpacing: '1.5px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <Coins size={12} /> {meta.price}
                  </span>
                  <span
                    style={{
                      fontFamily: fontPixelTitle,
                      fontSize: '10px',
                      color: px.mpBlue,
                      letterSpacing: '1.5px',
                    }}
                  >
                    {meta.xp}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// =============================================================================
// QUEST LOG V3 — Process
// =============================================================================

const QuestLogV3: React.FC = () => {
  const { theme, mode } = useTheme();
  const isDark = mode === 'dark';
  const borderColor = isDark ? px.sageMid : '#2A2820';

  const quests = [
    {
      id: 1,
      title: 'SCOUT THE TERRAIN',
      sub: 'Free site audit',
      desc: "I look at your site (or lack of one) and tell you exactly what's killing your rankings.",
      reward: '24h',
      xp: '+50 XP',
      icon: '🔍',
    },
    {
      id: 2,
      title: 'PLAN THE ATTACK',
      sub: 'Strategy call',
      desc: 'We jump on a call, I learn the business, and I give you a plan to rank and bring leads.',
      reward: '30m',
      xp: '+100 XP',
      icon: '⚔',
    },
    {
      id: 3,
      title: 'LAUNCH & RANK',
      sub: 'Build & ship',
      desc: 'New site shipped in two weeks. Google notices. The phone starts ringing.',
      reward: '2wk',
      xp: '+500 XP',
      icon: '🚀',
    },
  ];

  return (
    <section
      aria-label="Quest log"
      className="homev3-section"
      style={{ padding: '80px 32px', background: theme.bgSecondary }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <PixelSectionTitle
          theme={theme}
          icon="❖"
          title="QUEST LOG"
          sub="Three quests from invisible to inbox-full."
        />

        <div
          style={{
            background: theme.bgPrimary,
            border: `4px solid ${borderColor}`,
            boxShadow: pixelShadow(px.sageMid, 6),
            padding: 0,
          }}
        >
          {quests.map((q, i) => (
            <div
              key={q.id}
              className="homev3-quest-row"
              style={{
                display: 'grid',
                gridTemplateColumns: '80px 1fr auto',
                gap: '24px',
                padding: '24px',
                borderBottom:
                  i < quests.length - 1 ? `4px dotted ${borderColor}` : 'none',
                alignItems: 'center',
              }}
            >
              {/* Quest number badge */}
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  background: px.sageMid,
                  border: `4px solid ${borderColor}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: fontPixelTitle,
                  fontSize: '20px',
                  color: '#0C0F14',
                  letterSpacing: '1px',
                }}
              >
                0{q.id}
              </div>

              {/* Title + description */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '12px',
                    marginBottom: '8px',
                    flexWrap: 'wrap',
                  }}
                >
                  <h3
                    style={{
                      fontFamily: fontPixelTitle,
                      fontSize: '14px',
                      color: theme.textPrimary,
                      letterSpacing: '2px',
                    }}
                  >
                    {q.title}
                  </h3>
                  <span
                    style={{
                      fontFamily: fontPixelBody,
                      fontSize: '20px',
                      color: px.sageMid,
                    }}
                  >
                    — {q.sub}
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: fontPixelBody,
                    fontSize: '20px',
                    lineHeight: 1.45,
                    color: theme.textSecondary,
                    maxWidth: '520px',
                  }}
                >
                  {q.desc}
                </p>
              </div>

              {/* Reward badge */}
              <div
                className="homev3-quest-reward"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  alignItems: 'flex-end',
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    background: theme.bgSecondary,
                    border: `3px solid ${px.goldYellow}`,
                    padding: '6px 12px',
                    fontFamily: fontPixelTitle,
                    fontSize: '10px',
                    color: px.goldYellow,
                    letterSpacing: '1.5px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Coins size={11} /> {q.reward}
                </div>
                <div
                  style={{
                    fontFamily: fontPixelTitle,
                    fontSize: '9px',
                    color: px.mpBlue,
                    letterSpacing: '1.5px',
                  }}
                >
                  {q.xp}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'center' }}>
          <PixelButton primary href="https://calendly.com/jojishiotsuki0/30min" external>
            <Sword size={14} /> ACCEPT ALL QUESTS
          </PixelButton>
        </div>
      </div>
    </section>
  );
};

// =============================================================================
// TROPHY HALL V3 — Projects
// =============================================================================

const TrophyHallV3: React.FC = () => {
  const { theme, mode } = useTheme();
  const isDark = mode === 'dark';
  const borderColor = isDark ? px.sageMid : '#2A2820';
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const featured = PROJECTS.slice(0, 6);

  return (
    <section
      id="homev3-trophy"
      aria-label="Trophy hall"
      className="homev3-section"
      style={{ padding: '80px 32px', background: theme.bgPrimary }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div
          className="homev3-trophy-header"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '40px',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <PixelSectionTitle
            theme={theme}
            icon="♛"
            title="TROPHY HALL"
            sub="Bosses defeated, sites shipped."
          />
          <Link
            to="/projects"
            style={{
              fontFamily: fontPixelTitle,
              fontSize: '11px',
              color: theme.textPrimary,
              textDecoration: 'none',
              letterSpacing: '2px',
              padding: '12px 16px',
              border: `4px solid ${borderColor}`,
              boxShadow: pixelShadow(px.sageMid, 4),
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = px.sageMid;
              e.currentTarget.style.color = '#0C0F14';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = theme.textPrimary;
            }}
          >
            VIEW ALL ({PROJECTS.length}) <ArrowRight size={12} />
          </Link>
        </div>

        <div
          className="homev3-trophy-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
          }}
        >
          {featured.map((p, i) => {
            const isHovered = hoveredId === p.id;
            const Wrapper: React.ElementType = p.link ? 'a' : 'div';
            const wrapperProps = p.link
              ? { href: p.link, target: '_blank', rel: 'noopener noreferrer' }
              : {};

            return (
              <Wrapper
                key={p.id}
                {...wrapperProps}
                onMouseEnter={() => setHoveredId(p.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  background: theme.bgSecondary,
                  border: `4px solid ${borderColor}`,
                  boxShadow: pixelShadow(isHovered ? px.sageLight : px.sageMid, 6),
                  display: 'flex',
                  flexDirection: 'column',
                  textDecoration: 'none',
                  cursor: p.link ? 'pointer' : 'default',
                  transition: 'box-shadow 150ms ease-out',
                  position: 'relative',
                }}
                className="homev3-trophy-card"
              >
                {/* Image with pixel frame */}
                <div
                  style={{
                    position: 'relative',
                    background: '#0C0F14',
                    overflow: 'hidden',
                    borderBottom: `4px solid ${borderColor}`,
                    aspectRatio: '16 / 10',
                  }}
                >
                  <img
                    src={p.image}
                    alt={p.title}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      filter: isHovered ? 'none' : 'saturate(0.7)',
                      transition: 'filter 0.3s ease',
                      imageRendering: 'auto',
                    }}
                  />
                  {/* Slot number */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '8px',
                      left: '8px',
                      background: '#0C0F14',
                      color: px.goldYellow,
                      padding: '4px 8px',
                      fontFamily: fontPixelTitle,
                      fontSize: '9px',
                      letterSpacing: '1.5px',
                      border: `2px solid ${px.goldYellow}`,
                    }}
                  >
                    #{String(i + 1).padStart(2, '0')}
                  </div>
                  {/* External link badge */}
                  {p.link && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        background: isHovered ? px.sageMid : 'rgba(12, 15, 20, 0.8)',
                        color: isHovered ? '#0C0F14' : '#F5F3EE',
                        padding: '6px',
                        border: `2px solid ${isHovered ? px.sageDark : px.sageMid}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <ExternalLink size={12} />
                    </div>
                  )}
                </div>

                {/* Card body */}
                <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div
                    style={{
                      fontFamily: fontPixelTitle,
                      fontSize: '8px',
                      color: px.sageMid,
                      letterSpacing: '2px',
                    }}
                  >
                    [{p.category.toUpperCase()}]
                  </div>
                  <h3
                    style={{
                      fontFamily: fontPixelTitle,
                      fontSize: '13px',
                      color: theme.textPrimary,
                      letterSpacing: '1px',
                      lineHeight: 1.3,
                    }}
                  >
                    {p.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: fontPixelBody,
                      fontSize: '17px',
                      lineHeight: 1.35,
                      color: theme.textTertiary,
                      flex: 1,
                    }}
                  >
                    {p.description.slice(0, 90)}
                    {p.description.length > 90 ? '...' : ''}
                  </p>
                </div>
              </Wrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// =============================================================================
// CHARACTER LORE V3 — About
// =============================================================================

const LoreV3: React.FC = () => {
  const { theme, mode } = useTheme();
  const isDark = mode === 'dark';
  const borderColor = isDark ? px.sageMid : '#2A2820';

  return (
    <section
      aria-label="Character lore"
      className="homev3-section"
      style={{ padding: '80px 32px', background: theme.bgSecondary }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <PixelSectionTitle theme={theme} icon="✦" title="CHARACTER LORE" />

        <div
          className="homev3-lore-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px',
            alignItems: 'flex-start',
          }}
        >
          {/* Left: NPC bio dialog */}
          <div
            style={{
              background: theme.bgPrimary,
              border: `4px solid ${borderColor}`,
              boxShadow: pixelShadow(px.sageMid, 6),
              padding: '32px',
            }}
          >
            <div
              style={{
                display: 'inline-block',
                background: px.goldYellow,
                color: '#0C0F14',
                padding: '4px 10px',
                fontFamily: fontPixelTitle,
                fontSize: '9px',
                letterSpacing: '2px',
                marginBottom: '24px',
                border: `3px solid ${borderColor}`,
              }}
            >
              CLASS: WEB-DEV / RANK: S
            </div>

            <h2
              style={{
                fontFamily: fontPixelTitle,
                fontSize: 'clamp(18px, 2.5vw, 28px)',
                color: theme.textPrimary,
                lineHeight: 1.4,
                letterSpacing: '2px',
                marginBottom: '24px',
                textShadow: `3px 3px 0 ${px.sageDark}`,
              }}
            >
              JOJI THE
              <br />
              <span style={{ color: px.sageMid }}>SHOP-BUILDER</span>
            </h2>

            <div
              style={{
                fontFamily: fontPixelBody,
                fontSize: '22px',
                lineHeight: 1.5,
                color: theme.textSecondary,
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <p>
                <span style={{ color: px.sageMid }}>{'>'}</span> Two years training inside a US roofing
                guild. Forged a Cebu barbershop into a #1 Google champion in 3 months.
              </p>
              <p>
                <span style={{ color: px.sageMid }}>{'>'}</span> Specializes in service-business spells:
                websites that load, rank, and convert. No agency padding.
              </p>
              <p>
                <span style={{ color: px.sageMid }}>{'>'}</span> Picks up the phone six months later.
                That's the cheat code.
              </p>
            </div>

            <PixelDivider />

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
              }}
            >
              <KeyValue label="ORIGIN" value="Cebu, PH" />
              <KeyValue label="MARKETS" value="PH + US" />
              <KeyValue label="LANGS" value="EN + FIL" />
              <KeyValue label="STATUS" value="Available" />
            </div>
          </div>

          {/* Right: Skill tree / experience timeline */}
          <div
            style={{
              background: theme.bgPrimary,
              border: `4px solid ${borderColor}`,
              boxShadow: pixelShadow(px.sageMid, 6),
              padding: '32px',
            }}
          >
            <div
              style={{
                fontFamily: fontPixelTitle,
                fontSize: '11px',
                color: theme.textPrimary,
                letterSpacing: '2px',
                marginBottom: '24px',
                paddingBottom: '12px',
                borderBottom: `4px dotted ${borderColor}`,
              }}
            >
              ◆ SKILL TREE / TIMELINE
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {EXPERIENCE.map((exp, i) => (
                <div
                  key={exp.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '64px 1fr',
                    gap: '16px',
                    padding: '12px',
                    background: theme.bgSecondary,
                    border: `3px solid ${i === 0 ? px.sageMid : borderColor}`,
                  }}
                >
                  <div
                    style={{
                      background: i === 0 ? px.sageMid : px.mpBlue,
                      color: '#0C0F14',
                      border: `3px solid ${borderColor}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: fontPixelTitle,
                      fontSize: '14px',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {String(EXPERIENCE.length - i).padStart(2, '0')}
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: fontPixelTitle,
                        fontSize: '11px',
                        color: theme.textPrimary,
                        letterSpacing: '1px',
                        marginBottom: '4px',
                        lineHeight: 1.4,
                      }}
                    >
                      {exp.role}
                    </div>
                    <div
                      style={{
                        fontFamily: fontPixelTitle,
                        fontSize: '8px',
                        color: px.sageMid,
                        letterSpacing: '1.5px',
                        marginBottom: '6px',
                      }}
                    >
                      {exp.company} · {exp.period}
                    </div>
                    <p
                      style={{
                        fontFamily: fontPixelBody,
                        fontSize: '17px',
                        lineHeight: 1.4,
                        color: theme.textTertiary,
                      }}
                    >
                      {exp.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const KeyValue: React.FC<{ label: string; value: string }> = ({ label, value }) => {
  const { theme } = useTheme();
  return (
    <div
      style={{
        padding: '8px 12px',
        border: `3px dotted ${px.sageMid}`,
      }}
    >
      <div
        style={{
          fontFamily: fontPixelTitle,
          fontSize: '8px',
          color: px.sageMid,
          letterSpacing: '1.5px',
          marginBottom: '4px',
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: fontPixelDisplay,
          fontSize: '14px',
          fontWeight: 700,
          color: theme.textPrimary,
        }}
      >
        {value}
      </div>
    </div>
  );
};

// =============================================================================
// TALK TO NPC V3 — Contact
// =============================================================================

const TalkToNpcV3: React.FC = () => {
  const { theme, mode } = useTheme();
  const isDark = mode === 'dark';
  const borderColor = isDark ? px.sageMid : '#2A2820';

  const choices = [
    { label: 'Book Audience', sub: 'Free 30-min call', href: 'https://calendly.com/jojishiotsuki0/30min', icon: Sword, primary: true },
    { label: 'Send a Raven', sub: PERSONAL_INFO.email, href: `mailto:${PERSONAL_INFO.email}`, icon: Mail, primary: false },
    { label: 'Visit Workshop', sub: 'See live shipped sites', href: '/projects', isRoute: true, icon: Trophy, primary: false },
  ];

  return (
    <section
      id="contact"
      aria-label="Contact"
      className="homev3-section"
      style={{ padding: '80px 32px 120px', background: theme.bgPrimary }}
    >
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div
          style={{
            background: theme.bgSecondary,
            border: `4px solid ${borderColor}`,
            boxShadow: pixelShadow(px.sageMid, 8),
            padding: '40px',
            position: 'relative',
          }}
        >
          {/* Top label */}
          <div
            aria-hidden
            style={{
              position: 'absolute',
              top: '-14px',
              left: '24px',
              background: px.sageMid,
              color: '#0C0F14',
              padding: '4px 12px',
              fontFamily: fontPixelTitle,
              fontSize: '9px',
              letterSpacing: '2px',
              border: `4px solid ${borderColor}`,
            }}
          >
            ► TALK TO NPC
          </div>

          <h2
            style={{
              fontFamily: fontPixelTitle,
              fontSize: 'clamp(18px, 3vw, 32px)',
              color: theme.textPrimary,
              lineHeight: 1.4,
              letterSpacing: '2px',
              marginBottom: '24px',
              textShadow: `4px 4px 0 ${px.sageDark}`,
            }}
          >
            HEY, TRAVELER.
            <br />
            <span style={{ color: px.sageMid }}>WANNA TRADE?</span>
          </h2>

          <p
            style={{
              fontFamily: fontPixelBody,
              fontSize: '24px',
              lineHeight: 1.5,
              color: theme.textSecondary,
              marginBottom: '32px',
              maxWidth: '640px',
            }}
          >
            <span style={{ color: px.sageMid }}>{'>'}</span> Send me your shop. I'll show you exactly
            what's keeping you off Google. No pitch, no upsell. Pure free audit.
          </p>

          {/* Choice list */}
          <div
            className="homev3-choices"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {choices.map((choice, i) => {
              const Icon = choice.icon;
              const isExternal = choice.href?.startsWith('http') || choice.href?.startsWith('mailto');
              const Wrapper: React.ElementType = choice.isRoute ? Link : 'a';
              const wrapperProps = choice.isRoute
                ? { to: choice.href }
                : { href: choice.href, target: isExternal && !choice.href.startsWith('mailto') ? '_blank' : undefined, rel: isExternal && !choice.href.startsWith('mailto') ? 'noopener noreferrer' : undefined };

              return (
                <ChoiceRow
                  key={choice.label}
                  Wrapper={Wrapper}
                  wrapperProps={wrapperProps}
                  Icon={Icon}
                  label={choice.label}
                  sub={choice.sub}
                  primary={choice.primary}
                  number={i + 1}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

interface ChoiceRowProps {
  Wrapper: React.ElementType;
  wrapperProps: Record<string, unknown>;
  Icon: React.ComponentType<{ size?: number }>;
  label: string;
  sub: string;
  primary: boolean;
  number: number;
}

const ChoiceRow: React.FC<ChoiceRowProps> = ({ Wrapper, wrapperProps, Icon, label, sub, primary, number }) => {
  const { theme, mode } = useTheme();
  const [hovered, setHovered] = useState(false);
  const isDark = mode === 'dark';
  const borderColor = isDark ? px.sageMid : '#2A2820';

  return (
    <Wrapper
      {...wrapperProps}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: '40px 48px 1fr auto',
        gap: '16px',
        alignItems: 'center',
        padding: '16px 20px',
        background: hovered ? (primary ? px.sageMid : theme.bgPrimary) : theme.bgPrimary,
        color: hovered && primary ? '#0C0F14' : theme.textPrimary,
        border: `4px solid ${primary ? px.sageMid : borderColor}`,
        textDecoration: 'none',
        cursor: 'pointer',
        boxShadow: hovered ? pixelShadow(primary ? px.sageDark : px.sageMid, 4) : 'none',
        transform: hovered ? 'translate(-2px, -2px)' : 'translate(0, 0)',
        transition: 'all 100ms ease-out',
      }}
    >
      <span
        style={{
          fontFamily: 'Press Start 2P, monospace',
          fontSize: '14px',
          color: hovered && primary ? '#0C0F14' : px.sageMid,
        }}
      >
        ►{number}
      </span>
      <div
        style={{
          width: '40px',
          height: '40px',
          background: hovered && primary ? '#0C0F14' : px.sageMid,
          color: hovered && primary ? px.sageMid : '#0C0F14',
          border: `3px solid ${hovered && primary ? '#0C0F14' : borderColor}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon size={18} />
      </div>
      <div>
        <div
          style={{
            fontFamily: fontPixelTitle,
            fontSize: '12px',
            letterSpacing: '2px',
            marginBottom: '4px',
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontFamily: fontPixelBody,
            fontSize: '18px',
            color: hovered && primary ? 'rgba(12, 15, 20, 0.8)' : 'inherit',
            opacity: hovered && primary ? 1 : 0.7,
          }}
        >
          {sub}
        </div>
      </div>
      <ChevronRight size={20} style={{ flexShrink: 0 }} />
    </Wrapper>
  );
};

// =============================================================================
// PAGE
// =============================================================================

const HomeV3: React.FC = () => {
  // Inject pixel keyframes once
  useEffect(() => {
    const styleId = 'homev3-keyframes';
    if (document.getElementById(styleId)) return;
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      @keyframes homev3-blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
      }
      @keyframes homev3-bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(4px); }
      }
      @media (prefers-reduced-motion: reduce) {
        [class*="homev3-"] *,
        .homev3-hero h1 span {
          animation: none !important;
        }
      }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <>
      <HeroV3 />
      <PartyStatsV3 />
      <ShopV3 />
      <QuestLogV3 />
      <TrophyHallV3 />
      <LoreV3 />
      <TalkToNpcV3 />
    </>
  );
};

export default HomeV3;
