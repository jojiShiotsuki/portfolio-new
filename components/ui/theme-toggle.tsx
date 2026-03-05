import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../ThemeContext";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { mode, theme, toggleTheme } = useTheme();
  const isDark = mode === "dark";

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        width: '64px',
        height: '32px',
        padding: '4px',
        borderRadius: '9999px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        background: isDark ? theme.bgSecondary : theme.bgTertiary,
        border: `1px solid ${theme.borderPrimary}`,
      }}
      onClick={toggleTheme}
      role="button"
      tabIndex={0}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '24px',
            height: '24px',
            borderRadius: '9999px',
            transition: 'transform 0.3s ease, background 0.3s ease',
            transform: isDark ? 'translateX(0)' : 'translateX(32px)',
            background: isDark ? theme.bgTertiary : '#ffffff',
          }}
        >
          {isDark ? (
            <Moon size={16} color={theme.textPrimary} strokeWidth={1.5} />
          ) : (
            <Sun size={16} color={theme.textPrimary} strokeWidth={1.5} />
          )}
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '24px',
            height: '24px',
            borderRadius: '9999px',
            transition: 'transform 0.3s ease',
            background: 'transparent',
            transform: isDark ? 'translateX(0)' : 'translateX(-32px)',
          }}
        >
          {isDark ? (
            <Sun size={16} color={theme.textMuted} strokeWidth={1.5} />
          ) : (
            <Moon size={16} color={theme.textMuted} strokeWidth={1.5} />
          )}
        </div>
      </div>
    </div>
  );
}
