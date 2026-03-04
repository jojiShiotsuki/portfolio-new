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

  // Accent
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
  bgPrimary: '#0C0F14',
  bgSecondary: '#15170C',
  bgTertiary: '#293122',
  bgCardHover: '#293122',
  bgOverlay: 'rgba(12, 15, 20, 0.95)',
  bgMobileMenu: 'rgba(12, 15, 20, 0.98)',

  textPrimary: '#F5F3EE',
  textSecondary: 'rgba(245, 243, 238, 0.7)',
  textTertiary: 'rgba(245, 243, 238, 0.55)',
  textMuted: 'rgba(245, 243, 238, 0.35)',

  accent: '#8D9A7C',
  accentLight: '#C3C9A5',
  accentDim: 'rgba(141, 154, 124, 0.2)',
  accentBorder: 'rgba(141, 154, 124, 0.1)',
  accentGlow: 'rgba(141, 154, 124, 0.4)',

  borderPrimary: 'rgba(245, 243, 238, 0.08)',
  borderSecondary: 'rgba(245, 243, 238, 0.05)',
  borderHover: 'rgba(245, 243, 238, 0.2)',

  labelColor: '#8D9A7C',

  btnPrimaryBg: '#8D9A7C',
  btnPrimaryText: '#0C0F14',
  btnPrimaryHoverBg: '#C3C9A5',
  btnSecondaryBg: 'transparent',
  btnSecondaryText: '#F5F3EE',
  btnOutlineBorder: 'rgba(245, 243, 238, 0.3)',
  btnOutlineText: '#F5F3EE',

  bannerBg: '#8D9A7C',
  bannerText: '#0C0F14',
  bannerBadgeBg: '#0C0F14',
  bannerBadgeText: '#8D9A7C',

  chatBg: '#0C0F14',
  chatHeaderBg: '#293122',
  chatInputBg: '#293122',
  chatBotMsgBg: '#293122',
  chatUserMsgBg: '#8D9A7C',
  chatUserMsgText: '#0C0F14',

  headingStroke: '#8D9A7C',
  gridOverlayColor: 'rgba(141, 154, 124, 0.03)',
  scrollbarTrack: '#0C0F14',
  selectionBg: '#8D9A7C',
  selectionText: '#0C0F14',
};

export const lightTheme: ThemeTokens = {
  bgPrimary: '#FFFFFF',
  bgSecondary: '#F5F3EE',
  bgTertiary: '#EBE8E2',
  bgCardHover: '#FFFFFF',
  bgOverlay: 'rgba(245, 243, 238, 0.95)',
  bgMobileMenu: 'rgba(245, 243, 238, 0.98)',

  textPrimary: '#2A2820',
  textSecondary: '#5C5850',
  textTertiary: '#6B6860',
  textMuted: '#9C9890',

  accent: '#5F7161',
  accentLight: '#8D9A7C',
  accentDim: 'rgba(95, 113, 97, 0.15)',
  accentBorder: 'rgba(95, 113, 97, 0.12)',
  accentGlow: 'rgba(95, 113, 97, 0.3)',

  borderPrimary: '#D4D0C8',
  borderSecondary: '#EBE8E2',
  borderHover: '#9C9890',

  labelColor: '#6B6860',

  btnPrimaryBg: '#5F7161',
  btnPrimaryText: '#FFFFFF',
  btnPrimaryHoverBg: '#8D9A7C',
  btnSecondaryBg: 'transparent',
  btnSecondaryText: '#2A2820',
  btnOutlineBorder: '#D4D0C8',
  btnOutlineText: '#2A2820',

  bannerBg: '#5F7161',
  bannerText: '#FFFFFF',
  bannerBadgeBg: '#FFFFFF',
  bannerBadgeText: '#5F7161',

  chatBg: '#FFFFFF',
  chatHeaderBg: '#F5F3EE',
  chatInputBg: '#F5F3EE',
  chatBotMsgBg: '#F5F3EE',
  chatUserMsgBg: '#5F7161',
  chatUserMsgText: '#FFFFFF',

  headingStroke: '#5F7161',
  gridOverlayColor: 'rgba(95, 113, 97, 0.03)',
  scrollbarTrack: '#FFFFFF',
  selectionBg: '#5F7161',
  selectionText: '#FFFFFF',
};
