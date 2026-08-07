import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";
import { useTheme } from "../../ThemeContext";

interface InteractiveHoverButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  text?: string;
  variant?: "primary" | "outline";
  /** External URL, in-page hash, or mailto. Renders a real <a>. */
  href?: string;
  /** Internal route. Renders a react-router <Link>, which is still a real <a>. */
  to?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
}

/**
 * Renders as an anchor whenever it navigates, and only as a <button> for real actions.
 * That keeps the destination crawlable, middle-clickable and save-as-able, and makes
 * screen readers announce "link" rather than "button".
 */
const InteractiveHoverButton = React.forwardRef<HTMLElement, InteractiveHoverButtonProps>(
  ({ text = "Button", variant = "primary", href, to, className, onClick, style: externalStyle, ...props }, ref) => {
    const [hovered, setHovered] = useState(false);
    const { theme } = useTheme();

    const isPrimary = variant === "primary";
    const isHash = !!href && href.startsWith("#");
    const isExternal = !!href && !isHash && !href.startsWith("mailto:") && !href.startsWith("/");

    const handleClick = (e: React.MouseEvent<HTMLElement>) => {
      // Let the browser own plain navigation. Only intercept the smooth in-page scroll,
      // and never when a modifier is held, so cmd/ctrl/middle-click still open a new tab.
      if (isHash && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
        const el = document.querySelector(href!);
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: "smooth" });
        }
      }
      onClick?.(e);
    };

    const sharedStyle: React.CSSProperties = {
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: "13px",
      fontWeight: isPrimary ? 700 : 400,
      letterSpacing: "2px",
      textTransform: "uppercase" as const,
      padding: "20px 40px",
      background: isPrimary ? theme.textPrimary : "transparent",
      color: isPrimary ? theme.btnPrimaryText : theme.textPrimary,
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: !isPrimary && hovered ? theme.accent : isPrimary ? theme.textPrimary : theme.btnOutlineBorder,
      transition: "border-color 0.3s ease",
      textDecoration: "none",
      // an <a> is inline by default; the hover animation needs a block box
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      ...externalStyle,
    };

    const sharedProps = {
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => setHovered(false),
      onClick: handleClick,
      className: cn("interactive-hover-btn relative cursor-pointer overflow-hidden text-center", className),
      style: sharedStyle,
    };

    const inner = (
      <>
        <span
          style={{
            display: "inline-block",
            transform: hovered ? "translateX(48px)" : "translateX(4px)",
            opacity: hovered ? 0 : 1,
            transition: "all 300ms ease",
          }}
        >
          {text}
        </span>
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 10,
            display: "flex",
            height: "100%",
            width: "100%",
            transform: hovered ? "translateX(-4px)" : "translateX(48px)",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            color: theme.btnPrimaryText,
            opacity: hovered ? 1 : 0,
            transition: "all 300ms ease",
          }}
        >
          <span>{text}</span>
          <ArrowRight size={18} />
        </div>
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: hovered ? "0%" : "10%",
            top: hovered ? "0%" : "calc(50% - 3px)",
            height: hovered ? "100%" : "6px",
            width: hovered ? "100%" : "6px",
            transform: hovered ? "scale(1.8)" : "scale(1)",
            borderRadius: "2px",
            background: theme.accent,
            transition: "all 300ms ease",
          }}
        />
      </>
    );

    if (to) {
      return (
        <Link ref={ref as React.Ref<HTMLAnchorElement>} to={to} {...sharedProps} {...(props as object)}>
          {inner}
        </Link>
      );
    }

    if (href) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          {...sharedProps}
          {...(props as object)}
        >
          {inner}
        </a>
      );
    }

    return (
      <button ref={ref as React.Ref<HTMLButtonElement>} type="button" {...sharedProps} {...(props as object)}>
        {inner}
      </button>
    );
  },
);

InteractiveHoverButton.displayName = "InteractiveHoverButton";

export { InteractiveHoverButton };
