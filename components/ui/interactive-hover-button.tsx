import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "../../lib/utils";
import { useTheme } from "../../ThemeContext";

interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  variant?: "primary" | "outline";
  href?: string;
  to?: string;
}

const InteractiveHoverButton = React.forwardRef<
  HTMLButtonElement,
  InteractiveHoverButtonProps
>(({ text = "Button", variant = "primary", href, to, className, onClick, style: externalStyle, ...props }, ref) => {
  const [hovered, setHovered] = useState(false);
  const { theme } = useTheme();
  const navigate = useNavigate();

  const isPrimary = variant === "primary";

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (to) {
      navigate(to);
    } else if (href) {
      if (href.startsWith('#')) {
        const el = document.querySelector(href);
        el?.scrollIntoView({ behavior: 'smooth' });
      } else if (href.startsWith('mailto:')) {
        window.location.href = href;
      } else {
        window.open(href, '_blank', 'noopener,noreferrer');
      }
    }
    onClick?.(e);
  };

  return (
    <button
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
      className={cn(
        "relative cursor-pointer overflow-hidden text-center",
        className,
      )}
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '13px',
        fontWeight: isPrimary ? 700 : 400,
        letterSpacing: '2px',
        textTransform: 'uppercase' as const,
        padding: '20px 40px',
        background: isPrimary ? theme.textPrimary : 'transparent',
        color: isPrimary ? theme.btnPrimaryText : theme.textPrimary,
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: !isPrimary && hovered ? theme.accent : (isPrimary ? theme.textPrimary : theme.btnOutlineBorder),
        transition: 'border-color 0.3s ease',
        ...externalStyle,
      }}
      {...props}
    >
      <span style={{
        display: 'inline-block',
        transform: hovered ? 'translateX(48px)' : 'translateX(4px)',
        opacity: hovered ? 0 : 1,
        transition: 'all 300ms ease',
      }}>
        {text}
      </span>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 10,
        display: 'flex',
        height: '100%',
        width: '100%',
        transform: hovered ? 'translateX(-4px)' : 'translateX(48px)',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        color: theme.btnPrimaryText,
        opacity: hovered ? 1 : 0,
        transition: 'all 300ms ease',
      }}>
        <span>{text}</span>
        <ArrowRight size={18} />
      </div>
      <div style={{
        position: 'absolute',
        left: hovered ? '0%' : '10%',
        top: hovered ? '0%' : 'calc(50% - 3px)',
        height: hovered ? '100%' : '6px',
        width: hovered ? '100%' : '6px',
        transform: hovered ? 'scale(1.8)' : 'scale(1)',
        borderRadius: '2px',
        background: theme.accent,
        transition: 'all 300ms ease',
      }} />
    </button>
  );
});

InteractiveHoverButton.displayName = "InteractiveHoverButton";

export { InteractiveHoverButton };
