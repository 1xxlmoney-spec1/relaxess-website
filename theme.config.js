/** @type {const} */
const themeColors = {
  // Primary accent color (teal - works well in both light and dark)
  primary: { light: '#0a7ea4', dark: '#4DB8D8' },
  
  // Background colors (solid, no transparency)
  background: { light: '#ffffff', dark: '#0f1419' },
  
  // Surface colors for cards, buttons, elevated elements
  surface: { light: '#f5f5f5', dark: '#1a2332' },
  
  // Text colors - high contrast for readability
  foreground: { light: '#11181C', dark: '#f5f5f5' },
  
  // Secondary text - muted but readable
  muted: { light: '#687076', dark: '#a8b0b8' },
  
  // Border colors
  border: { light: '#E5E7EB', dark: '#2d3e52' },
  
  // Status colors
  success: { light: '#22C55E', dark: '#4ADE80' },
  warning: { light: '#F59E0B', dark: '#FBBF24' },
  error: { light: '#EF4444', dark: '#F87171' },
};

module.exports = { themeColors };
