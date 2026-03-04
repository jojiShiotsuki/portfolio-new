export interface ThemeTokens {
  // Backgrounds
  bgPrimary: string;
  bgSecondary: string;
  bgTertiary: string;
  bgCardHover: string;
  bgOverlay: string;
  bgMobileMenu: string;

  // Text
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textMuted: string;

  // Accent (same both modes)
  accent: string;
  accentLight: string;
  accentDim: string;
  accentBorder: string;
  accentGlow: string;

  // Borders
  borderPrimary: string;
  borderSecondary: string;
  borderHover: string;

  // Labels
  labelColor: string;

  // Buttons
  btnPrimaryBg: string;
  btnPrimaryText: string;
  btnPrimaryHoverBg: string;
  btnSecondaryBg: string;
  btnSecondaryText: string;
  btnOutlineBorder: string;
  btnOutlineText: string;

  // Banner
  bannerBg: string;
  bannerText: string;
  bannerBadgeBg: string;
  bannerBadgeText: string;

  // Chat
  chatBg: string;
  chatHeaderBg: string;
  chatInputBg: string;
  chatBotMsgBg: string;
  chatUserMsgBg: string;
  chatUserMsgText: string;

  // Special
  headingStroke: string;
  gridOverlayColor: string;
  scrollbarTrack: string;
  selectionBg: string;
  selectionText: string;
}

export const darkTheme: ThemeTokens = {
  bgPrimary: '#0F1A2E',
  bgSecondary: '#132238',
  bgTertiary: '#1B2A4A',
  bgCardHover: '#1B2A4A',
  bgOverlay: 'rgba(15, 26, 46, 0.95)',
  bgMobileMenu: 'rgba(15, 26, 46, 0.98)',

  textPrimary: '#F7F7F5',
  textSecondary: 'rgba(247, 247, 245, 0.5)',
  textTertiary: 'rgba(247, 247, 245, 0.4)',
  textMuted: 'rgba(247, 247, 245, 0.2)',

  accent: '#E8A317',
  accentLight: '#F5B731',
  accentDim: 'rgba(232, 163, 23, 0.2)',
  accentBorder: 'rgba(232, 163, 23, 0.1)',
  accentGlow: 'rgba(232, 163, 23, 0.4)',

  borderPrimary: 'rgba(247, 247, 245, 0.08)',
  borderSecondary: 'rgba(247, 247, 245, 0.05)',
  borderHover: 'rgba(247, 247, 245, 0.2)',

  labelColor: '#E8A317',

  btnPrimaryBg: '#E8A317',
  btnPrimaryText: '#0F1A2E',
  btnPrimaryHoverBg: '#F5B731',
  btnSecondaryBg: 'transparent',
  btnSecondaryText: '#F7F7F5',
  btnOutlineBorder: 'rgba(247, 247, 245, 0.3)',
  btnOutlineText: '#F7F7F5',

  bannerBg: '#E8A317',
  bannerText: '#0F1A2E',
  bannerBadgeBg: '#0F1A2E',
  bannerBadgeText: '#E8A317',

  chatBg: '#0F1A2E',
  chatHeaderBg: '#1B2A4A',
  chatInputBg: '#1B2A4A',
  chatBotMsgBg: '#1B2A4A',
  chatUserMsgBg: '#E8A317',
  chatUserMsgText: '#0F1A2E',

  headingStroke: '#E8A317',
  gridOverlayColor: 'rgba(232, 163, 23, 0.03)',
  scrollbarTrack: '#0F1A2E',
  selectionBg: '#E8A317',
  selectionText: '#0F1A2E',
};

export const lightTheme: ThemeTokens = {
  bgPrimary: '#FFFFFF',
  bgSecondary: '#F7F7F5',
  bgTertiary: '#EDEDEB',
  bgCardHover: '#FFFFFF',
  bgOverlay: 'rgba(255, 255, 255, 0.95)',
  bgMobileMenu: 'rgba(255, 255, 255, 0.98)',

  textPrimary: '#2A2A28',
  textSecondary: '#4D4D48',
  textTertiary: '#686863',
  textMuted: '#A0A09B',

  accent: '#E8A317',
  accentLight: '#F5B731',
  accentDim: 'rgba(232, 163, 23, 0.2)',
  accentBorder: 'rgba(232, 163, 23, 0.15)',
  accentGlow: 'rgba(232, 163, 23, 0.3)',

  borderPrimary: '#D4D4D0',
  borderSecondary: '#EDEDEB',
  borderHover: '#9C9C97',

  labelColor: '#686863',

  btnPrimaryBg: '#E8A317',
  btnPrimaryText: '#FFFFFF',
  btnPrimaryHoverBg: '#F5B731',
  btnSecondaryBg: 'transparent',
  btnSecondaryText: '#2A2A28',
  btnOutlineBorder: '#D4D4D0',
  btnOutlineText: '#2A2A28',

  bannerBg: '#E8A317',
  bannerText: '#FFFFFF',
  bannerBadgeBg: '#FFFFFF',
  bannerBadgeText: '#E8A317',

  chatBg: '#FFFFFF',
  chatHeaderBg: '#F7F7F5',
  chatInputBg: '#F7F7F5',
  chatBotMsgBg: '#F7F7F5',
  chatUserMsgBg: '#E8A317',
  chatUserMsgText: '#FFFFFF',

  headingStroke: '#E8A317',
  gridOverlayColor: 'rgba(232, 163, 23, 0.03)',
  scrollbarTrack: '#FFFFFF',
  selectionBg: '#E8A317',
  selectionText: '#FFFFFF',
};
