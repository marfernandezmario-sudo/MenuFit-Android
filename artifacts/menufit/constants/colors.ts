/**
 * Semantic design tokens for the mobile app.
 *
 * These tokens mirror the naming conventions used in web artifacts (index.css)
 * so that multi-artifact projects share a cohesive visual identity.
 *
 * Replace the placeholder values below with values that match the project's
 * brand. If a sibling web artifact exists, read its index.css and convert the
 * HSL values to hex so both artifacts use the same palette.
 *
 * To add dark mode, add a `dark` key with the same token names.
 * The useColors() hook will automatically pick it up.
 */

const colors = {
  light: {
    text: '#17211B',
    tint: '#F26B4F',
    background: '#F8F8F4',
    foreground: '#17211B',
    card: '#FFFFFF',
    cardForeground: '#17211B',
    primary: '#F26B4F',
    primaryForeground: '#FFFFFF',
    secondary: '#E8F0E7',
    secondaryForeground: '#274735',
    muted: '#EEF1EC',
    mutedForeground: '#738078',
    accent: '#F4C95D',
    accentForeground: '#4E3A0E',
    destructive: '#B64747',
    destructiveForeground: '#FFFFFF',
    border: '#DDE4DC',
    input: '#DDE4DC',
    success: '#5F9D73',
    navy: '#1D3440',
  },
  dark: {
    text: '#F5F5EF',
    tint: '#FF8669',
    background: '#17211B',
    foreground: '#F5F5EF',
    card: '#243128',
    cardForeground: '#F5F5EF',
    primary: '#FF8669',
    primaryForeground: '#17211B',
    secondary: '#2D4334',
    secondaryForeground: '#DDECDF',
    muted: '#2A382F',
    mutedForeground: '#A6B5A8',
    accent: '#F4C95D',
    accentForeground: '#4E3A0E',
    destructive: '#EF7979',
    destructiveForeground: '#241919',
    border: '#3A4A3D',
    input: '#3A4A3D',
    success: '#83C994',
    navy: '#BBD4D7',
  },
  radius: 18,
};

export default colors;
