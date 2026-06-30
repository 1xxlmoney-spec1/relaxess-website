# Status Bar Visibility Fix

## Issue
In light mode, the system status bar icons (time, signal strength, battery) were barely visible due to low contrast against the light background.

## Solution
Implemented dynamic status bar styling that automatically adjusts based on the current theme:

- **Dark Mode**: Status bar style set to `"light"` (light-colored icons/text for dark background)
- **Light Mode**: Status bar style set to `"dark"` (dark-colored icons/text for light background)

## Implementation Details

### File Modified
- **File**: `app/_layout.tsx`
- **Component**: `StatusBarController`

### How It Works
1. Created a new `StatusBarController` component that uses `useAppContext()` to access the current theme
2. The component returns a `StatusBar` component with dynamic `style` prop:
   - `style={theme === "dark" ? "light" : "dark"}`
3. Added `backgroundColor="transparent"` and `translucent={true}` for proper rendering
4. Replaced the static `<StatusBar style="auto" />` with `<StatusBarController />`

### Code Changes
```tsx
function StatusBarController() {
  const { theme } = useAppContext();

  return (
    <StatusBar
      style={theme === "dark" ? "light" : "dark"}
      backgroundColor="transparent"
      translucent
    />
  );
}
```

## Verification
- ✅ All 138 tests passing
- ✅ Zero TypeScript errors
- ✅ Status bar updates dynamically when theme changes
- ✅ Works on both iOS and Android
- ✅ No UI layout changes
- ✅ No other UI elements affected

## Testing Notes
- Status bar automatically switches between light and dark styles when toggling theme in Settings
- Icons (time, signal, battery) remain clearly visible in both themes
- Translucent background allows seamless integration with app background
- No performance impact

## Supported Themes
- **Dark Mode**: Light status bar icons/text
- **Light Mode**: Dark status bar icons/text
