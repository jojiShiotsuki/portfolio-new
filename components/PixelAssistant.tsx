import React, { useRef, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../ThemeContext';
import { MessageCircle } from 'lucide-react';

// Render a tiny standing sprite from the PNG sheet as a mini canvas icon
const SPRITE_ZOOM = 2;
const FW = 16;
const FH = 32;

const PixelAssistant: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const miniCanvasRef = useRef<HTMLCanvasElement>(null);
  const [hovered, setHovered] = useState(false);
  const [spriteReady, setSpriteReady] = useState(false);

  // Draw a tiny standing character on the mini canvas
  useEffect(() => {
    const canvas = miniCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Stand frame: col 1, row 0 (facing down)
      ctx.drawImage(img, 1 * FW, 0, FW, FH, 0, 0, FW * SPRITE_ZOOM, FH * SPRITE_ZOOM);
      setSpriteReady(true);
    };
    img.src = '/sprites/char_4.png';
  }, []);

  // Hide on the /talk page
  if (location.pathname === '/talk') return null;

  return (
    <button
      onClick={() => navigate('/talk')}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'fixed',
        bottom: '100px',
        right: '32px',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 18px 10px 10px',
        background: hovered ? theme.accent : theme.bgPrimary,
        border: `1px solid ${hovered ? theme.accent : theme.borderPrimary}`,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: hovered
          ? '0 8px 24px rgba(0,0,0,0.15)'
          : '0 2px 8px rgba(0,0,0,0.08)',
      }}
      aria-label="Talk to Joji"
    >
      {/* Mini pixel character */}
      <canvas
        ref={miniCanvasRef}
        width={FW * SPRITE_ZOOM}
        height={FH * SPRITE_ZOOM}
        style={{
          width: FW * SPRITE_ZOOM,
          height: FH * SPRITE_ZOOM,
          imageRendering: 'pixelated',
          display: spriteReady ? 'block' : 'none',
        }}
      />
      {!spriteReady && (
        <MessageCircle size={20} color={hovered ? theme.btnPrimaryText : theme.accent} />
      )}

      <span style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '11px',
        fontWeight: 600,
        letterSpacing: '1.5px',
        textTransform: 'uppercase',
        color: hovered ? theme.btnPrimaryText : theme.textPrimary,
        transition: 'color 0.3s ease',
        whiteSpace: 'nowrap',
      }}>
        Talk to Joji
      </span>
    </button>
  );
};

export default PixelAssistant;
