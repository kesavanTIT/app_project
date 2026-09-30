// ─── FoodRush Design System — Color Tokens ───────────────────────────────────
// Dark Mode Premium + Glassmorphism + Vibrant Accents

export const COLORS = {
  // ── Backgrounds ──────────────────────────────────────────────────────────────
  bg: {
    primary:    '#0D0D0D',   // Deep black base
    secondary:  '#141414',   // Slightly lifted
    card:       '#1A1A1A',   // Card surface
    elevated:   '#212121',   // Modal / bottom sheet
    glass:      'rgba(255,255,255,0.05)',  // Glass surface
    glassBorder:'rgba(255,255,255,0.10)',  // Glass border
    overlay:    'rgba(0,0,0,0.75)',        // Modal overlay
  },

  // ── Brand / Primary (Vibrant Orange — Swiggy inspired) ───────────────────────
  brand: {
    primary:    '#FF5722',   // Hot orange
    light:      '#FF7043',   // Lighter orange
    dark:       '#E64A19',   // Deeper orange
    glow:       'rgba(255,87,34,0.20)',    // Glow shadow
    subtle:     'rgba(255,87,34,0.10)',    // Subtle tint
  },

  // ── Accent (Zomato Red-ish, distinct from primary) ────────────────────────
  accent: {
    yellow:     '#FFD600',   // Gold — ratings, premium
    green:      '#00C853',   // Available / success
    cyan:       '#00E5FF',   // Info highlight
    pink:       '#F50057',   // Trending badge
    purple:     '#7C4DFF',   // Premium / offers
  },

  // ── Text ─────────────────────────────────────────────────────────────────────
  text: {
    primary:    '#FFFFFF',
    secondary:  '#B0B0B0',
    muted:      '#6B6B6B',
    inverse:    '#0D0D0D',
    brand:      '#FF5722',
    success:    '#00C853',
    danger:     '#FF1744',
    warning:    '#FFD600',
  },

  // ── UI Elements ──────────────────────────────────────────────────────────────
  ui: {
    border:     '#2A2A2A',
    divider:    '#1E1E1E',
    input:      '#1C1C1C',
    inputBorder:'#333333',
    skeleton:   '#242424',
    skeletonShimmer: '#2E2E2E',
    tabBar:     '#141414',
    tabBarBorder: '#2A2A2A',
  },

  // ── Status ───────────────────────────────────────────────────────────────────
  status: {
    success:    '#00C853',
    successBg:  'rgba(0,200,83,0.12)',
    danger:     '#FF1744',
    dangerBg:   'rgba(255,23,68,0.12)',
    warning:    '#FFD600',
    warningBg:  'rgba(255,214,0,0.12)',
    info:       '#00E5FF',
    infoBg:     'rgba(0,229,255,0.12)',
  },

  // ── Rating / Stars ────────────────────────────────────────────────────────
  rating:       '#FFD600',
};

export default COLORS;
