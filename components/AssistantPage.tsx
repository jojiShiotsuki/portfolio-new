import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../ThemeContext';

// === TYPES ===
type Direction = 0 | 1 | 2 | 3;
const DIR_DOWN: Direction = 0;
const DIR_LEFT: Direction = 1;
const DIR_RIGHT: Direction = 2;
const DIR_UP: Direction = 3;

// === CONSTANTS ===
const TILE = 16;
const ZOOM = 3;
const COLS = 20;
const ROWS = 12;
const CW = COLS * TILE * ZOOM;
const CH = ROWS * TILE * ZOOM;
const WALK_SPEED = 48;
const WALK_FRAME_DUR = 0.15;
const WANDER_PAUSE_MIN = 2;
const WANDER_PAUSE_MAX = 6;

// === SPRITE SHEET ===
const FW = 16;
const FH = 32;
const WALK_COL_MAP = [0, 1, 2, 1];
const STAND_COL = 1;

const DIR_TO_ROW: Record<Direction, number> = {
  [DIR_DOWN]: 0,
  [DIR_UP]: 1,
  [DIR_RIGHT]: 2,
  [DIR_LEFT]: 2,
};

// Caches
const frameCanvasCache = new Map<string, HTMLCanvasElement>();
const silhouetteCache = new Map<string, HTMLCanvasElement>();
const _ = '';

function getFrameCanvas(img: HTMLImageElement, col: number, row: number, flip: boolean, prefix = 'j'): HTMLCanvasElement {
  const key = `${prefix}-f-${row}-${col}-${flip ? 1 : 0}`;
  const cached = frameCanvasCache.get(key);
  if (cached) return cached;

  const c = document.createElement('canvas');
  c.width = FW * ZOOM;
  c.height = FH * ZOOM;
  const ctx = c.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  if (flip) {
    ctx.translate(FW * ZOOM, 0);
    ctx.scale(-1, 1);
  }
  ctx.drawImage(img, col * FW, row * FH, FW, FH, 0, 0, FW * ZOOM, FH * ZOOM);

  frameCanvasCache.set(key, c);
  return c;
}

function getSilhouette(source: HTMLCanvasElement, key: string): HTMLCanvasElement {
  const cached = silhouetteCache.get(key);
  if (cached) return cached;

  const c = document.createElement('canvas');
  c.width = source.width;
  c.height = source.height;
  const ctx = c.getContext('2d')!;
  ctx.drawImage(source, 0, 0);
  ctx.globalCompositeOperation = 'source-in';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, c.width, c.height);

  silhouetteCache.set(key, c);
  return c;
}

function drawCharWithOutline(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  dir: Direction,
  frameIdx: number,
  x: number,
  y: number,
  prefix = 'j',
) {
  const col = WALK_COL_MAP[frameIdx % 4];
  const row = DIR_TO_ROW[dir];
  const flip = dir === DIR_LEFT;
  const frame = getFrameCanvas(img, col, row, flip, prefix);
  const silKey = `${prefix}-s-${row}-${col}-${flip ? 1 : 0}`;
  const silhouette = getSilhouette(frame, silKey);

  ctx.save();
  ctx.globalAlpha = 0.5;
  ctx.drawImage(silhouette, x - ZOOM, y);
  ctx.drawImage(silhouette, x + ZOOM, y);
  ctx.drawImage(silhouette, x, y - ZOOM);
  ctx.drawImage(silhouette, x, y + ZOOM);
  ctx.restore();

  ctx.drawImage(frame, x, y);
}

function drawCharStanding(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  dir: Direction,
  x: number,
  y: number,
  prefix = 'j',
) {
  const row = DIR_TO_ROW[dir];
  const flip = dir === DIR_LEFT;
  const frame = getFrameCanvas(img, STAND_COL, row, flip, prefix);
  const silKey = `${prefix}-s-${row}-${STAND_COL}-${flip ? 1 : 0}`;
  const silhouette = getSilhouette(frame, silKey);

  ctx.save();
  ctx.globalAlpha = 0.5;
  ctx.drawImage(silhouette, x - ZOOM, y);
  ctx.drawImage(silhouette, x + ZOOM, y);
  ctx.drawImage(silhouette, x, y - ZOOM);
  ctx.drawImage(silhouette, x, y + ZOOM);
  ctx.restore();

  ctx.drawImage(frame, x, y);
}

// === FURNITURE SPRITES ===
type SpriteData = string[][];

const PLANT_SPRITE: SpriteData = (() => {
  const G = '#5F7161', D = '#4A5C4C', T = '#6B5540', Pt = '#8B6B4A', Rr = '#6B4E0A';
  return [
    [_,_,_,_,_,_,G,G,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,G,G,G,G,_,_,_,_,_,_,_],
    [_,_,_,_,G,G,D,G,G,G,_,_,_,_,_,_],
    [_,_,_,G,G,D,G,G,D,G,G,_,_,_,_,_],
    [_,_,G,G,G,G,G,G,G,G,G,G,_,_,_,_],
    [_,G,G,D,G,G,G,G,G,G,D,G,G,_,_,_],
    [_,G,G,G,G,D,G,G,D,G,G,G,G,_,_,_],
    [_,_,G,G,G,G,G,G,G,G,G,G,_,_,_,_],
    [_,_,_,G,G,G,D,G,G,G,G,_,_,_,_,_],
    [_,_,_,_,G,G,G,G,G,G,_,_,_,_,_,_],
    [_,_,_,_,_,G,G,G,G,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,T,T,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,T,T,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,T,T,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,Rr,Rr,Rr,Rr,Rr,_,_,_,_,_,_],
    [_,_,_,_,Rr,Pt,Pt,Pt,Pt,Pt,Rr,_,_,_,_,_],
    [_,_,_,_,Rr,Pt,Pt,Pt,Pt,Pt,Rr,_,_,_,_,_],
    [_,_,_,_,Rr,Pt,Pt,Pt,Pt,Pt,Rr,_,_,_,_,_],
    [_,_,_,_,Rr,Pt,Pt,Pt,Pt,Pt,Rr,_,_,_,_,_],
    [_,_,_,_,Rr,Pt,Pt,Pt,Pt,Pt,Rr,_,_,_,_,_],
    [_,_,_,_,Rr,Pt,Pt,Pt,Pt,Pt,Rr,_,_,_,_,_],
    [_,_,_,_,_,Rr,Pt,Pt,Pt,Rr,_,_,_,_,_,_],
    [_,_,_,_,_,_,Rr,Rr,Rr,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  ];
})();

const BOOKSHELF_SPRITE: SpriteData = (() => {
  const W = '#6B5540', D = '#5B4535';
  const R = '#8D9A7C', B = '#5F7161', G = '#C3C9A5', Y = '#9C8860', Pr = '#7A6B55';
  return [
    [_,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_],
    [W,D,D,D,D,D,D,D,D,D,D,D,D,D,D,W],
    [W,D,R,R,B,B,G,G,Y,Y,R,R,B,B,D,W],
    [W,D,R,R,B,B,G,G,Y,Y,R,R,B,B,D,W],
    [W,D,R,R,B,B,G,G,Y,Y,R,R,B,B,D,W],
    [W,D,R,R,B,B,G,G,Y,Y,R,R,B,B,D,W],
    [W,D,R,R,B,B,G,G,Y,Y,R,R,B,B,D,W],
    [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W],
    [W,D,D,D,D,D,D,D,D,D,D,D,D,D,D,W],
    [W,D,Pr,Pr,Y,Y,B,B,G,G,Pr,Pr,R,R,D,W],
    [W,D,Pr,Pr,Y,Y,B,B,G,G,Pr,Pr,R,R,D,W],
    [W,D,Pr,Pr,Y,Y,B,B,G,G,Pr,Pr,R,R,D,W],
    [W,D,Pr,Pr,Y,Y,B,B,G,G,Pr,Pr,R,R,D,W],
    [W,D,Pr,Pr,Y,Y,B,B,G,G,Pr,Pr,R,R,D,W],
    [W,D,Pr,Pr,Y,Y,B,B,G,G,Pr,Pr,R,R,D,W],
    [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W],
    [W,D,D,D,D,D,D,D,D,D,D,D,D,D,D,W],
    [W,D,G,G,R,R,Pr,Pr,B,B,Y,Y,G,G,D,W],
    [W,D,G,G,R,R,Pr,Pr,B,B,Y,Y,G,G,D,W],
    [W,D,G,G,R,R,Pr,Pr,B,B,Y,Y,G,G,D,W],
    [W,D,G,G,R,R,Pr,Pr,B,B,Y,Y,G,G,D,W],
    [W,D,G,G,R,R,Pr,Pr,B,B,Y,Y,G,G,D,W],
    [W,D,G,G,R,R,Pr,Pr,B,B,Y,Y,G,G,D,W],
    [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W],
    [W,D,D,D,D,D,D,D,D,D,D,D,D,D,D,W],
    [W,D,D,D,D,D,D,D,D,D,D,D,D,D,D,W],
    [W,D,D,D,D,D,D,D,D,D,D,D,D,D,D,W],
    [W,D,D,D,D,D,D,D,D,D,D,D,D,D,D,W],
    [W,D,D,D,D,D,D,D,D,D,D,D,D,D,D,W],
    [W,D,D,D,D,D,D,D,D,D,D,D,D,D,D,W],
    [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W],
    [_,W,W,W,W,W,W,W,W,W,W,W,W,W,W,_],
  ];
})();

const LAMP_SPRITE: SpriteData = (() => {
  const Y = '#FFDD55', L = '#FFEE88', D2 = '#888888', B = '#6B5540', G = '#FFFFCC';
  return [
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,G,G,G,G,_,_,_,_,_,_],
    [_,_,_,_,_,G,Y,Y,Y,Y,G,_,_,_,_,_],
    [_,_,_,_,G,Y,Y,L,L,Y,Y,G,_,_,_,_],
    [_,_,_,_,Y,Y,L,L,L,L,Y,Y,_,_,_,_],
    [_,_,_,_,Y,Y,L,L,L,L,Y,Y,_,_,_,_],
    [_,_,_,_,_,Y,Y,Y,Y,Y,Y,_,_,_,_,_],
    [_,_,_,_,_,_,D2,D2,D2,D2,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,D2,D2,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,D2,D2,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,D2,D2,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,D2,D2,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,D2,D2,D2,D2,_,_,_,_,_,_],
    [_,_,_,_,_,B,B,B,B,B,B,_,_,_,_,_],
    [_,_,_,_,_,B,B,B,B,B,B,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  ];
})();

const PC_SPRITE: SpriteData = (() => {
  const F = '#5C5850', SC = '#2A2820', B = '#5F7161', D2 = '#444444';
  return [
    [_,_,_,F,F,F,F,F,F,F,F,F,F,_,_,_],
    [_,_,_,F,SC,SC,SC,SC,SC,SC,SC,SC,F,_,_,_],
    [_,_,_,F,SC,B,B,B,B,B,B,SC,F,_,_,_],
    [_,_,_,F,SC,B,B,B,B,B,B,SC,F,_,_,_],
    [_,_,_,F,SC,B,B,B,B,B,B,SC,F,_,_,_],
    [_,_,_,F,SC,B,B,B,B,B,B,SC,F,_,_,_],
    [_,_,_,F,SC,B,B,B,B,B,B,SC,F,_,_,_],
    [_,_,_,F,SC,B,B,B,B,B,B,SC,F,_,_,_],
    [_,_,_,F,SC,SC,SC,SC,SC,SC,SC,SC,F,_,_,_],
    [_,_,_,F,F,F,F,F,F,F,F,F,F,_,_,_],
    [_,_,_,_,_,_,_,D2,D2,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,D2,D2,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,D2,D2,D2,D2,_,_,_,_,_,_],
    [_,_,_,_,_,D2,D2,D2,D2,D2,D2,_,_,_,_,_],
    [_,_,_,_,_,D2,D2,D2,D2,D2,D2,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  ];
})();

const CHAIR_SPRITE: SpriteData = (() => {
  const W = '#8B6914', D2 = '#6B4E0A', B = '#5C3D0A', SC = '#A07828';
  return [
    [_,_,_,_,_,D2,D2,D2,D2,D2,D2,_,_,_,_,_],
    [_,_,_,_,D2,B,B,B,B,B,B,D2,_,_,_,_],
    [_,_,_,_,D2,B,SC,SC,SC,SC,B,D2,_,_,_,_],
    [_,_,_,_,D2,B,SC,SC,SC,SC,B,D2,_,_,_,_],
    [_,_,_,_,D2,B,SC,SC,SC,SC,B,D2,_,_,_,_],
    [_,_,_,_,D2,B,SC,SC,SC,SC,B,D2,_,_,_,_],
    [_,_,_,_,D2,B,SC,SC,SC,SC,B,D2,_,_,_,_],
    [_,_,_,_,D2,B,SC,SC,SC,SC,B,D2,_,_,_,_],
    [_,_,_,_,D2,B,SC,SC,SC,SC,B,D2,_,_,_,_],
    [_,_,_,_,D2,B,B,B,B,B,B,D2,_,_,_,_],
    [_,_,_,_,_,D2,D2,D2,D2,D2,D2,_,_,_,_,_],
    [_,_,_,_,_,_,D2,W,W,D2,_,_,_,_,_,_],
    [_,_,_,_,_,_,D2,W,W,D2,_,_,_,_,_,_],
    [_,_,_,_,_,D2,D2,D2,D2,D2,D2,_,_,_,_,_],
    [_,_,_,_,_,D2,_,_,_,_,D2,_,_,_,_,_],
    [_,_,_,_,_,D2,_,_,_,_,D2,_,_,_,_,_],
  ];
})();

const COFFEE_TABLE_SPRITE: SpriteData = (() => {
  const W = '#6B5540', D = '#5B4535', T = '#8B6B4A';
  return [
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,W,W,W,W,W,W,W,W,W,W,W,W,_,_],
    [_,_,W,T,T,T,T,T,T,T,T,T,T,W,_,_],
    [_,_,W,T,T,T,T,T,T,T,T,T,T,W,_,_],
    [_,_,W,T,T,T,T,T,T,T,T,T,T,W,_,_],
    [_,_,W,W,W,W,W,W,W,W,W,W,W,W,_,_],
    [_,_,_,D,_,_,_,_,_,_,_,_,D,_,_,_],
    [_,_,_,D,_,_,_,_,_,_,_,_,D,_,_,_],
    [_,_,_,D,_,_,_,_,_,_,_,_,D,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  ];
})();

const SOFA_SPRITE: SpriteData = (() => {
  const F = '#7A6B55', D = '#5B4535', C = '#8D9A7C', Cl = '#A0AD8E';
  return [
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,F,F,F,F,F,F,F,F,F,F,F,F,_,_],
    [_,F,F,D,D,D,D,D,D,D,D,D,D,F,F,_],
    [_,F,D,C,C,C,C,C,C,C,C,C,C,D,F,_],
    [_,F,D,C,Cl,Cl,C,C,C,Cl,Cl,C,D,F,_],
    [_,F,D,C,Cl,Cl,C,C,C,Cl,Cl,C,D,F,_],
    [_,F,D,C,C,C,C,C,C,C,C,C,C,D,F,_],
    [_,F,D,C,C,C,C,C,C,C,C,C,C,D,F,_],
    [_,F,D,C,C,C,C,C,C,C,C,C,C,D,F,_],
    [_,F,D,C,Cl,Cl,C,C,C,Cl,Cl,C,D,F,_],
    [_,F,D,C,Cl,Cl,C,C,C,Cl,Cl,C,D,F,_],
    [_,F,D,C,C,C,C,C,C,C,C,C,C,D,F,_],
    [_,F,F,D,D,D,D,D,D,D,D,D,D,F,F,_],
    [_,_,F,F,F,F,F,F,F,F,F,F,F,F,_,_],
    [_,_,_,F,_,_,_,_,_,_,_,_,F,_,_,_],
    [_,_,_,F,_,_,_,_,_,_,_,_,F,_,_,_],
  ];
})();

// === SPRITE CACHE (for furniture only) ===
const spriteCanvasCache = new Map<SpriteData, HTMLCanvasElement>();

function getCachedSprite(sprite: SpriteData, zoom: number): HTMLCanvasElement {
  const cached = spriteCanvasCache.get(sprite);
  if (cached) return cached;
  const rows = sprite.length;
  const cols = sprite[0]?.length || 0;
  const c = document.createElement('canvas');
  c.width = cols * zoom;
  c.height = rows * zoom;
  const ctx = c.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;
  for (let r = 0; r < rows; r++) {
    for (let col = 0; col < cols; col++) {
      const color = sprite[r][col];
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect(col * zoom, r * zoom, zoom, zoom);
    }
  }
  spriteCanvasCache.set(sprite, c);
  return c;
}

// === ROOM ===
// Legend: W=wall, .=floor, R=rug (walkable)
// Furniture is placed explicitly by position, not by tile char
const ROOM = [
  'WWWWWWWWWWWWWWWWWWWW',
  'W..................W',
  'W..................W',
  'W..................W',
  'W..................W',
  'W.....RRRR.........W',
  'W.....RRRR.........W',
  'W.....RRRR.........W',
  'W..................W',
  'W..................W',
  'W..................W',
  'WWWWWW......WWWWWWWW',
];

const WALL_CLR = '#4A5C4C';
const WALL_EDGE = '#3A4A3C';
const FLOOR_CLR = '#F5F3EE';
const FLOOR_GRID = 'rgba(95, 113, 97, 0.06)';
const RUG_CLR = '#C3C9A5';
const RUG_EDGE = '#B0B896';
const WINDOW_CLR = '#A8C8D8';
const WINDOW_FRAME = '#5C6B5E';

// Explicit furniture placements: { sprite, col, row }
// col/row = tile position where the furniture sits
const FURNITURE_PLACEMENTS: { sprite: SpriteData; col: number; row: number; offsetY?: number }[] = [
  // Left desk area (against top wall)
  { sprite: PC_SPRITE, col: 2, row: 1, offsetY: -2 },
  { sprite: CHAIR_SPRITE, col: 2, row: 2 },
  // Right desk area
  { sprite: PC_SPRITE, col: 14, row: 1, offsetY: -2 },
  { sprite: CHAIR_SPRITE, col: 14, row: 2 },
  // Bookshelves along right wall
  { sprite: BOOKSHELF_SPRITE, col: 17, row: 1 },
  { sprite: BOOKSHELF_SPRITE, col: 18, row: 1 },
  // Center meeting area (on the rug)
  { sprite: SOFA_SPRITE, col: 5, row: 5 },       // sofa on left side
  { sprite: COFFEE_TABLE_SPRITE, col: 7, row: 6 }, // table in center
  { sprite: CHAIR_SPRITE, col: 9, row: 5 },       // chair facing sofa (top)
  { sprite: CHAIR_SPRITE, col: 9, row: 7 },       // chair facing sofa (bottom)
  // Plants scattered
  { sprite: PLANT_SPRITE, col: 10, row: 1 },
  { sprite: PLANT_SPRITE, col: 1, row: 9 },
  { sprite: PLANT_SPRITE, col: 18, row: 8 },
  { sprite: PLANT_SPRITE, col: 5, row: 9 },
  // Lamps
  { sprite: LAMP_SPRITE, col: 1, row: 1 },
  { sprite: LAMP_SPRITE, col: 18, row: 4 },
  { sprite: LAMP_SPRITE, col: 11, row: 10 },
  // Extra bookshelf on left wall area
  { sprite: BOOKSHELF_SPRITE, col: 1, row: 4 },
];

function isWalkable(col: number, row: number): boolean {
  if (col < 0 || col >= COLS || row < 0 || row >= ROWS) return false;
  const tile = ROOM[row]?.[col];
  if (tile === 'W') return false;
  // Block tiles occupied by furniture
  for (const f of FURNITURE_PLACEMENTS) {
    if (f.col === col && f.row === row) return false;
  }
  return true;
}

interface FurnInst { sprite: SpriteData; x: number; y: number; zY: number; }

function renderRoom(): { bg: HTMLCanvasElement; furniture: FurnInst[] } {
  const c = document.createElement('canvas');
  c.width = CW; c.height = CH;
  const ctx = c.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;
  const furn: FurnInst[] = [];
  const sz = TILE * ZOOM;

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const tile = ROOM[row][col];
      const x = col * sz, y = row * sz;

      if (tile === 'W') {
        ctx.fillStyle = WALL_CLR;
        ctx.fillRect(x, y, sz, sz);
        ctx.fillStyle = WALL_EDGE;
        ctx.fillRect(x, y + sz - ZOOM, sz, ZOOM);
        // Windows on top wall
        if (row === 0 && ((col >= 4 && col <= 6) || (col >= 8 && col <= 10) || (col >= 12 && col <= 14))) {
          ctx.fillStyle = WINDOW_CLR;
          const wx = x + 4, wy = y + 6, ww = sz - 8, wh = sz - 10;
          ctx.fillRect(wx, wy, ww, wh);
          ctx.fillStyle = WINDOW_FRAME;
          ctx.fillRect(x + sz / 2 - 1, wy, 2, wh);
          ctx.fillRect(wx, y + sz / 2 - 1, ww, 2);
        }
      } else if (tile === 'R') {
        ctx.fillStyle = FLOOR_CLR;
        ctx.fillRect(x, y, sz, sz);
        ctx.fillStyle = RUG_CLR;
        ctx.fillRect(x, y, sz, sz);
        ctx.fillStyle = RUG_EDGE;
        const l = col > 0 && ROOM[row][col - 1] === 'R';
        const r = col < COLS - 1 && ROOM[row][col + 1] === 'R';
        const t = row > 0 && ROOM[row - 1]?.[col] === 'R';
        const b = row < ROWS - 1 && ROOM[row + 1]?.[col] === 'R';
        if (!l) ctx.fillRect(x, y, ZOOM, sz);
        if (!r) ctx.fillRect(x + sz - ZOOM, y, ZOOM, sz);
        if (!t) ctx.fillRect(x, y, sz, ZOOM);
        if (!b) ctx.fillRect(x, y + sz - ZOOM, sz, ZOOM);
      } else {
        ctx.fillStyle = FLOOR_CLR;
        ctx.fillRect(x, y, sz, sz);
      }

      if (tile !== 'W') {
        ctx.fillStyle = FLOOR_GRID;
        ctx.fillRect(x + sz - 1, y, 1, sz);
        ctx.fillRect(x, y + sz - 1, sz, 1);
      }
    }
  }

  // Place furniture from explicit list
  for (const f of FURNITURE_PLACEMENTS) {
    const x = f.col * sz;
    const y = f.row * sz + (f.offsetY ?? 0);
    furn.push({ sprite: f.sprite, x, y, zY: f.row * sz + sz });
  }

  return { bg: c, furniture: furn };
}

// === CHAT ===
const WORKER_URL = 'https://claude-proxy.joji-dev.workers.dev';
interface Message { role: 'user' | 'assistant'; content: string; }

const WAYPOINTS = [
  { col: 5, row: 3 }, { col: 9, row: 2 }, { col: 13, row: 3 },
  { col: 6, row: 6 }, { col: 7, row: 6 }, { col: 4, row: 4 },
  { col: 15, row: 4 }, { col: 9, row: 8 }, { col: 13, row: 8 },
  { col: 7, row: 10 }, { col: 16, row: 7 }, { col: 3, row: 8 },
  { col: 10, row: 10 }, { col: 15, row: 9 }, { col: 11, row: 5 },
  { col: 4, row: 9 }, { col: 17, row: 3 }, { col: 8, row: 4 },
];

// === PAGE COMPONENT ===
const AssistantPage: React.FC = () => {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const roomDataRef = useRef<{ bg: HTMLCanvasElement; furniture: FurnInst[] } | null>(null);
  const animRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const accentRef = useRef(theme.accent);
  const spriteImgRef = useRef<HTMLImageElement | null>(null);
  const spriteLoadedRef = useRef(false);
  // Visitor sprite (appears when user chats)
  const visitorImgRef = useRef<HTMLImageElement | null>(null);
  const visitorLoadedRef = useRef(false);
  useEffect(() => { accentRef.current = theme.accent; }, [theme.accent]);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      spriteImgRef.current = img;
      spriteLoadedRef.current = true;
    };
    img.src = '/sprites/char_4.png';

    const visitorImg = new Image();
    visitorImg.onload = () => {
      visitorImgRef.current = visitorImg;
      visitorLoadedRef.current = true;
    };
    visitorImg.src = '/sprites/char_0.png';
  }, []);

  const charRef = useRef({
    x: 9 * TILE, y: 6 * TILE - 8,
    targetX: 9 * TILE, targetY: 6 * TILE - 8,
    dir: DIR_DOWN as Direction,
    moving: false,
    frame: 0, frameTimer: 0,
    idleTimer: 0, idleDelay: 2 + Math.random() * 3,
  });

  // Visitor character — spawns at door (bottom opening), walks to meeting area
  const visitorRef = useRef({
    x: 8 * TILE, y: 11 * TILE - 8,       // start at bottom door
    targetX: 10 * TILE, targetY: 6 * TILE - 8, // walk to chair near meeting area
    dir: DIR_UP as Direction,
    visible: false,
    moving: false,
    arrived: false,
    frame: 0, frameTimer: 0,
  });

  // Speech bubble state (rendered on canvas, driven by ref for perf)
  const bubbleRef = useRef({ text: '', timer: 0 });
  const visitorBubbleRef = useRef({ text: '', timer: 0 });
  const BUBBLE_DURATION = 5; // seconds to show bubble

  // Chat mode: idle (Joji wanders), approaching (walking to meet), talking (standing face-to-face)
  const chatModeRef = useRef<'idle' | 'approaching' | 'talking'>('idle');
  // Helper to read chatModeRef.current without TypeScript narrowing
  // (the ref is mutated by the animation loop across await boundaries)
  const getChatMode = () => chatModeRef.current;
  const chatIdleTimerRef = useRef(0);
  const CHAT_IDLE_TIMEOUT = 10; // seconds before Joji wanders again
  const pendingReplyRef = useRef<string | null>(null);

  // Meeting positions
  const JOJI_MEET = { x: 7 * TILE, y: 6 * TILE - 8 };
  const VISITOR_MEET = { x: 9 * TILE, y: 6 * TILE - 8 };

  const [chatOpen, setChatOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "G'day! I'm Joji's assistant. What kind of trade are you in and where are you based?" }
  ]);
  const [input, setInput] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const isLoadingRef = useRef(false);
  useEffect(() => { isLoadingRef.current = isLoading; }, [isLoading]);
  useEffect(() => {
    const el = chatContainerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  // Show visitor bubble immediately on user message; assistant bubble handled by animate loop
  const prevMsgCountRef = useRef(messages.length);
  useEffect(() => {
    if (messages.length > prevMsgCountRef.current) {
      const last = messages[messages.length - 1];
      const maxLen = 60;
      const text = last.content.length > maxLen
        ? last.content.slice(0, maxLen - 3) + '...'
        : last.content;
      if (last.role === 'user') {
        visitorBubbleRef.current = { text, timer: BUBBLE_DURATION };
      } else if (last.role === 'assistant') {
        bubbleRef.current = { text, timer: BUBBLE_DURATION };
      }
    }
    prevMsgCountRef.current = messages.length;
  }, [messages]);

  const pickTarget = useCallback(() => {
    const ch = charRef.current;
    const wp = WAYPOINTS[Math.floor(Math.random() * WAYPOINTS.length)];
    ch.targetX = wp.col * TILE;
    ch.targetY = wp.row * TILE - 8;
    ch.moving = true;
    ch.idleTimer = 0;
    ch.idleDelay = WANDER_PAUSE_MIN + Math.random() * (WANDER_PAUSE_MAX - WANDER_PAUSE_MIN);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;
    if (!roomDataRef.current) roomDataRef.current = renderRoom();

    const animate = (time: number) => {
      if (lastTimeRef.current === 0) lastTimeRef.current = time;
      const dt = Math.min((time - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = time;
      const ch = charRef.current;

      const mode = chatModeRef.current;

      if (ch.moving) {
        const dx = ch.targetX - ch.x, dy = ch.targetY - ch.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 1) {
          ch.x = ch.targetX; ch.y = ch.targetY;
          ch.moving = false; ch.frame = 0;
        } else {
          const step = WALK_SPEED * dt;
          if (Math.abs(dx) > 1) {
            ch.x += Math.min(Math.abs(dx), step) * Math.sign(dx);
            ch.dir = dx > 0 ? DIR_RIGHT : DIR_LEFT;
          } else if (Math.abs(dy) > 1) {
            ch.y += Math.min(Math.abs(dy), step) * Math.sign(dy);
            ch.dir = dy > 0 ? DIR_DOWN : DIR_UP;
          } else {
            ch.x = ch.targetX; ch.y = ch.targetY;
            ch.moving = false; ch.frame = 0;
          }
          if (ch.moving) {
            ch.frameTimer += dt;
            if (ch.frameTimer > WALK_FRAME_DUR) {
              ch.frame = (ch.frame + 1) % 4;
              ch.frameTimer = 0;
            }
          }
        }
      } else if (mode === 'idle') {
        // Only wander when not in conversation
        ch.idleTimer += dt;
        if (ch.idleTimer > ch.idleDelay) { pickTarget(); }
      }

      // === VISITOR MOVEMENT ===
      const vis = visitorRef.current;
      if (vis.visible && vis.moving) {
        const vdx = vis.targetX - vis.x, vdy = vis.targetY - vis.y;
        const vdist = Math.sqrt(vdx * vdx + vdy * vdy);
        if (vdist < 1) {
          vis.x = vis.targetX; vis.y = vis.targetY;
          vis.moving = false; vis.arrived = true; vis.frame = 0;
          vis.dir = DIR_LEFT; // face Joji after arriving
        } else {
          const vstep = WALK_SPEED * dt;
          if (Math.abs(vdy) > 1) {
            vis.y += Math.min(Math.abs(vdy), vstep) * Math.sign(vdy);
            vis.dir = vdy > 0 ? DIR_DOWN : DIR_UP;
          } else if (Math.abs(vdx) > 1) {
            vis.x += Math.min(Math.abs(vdx), vstep) * Math.sign(vdx);
            vis.dir = vdx > 0 ? DIR_RIGHT : DIR_LEFT;
          } else {
            vis.x = vis.targetX; vis.y = vis.targetY;
            vis.moving = false; vis.arrived = true; vis.frame = 0;
            vis.dir = DIR_LEFT;
          }
          if (vis.moving) {
            vis.frameTimer += dt;
            if (vis.frameTimer > WALK_FRAME_DUR) {
              vis.frame = (vis.frame + 1) % 4;
              vis.frameTimer = 0;
            }
          }
        }
      }

      // === CHAT MODE LOGIC ===
      if (mode === 'approaching') {
        const jojiArrived = !ch.moving;
        const visArrived = !vis.moving;
        if (jojiArrived && visArrived) {
          // Face each other
          ch.dir = DIR_RIGHT;
          vis.dir = DIR_LEFT;
          chatModeRef.current = 'talking';
          chatIdleTimerRef.current = 0;
          // Show pending reply now
          if (pendingReplyRef.current) {
            const reply = pendingReplyRef.current;
            pendingReplyRef.current = null;
            setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
            setIsLoading(false);
          }
        }
      } else if (mode === 'talking') {
        // Face each other while talking
        if (!ch.moving) ch.dir = DIR_RIGHT;
        if (!vis.moving) vis.dir = DIR_LEFT;
        // Count idle time
        chatIdleTimerRef.current += dt;
        if (chatIdleTimerRef.current > CHAT_IDLE_TIMEOUT) {
          chatModeRef.current = 'idle';
          ch.idleTimer = 0;
          ch.idleDelay = 1 + Math.random() * 2;
        }
      }

      // === RENDER ===
      ctx.clearRect(0, 0, CW, CH);
      const roomData = roomDataRef.current!;
      ctx.drawImage(roomData.bg, 0, 0);

      const renderables: { zY: number; draw: () => void }[] = [];

      for (const f of roomData.furniture) {
        renderables.push({
          zY: f.zY,
          draw: () => { ctx.drawImage(getCachedSprite(f.sprite, ZOOM), f.x, f.y); }
        });
      }

      const charPx = Math.round(ch.x) * ZOOM;
      const charPy = Math.round(ch.y) * ZOOM;
      const charZY = charPy + FH * ZOOM;

      const img = spriteImgRef.current;
      if (img && spriteLoadedRef.current) {
        renderables.push({
          zY: charZY,
          draw: () => {
            ctx.fillStyle = 'rgba(0,0,0,0.12)';
            ctx.beginPath();
            ctx.ellipse(charPx + 8 * ZOOM, charPy + 29 * ZOOM, 5 * ZOOM, 2 * ZOOM, 0, 0, Math.PI * 2);
            ctx.fill();

            if (ch.moving) {
              drawCharWithOutline(ctx, img, ch.dir, ch.frame, charPx, charPy);
            } else {
              drawCharStanding(ctx, img, ch.dir, charPx, charPy);
            }
          }
        });
      }

      // Visitor character
      const visImg = visitorImgRef.current;
      if (vis.visible && visImg && visitorLoadedRef.current) {
        const visPx = Math.round(vis.x) * ZOOM;
        const visPy = Math.round(vis.y) * ZOOM;
        const visZY = visPy + FH * ZOOM;

        renderables.push({
          zY: visZY,
          draw: () => {
            ctx.fillStyle = 'rgba(0,0,0,0.12)';
            ctx.beginPath();
            ctx.ellipse(visPx + 8 * ZOOM, visPy + 29 * ZOOM, 5 * ZOOM, 2 * ZOOM, 0, 0, Math.PI * 2);
            ctx.fill();

            if (vis.moving) {
              drawCharWithOutline(ctx, visImg, vis.dir, vis.frame, visPx, visPy, 'v');
            } else {
              drawCharStanding(ctx, visImg, vis.dir, visPx, visPy, 'v');
            }
          }
        });
      }

      renderables.sort((a, b) => a.zY - b.zY);
      for (const r of renderables) r.draw();

      // Draw speech bubble helper
      const drawBubble = (bub: { text: string; timer: number }, cx: number, cy: number) => {
        if (bub.timer <= 0) return;
        bub.timer -= dt;

        const bCenterX = cx + (FW * ZOOM) / 2;
        const bTopY = cy - 12;

        ctx.font = `bold ${ZOOM * 4}px 'JetBrains Mono', monospace`;
        const words = bub.text.split(' ');
        const maxLineW = 140;
        const lines: string[] = [];
        let currentLine = '';
        for (const word of words) {
          const testLine = currentLine ? currentLine + ' ' + word : word;
          if (ctx.measureText(testLine).width > maxLineW) {
            if (currentLine) lines.push(currentLine);
            currentLine = word;
          } else {
            currentLine = testLine;
          }
        }
        if (currentLine) lines.push(currentLine);

        const lineH = ZOOM * 5;
        const padX = 8, padY = 6;
        const bubbleW = Math.min(maxLineW + padX * 2, Math.max(...lines.map(l => ctx.measureText(l).width)) + padX * 2);
        const bubbleH = lines.length * lineH + padY * 2;
        const bubbleX = bCenterX - bubbleW / 2;
        const bubbleY = bTopY - bubbleH - 6;

        const alpha = bub.timer < 1 ? bub.timer : 1;
        ctx.save();
        ctx.globalAlpha = alpha;

        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(bubbleX, bubbleY, bubbleW, bubbleH);
        ctx.strokeStyle = '#4A5C4C';
        ctx.lineWidth = 1;
        ctx.strokeRect(bubbleX, bubbleY, bubbleW, bubbleH);

        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.moveTo(bCenterX - 4, bubbleY + bubbleH);
        ctx.lineTo(bCenterX, bubbleY + bubbleH + 6);
        ctx.lineTo(bCenterX + 4, bubbleY + bubbleH);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(bCenterX - 4, bubbleY + bubbleH);
        ctx.lineTo(bCenterX, bubbleY + bubbleH + 6);
        ctx.lineTo(bCenterX + 4, bubbleY + bubbleH);
        ctx.strokeStyle = '#4A5C4C';
        ctx.stroke();
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(bCenterX - 5, bubbleY + bubbleH - 1, 10, 2);

        ctx.fillStyle = '#1A1A1A';
        ctx.textBaseline = 'top';
        for (let i = 0; i < lines.length; i++) {
          ctx.fillText(lines[i], bubbleX + padX, bubbleY + padY + i * lineH);
        }

        ctx.restore();
      };

      // Joji's bubble (assistant replies)
      drawBubble(bubbleRef.current, charPx, charPy);

      // Visitor's bubble (user messages)
      if (vis.visible) {
        const visPx = Math.round(vis.x) * ZOOM;
        const visPy = Math.round(vis.y) * ZOOM;
        drawBubble(visitorBubbleRef.current, visPx, visPy);
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(animRef.current);
      frameCanvasCache.clear();
      silhouetteCache.clear();
      spriteCanvasCache.clear();
    };
  }, [pickTarget]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const vis = visitorRef.current;
    if (!vis.visible || chatModeRef.current === 'approaching') return;

    const rect = e.currentTarget.getBoundingClientRect();
    const scaleX = CW / rect.width;
    const scaleY = CH / rect.height;
    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top) * scaleY;

    const col = Math.floor(mx / (TILE * ZOOM)), row = Math.floor(my / (TILE * ZOOM));
    if (isWalkable(col, row)) {
      vis.targetX = col * TILE; vis.targetY = row * TILE - 8;
      vis.moving = true; vis.arrived = false; vis.frame = 0;
      chatIdleTimerRef.current = 0; // reset idle so Joji stays
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const msg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setIsLoading(true);

    // Spawn visitor on first message
    const vis = visitorRef.current;
    if (!vis.visible) {
      vis.visible = true;
    }

    // Send both characters to meeting positions
    const ch = charRef.current;
    ch.targetX = JOJI_MEET.x; ch.targetY = JOJI_MEET.y;
    ch.moving = true; ch.frame = 0;
    vis.targetX = VISITOR_MEET.x; vis.targetY = VISITOR_MEET.y;
    vis.moving = true; vis.arrived = false; vis.frame = 0;
    chatModeRef.current = 'approaching';
    chatIdleTimerRef.current = 0;

    // Fire API immediately, but queue the reply
    try {
      const res = await fetch(WORKER_URL, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, history: messages.slice(-10) }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      // If characters already met, show immediately; otherwise queue
      // chatModeRef.current may have been mutated to 'talking' by the animation loop during the await
      if (getChatMode() === 'talking') {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
        setIsLoading(false);
      } else {
        pendingReplyRef.current = data.reply;
      }
    } catch {
      const fallback = "Sorry, having trouble connecting. Try emailing jojishiotsuki0@gmail.com instead!";
      if (getChatMode() === 'talking') {
        setMessages(prev => [...prev, { role: 'assistant', content: fallback }]);
        setIsLoading(false);
      } else {
        pendingReplyRef.current = fallback;
      }
    }
  };

  return (
    <div style={{ minHeight: '100vh', paddingTop: '120px', paddingBottom: '100px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 48px' }}>

        {/* Back link */}
        <Link
          to="/"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '12px',
            color: theme.textSecondary,
            textDecoration: 'none',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '40px',
            transition: 'color 0.3s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = theme.accent; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = theme.textSecondary; }}
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        {/* Side-by-side layout: chat left, room right */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '380px 1fr',
          gap: '24px',
          alignItems: 'start',
        }} className="talk-layout">

          {/* Chat panel (left) */}
          <div style={{
            border: `1px solid ${theme.borderPrimary}`,
            background: theme.bgPrimary,
            display: 'flex',
            flexDirection: 'column',
            height: 'calc(100vh - 200px)',
            maxHeight: '600px',
            position: 'sticky',
            top: '120px',
            overflow: 'hidden',
          }}>
            <div style={{
              padding: '14px 20px',
              borderBottom: `1px solid ${theme.borderPrimary}`,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div>
                <div style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontSize: '18px',
                  fontWeight: 800,
                  color: theme.textPrimary,
                  lineHeight: 1.2,
                }}>Talk to Joji</div>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: '10px',
                  color: theme.accent, letterSpacing: '2px', textTransform: 'uppercase',
                  marginTop: '4px',
                }}>AI Assistant</div>
              </div>
            </div>

            <div
              ref={chatContainerRef}
              style={{
                flex: 1, overflowY: 'auto', padding: '16px',
                display: 'flex', flexDirection: 'column', gap: '10px',
                minHeight: 0,
              }}
            >
              {messages.map((m, i) => (
                <div key={i} style={{
                  maxWidth: '85%', padding: '10px 14px',
                  background: m.role === 'user' ? theme.accent : theme.bgSecondary,
                  color: m.role === 'user' ? theme.btnPrimaryText : theme.textPrimary,
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                  fontFamily: "'Instrument Sans', sans-serif", fontSize: '14px', lineHeight: 1.6,
                  borderRadius: m.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                }}>{m.content}</div>
              ))}
              {isLoading && (
                <div style={{
                  padding: '10px 14px', background: theme.bgSecondary, alignSelf: 'flex-start',
                  fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: theme.textMuted,
                  borderRadius: '12px 12px 12px 2px',
                }}><span className="typing-dots">...</span></div>
              )}
            </div>

            <div style={{
              padding: '12px 16px', borderTop: `1px solid ${theme.borderPrimary}`,
              display: 'flex', gap: '8px',
            }}>
              <input
                type="text" value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder="Type a message..."
                style={{
                  flex: 1, background: theme.bgSecondary,
                  border: `1px solid ${theme.borderPrimary}`,
                  padding: '10px 14px', color: theme.textPrimary,
                  fontSize: '14px', fontFamily: "'Instrument Sans', sans-serif", outline: 'none',
                }}
                disabled={isLoading}
              />
              <button onClick={sendMessage} disabled={isLoading} style={{
                width: '40px', height: '40px', background: theme.accent,
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: isLoading ? 0.5 : 1,
              }}><Send size={16} color={theme.btnPrimaryText} /></button>
            </div>
          </div>

          {/* Pixel room (right, bigger) */}
          <div>
            <div style={{
              border: `1px solid ${theme.borderPrimary}`,
            }}>
              <canvas
                ref={canvasRef} width={CW} height={CH}
                onClick={handleCanvasClick}
                style={{
                  width: '100%', height: 'auto', imageRendering: 'pixelated',
                  cursor: 'pointer', display: 'block',
                }}
              />
            </div>
            <p style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '11px',
              color: theme.textMuted,
              letterSpacing: '1px',
              marginTop: '12px',
              textAlign: 'center',
            }}>
              Send a message to enter the room — click to move around
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AssistantPage;
