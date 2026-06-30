# Dark Theme Gradient - Root Cause Analysis

## Problem Statement
Dark mode visual changes (cosmic gradient) are not appearing on screen despite code changes being deployed and tests passing.

## Rendering Hierarchy (Top to Bottom)

```
1. GestureHandlerRootView (flex: 1)
   ↓
2. trpc.Provider
   ↓
3. QueryClientProvider
   ↓
4. AppProvider (manages theme state: "dark" | "light")
   ↓
5. OpenAIProvider
   ↓
6. ThemeProvider (wraps in View with themeVariables)
   - Uses useAppContext().theme to sync colorScheme
   - Applies CSS variables to document.documentElement
   - View style: { flex: 1, backgroundColor: "transparent" }
   ↓
7. SafeAreaProvider
   ↓
8. RootBackground (uses useAppContext().theme)
   - In dark mode: renders View with backgroundColor: "#FF0000" (DEBUG)
   - Fallback: backgroundColor: "#0a0e27"
   - backgroundImage: "linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)"
   ↓
9. Stack Navigator (Expo Router)
   ↓
10. Screen Component (e.g., app/(tabs)/index.tsx)
    ↓
11. ScreenContainer (uses useColorScheme() from ThemeProvider)
    - Gets colorScheme from useThemeContext()
    - In dark mode: renders LinearGradient
    - In light mode: renders View with bg-background
    - Outer View: className={cn("flex-1", !isDarkMode && "bg-background")}
    ↓
12. SafeAreaView (inside ScreenContainer)
    ↓
13. View with content (className prop)

```

## Critical Issue Identified

### The Theme Mismatch Problem

**Layer 4 (AppProvider):**
- Manages `theme` state: "dark" | "light"
- Persisted in AsyncStorage
- Updated via `setTheme()` function

**Layer 6 (ThemeProvider):**
- Reads `appTheme` from AppProvider
- Creates `colorScheme` state that syncs with `appTheme`
- Provides `useColorScheme()` hook that returns `colorScheme`

**Layer 8 (RootBackground):**
- Uses `useAppContext().theme` directly
- Should work correctly

**Layer 11 (ScreenContainer):**
- Uses `useColorScheme()` which reads from ThemeProvider
- ThemeProvider syncs with AppProvider via useEffect
- BUT: There may be a timing issue where colorScheme doesn't update immediately

### Hypothesis: Race Condition or Sync Issue

1. User toggles theme in UI
2. AppProvider updates `theme` state
3. ThemeProvider receives new `appTheme` via useEffect
4. ThemeProvider updates `colorScheme` state
5. ScreenContainer re-renders with new `colorScheme`

**If step 3-4 are delayed:** ScreenContainer might render with old `colorScheme` value while RootBackground has new value.

## Components Responsible for Final Background

### RootBackground (components/root-background.tsx)
- **Responsibility:** Render root-level background for entire app
- **Current State:** Renders View with backgroundColor="#FF0000" (DEBUG) in dark mode
- **Issue:** May not be visible if covered by ScreenContainer

### ScreenContainer (components/screen-container.tsx)
- **Responsibility:** Render screen-level background with SafeArea handling
- **Current State:** 
  - Dark mode: Renders LinearGradient
  - Light mode: Renders View with bg-background
- **Issue:** If `useColorScheme()` returns "light" when it should return "dark", renders solid background

### ThemeProvider (lib/theme-provider.tsx)
- **Responsibility:** Sync theme state and provide colorScheme hook
- **Current State:** Wraps children in View with themeVariables
- **Issue:** View now has backgroundColor: "transparent" (fixed)

## Debug Strategy

To identify which layer is actually visible:

1. **RootBackground:** Set backgroundColor to bright red (#FF0000) ✓ DONE
2. **ScreenContainer (dark):** Set LinearGradient colors to bright blue (#0000FF)
3. **ScreenContainer (light):** Set bg-background to bright green (#00FF00)
4. **Observe which color appears on screen**

## Expected Results

- If RED appears: RootBackground is visible (gradient not being covered)
- If BLUE appears: ScreenContainer is rendering gradient in dark mode
- If GREEN appears: ScreenContainer is rendering solid background (theme mismatch)
- If BLACK appears: Something else is covering everything

## Next Steps

1. Check browser console for debug logs from ScreenContainer
2. Verify `colorScheme` value matches `appTheme` value
3. If mismatch found: Fix ThemeProvider sync logic
4. If no mismatch: RootBackground gradient is being covered by ScreenContainer
5. Solution: Either remove ScreenContainer gradient or ensure it doesn't render in dark mode

## Files to Monitor

- `components/root-background.tsx` - Root level background
- `components/screen-container.tsx` - Screen level background
- `lib/theme-provider.tsx` - Theme state management
- `lib/app-context.tsx` - App-level theme state
- `hooks/use-color-scheme.ts` - ColorScheme hook
