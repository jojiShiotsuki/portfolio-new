import { motion } from "motion/react";
import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useTheme } from "../../ThemeContext";

interface SocialIcon {
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  href?: string;
}

interface AnimatedSocialIconsProps {
  icons: SocialIcon[];
  iconSize?: number;
}

export function AnimatedSocialIcons({
  icons,
  iconSize = 20,
}: AnimatedSocialIconsProps) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setActive(true), 800);
    return () => clearTimeout(timer);
  }, []);
  const { theme } = useTheme();
  const btnSize = 40;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', position: 'relative' }}>
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          zIndex: 10,
          borderRadius: '9999px',
        }}
        animate={{
          y: active ? `${(icons.length) * (btnSize + 16)}px` : 0,
        }}
        transition={{ type: "tween", ease: "easeInOut", duration: 0.4 }}
      >
        <motion.button
          style={{
            width: btnSize,
            height: btnSize,
            borderRadius: '9999px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: theme.accent,
            border: 'none',
            cursor: 'pointer',
            transition: 'background 0.2s ease',
          }}
          onClick={() => setActive(!active)}
          animate={{ rotate: active ? 45 : 0 }}
          transition={{ type: "tween", ease: "easeInOut", duration: 0.4 }}
          onMouseEnter={(e) => { e.currentTarget.style.background = theme.accentLight; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = theme.accent; }}
        >
          <Plus size={iconSize} strokeWidth={3} color={theme.btnPrimaryText} />
        </motion.button>
      </motion.div>

      {icons.map(({ Icon, href }, index) => (
        <motion.div
          key={index}
          style={{
            width: btnSize,
            height: btnSize,
            borderRadius: '9999px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `1px solid ${theme.borderPrimary}`,
            background: theme.bgPrimary,
          }}
          animate={{
            filter: active ? "blur(0px)" : "blur(3px)",
            scale: active ? 1 : 0.8,
            opacity: active ? 1 : 0,
          }}
          transition={{ type: "tween", ease: "easeInOut", duration: 0.35, delay: active ? index * 0.05 : 0 }}
        >
          {href ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.textTertiary, transition: 'color 0.2s ease' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = theme.accent; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = theme.textTertiary; }}
            >
              <Icon size={iconSize} />
            </a>
          ) : (
            <Icon size={iconSize} color={theme.textTertiary} />
          )}
        </motion.div>
      ))}

    </div>
  );
}
