// ─── FoodRush — Typography System ────────────────────────────────────────────

export const FONTS = {
  black:        'Inter_900Black',
  bold:         'Inter_700Bold',
  semiBold:     'Inter_600SemiBold',
  medium:       'Inter_500Medium',
  regular:      'Inter_400Regular',
  light:        'Inter_300Light',
};

export const FONT_SIZES = {
  xs:   10,
  sm:   12,
  md:   14,
  base: 16,
  lg:   18,
  xl:   20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 32,
  '5xl': 40,
  '6xl': 48,
};

export const LINE_HEIGHTS = {
  tight:  1.2,
  normal: 1.5,
  relaxed: 1.75,
};

// ─── Preset Text Styles ───────────────────────────────────────────────────────
export const TEXT_STYLES = {
  display: {
    fontFamily: FONTS.black,
    fontSize: FONT_SIZES['4xl'],
    lineHeight: FONT_SIZES['4xl'] * 1.2,
    letterSpacing: -0.8,
  },
  h1: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES['3xl'],
    lineHeight: FONT_SIZES['3xl'] * 1.25,
    letterSpacing: -0.5,
  },
  h2: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES['2xl'],
    lineHeight: FONT_SIZES['2xl'] * 1.3,
    letterSpacing: -0.3,
  },
  h3: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.xl,
    lineHeight: FONT_SIZES.xl * 1.35,
  },
  h4: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.lg,
    lineHeight: FONT_SIZES.lg * 1.4,
  },
  body: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.base,
    lineHeight: FONT_SIZES.base * 1.5,
  },
  bodyMed: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.base,
    lineHeight: FONT_SIZES.base * 1.5,
  },
  caption: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.sm,
    lineHeight: FONT_SIZES.sm * 1.4,
  },
  label: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.xs,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  price: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.lg,
    letterSpacing: -0.3,
  },
};

export default { FONTS, FONT_SIZES, TEXT_STYLES };
