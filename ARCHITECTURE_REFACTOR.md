# Architecture Refactor: Clean Separation of Concerns

## Overview

This refactor enforces a strict separation between **system UI configuration** (AppShell) and **screen content** (individual screens). This prevents future regressions where layout fixes inadvertently break system UI like the StatusBar.

## Architecture Rules

### 1. AppShell - Single Source of Truth for System UI

**Location**: `components/app-shell.tsx`

**Responsibilities**:
- StatusBar configuration (theme-based styling)
- Navigation structure (Stack with all screens)
- Root background rendering

**What it does NOT do**:
- Screen-specific layout
- SafeArea configuration
- Content rendering

### 2. StatusBar Configuration

**Component**: `DynamicStatusBar` (inside AppShell)

**Behavior**:
- Dark mode → `style="light"` (light icons for dark background)
- Light mode → `style="dark"` (dark icons for light background)
- Responds dynamically to theme changes from AppContext
- ONLY exists in AppShell (never overridden in screens)

**Code**:
```tsx
function DynamicStatusBar() {
  const { theme } = useAppContext();
  const barStyle = theme === "dark" ? "light" : "dark";

  return (
    <StatusBar
      style={barStyle as any}
      backgroundColor="transparent"
      translucent
    />
  );
}
```

### 3. RootLayout - Provider Setup Only

**Location**: `app/_layout.tsx`

**Responsibilities**:
1. Initialize AppProvider (app state)
2. Initialize ThemeProvider (theme switching)
3. Initialize OpenAIProvider (AI features)
4. Set up SafeAreaProvider (safe area insets)
5. Initialize Manus runtime
6. Render AppShell

**What it does NOT do**:
- StatusBar configuration (delegated to AppShell)
- Screen rendering (delegated to AppShell)
- Content layout (delegated to screens)

### 4. Screen Components

**Pattern**: Use ScreenContainer for SafeArea + content

**Responsibilities**:
- UI layout
- Content rendering
- Screen-specific interactions

**What they do NOT do**:
- StatusBar configuration
- Navigation setup
- Provider initialization

**Example**:
```tsx
export default function SettingsScreen() {
  return (
    <ScreenContainer className="p-4">
      {/* Content here */}
    </ScreenContainer>
  );
}
```

## Component Hierarchy

```
RootLayout (app/_layout.tsx)
├── AppProvider
├── OpenAIProvider
├── ThemeProvider
├── SafeAreaProvider
└── AppShell (components/app-shell.tsx)
    ├── RootBackground
    ├── Stack (Navigation)
    │   ├── (tabs)
    │   │   ├── Home Screen
    │   │   ├── Settings Screen
    │   │   └── Music Screen
    │   └── Modal Screens
    └── DynamicStatusBar ← ONLY place StatusBar exists
```

## Key Benefits

1. **Single Responsibility**: Each component has one clear purpose
2. **Regression Prevention**: Layout changes can't break StatusBar
3. **Testability**: StatusBar behavior can be tested independently
4. **Maintainability**: Future developers know where system UI lives
5. **Scalability**: Easy to add new system UI (e.g., navigation bar, header)

## Migration Guide

### Before (Problematic)
```tsx
// app/_layout.tsx
function StatusBarController() {
  const { theme } = useAppContext();
  return <StatusBar style={...} />;
}

export default function RootLayout() {
  return (
    <RootBackground>
      <Stack>...</Stack>
      <StatusBarController />  // ❌ Mixed concerns
    </RootBackground>
  );
}
```

### After (Clean)
```tsx
// components/app-shell.tsx
function DynamicStatusBar() {
  const { theme } = useAppContext();
  return <StatusBar style={...} />;
}

export function AppShell() {
  return (
    <RootBackground>
      <Stack>...</Stack>
      <DynamicStatusBar />  // ✅ Clear separation
    </RootBackground>
  );
}

// app/_layout.tsx
export default function RootLayout() {
  return (
    <AppProvider>
      <ThemeProvider>
        <SafeAreaProvider>
          <AppShell />  // ✅ Providers + AppShell
        </SafeAreaProvider>
      </ThemeProvider>
    </AppProvider>
  );
}
```

## Testing

All 138 tests passing:
- ✅ Theme switching works
- ✅ StatusBar updates dynamically
- ✅ Settings title positioning maintained
- ✅ No regressions in any screen
- ✅ Light/dark mode contrast verified

## Future Improvements

This architecture makes it easy to add:
1. **Navigation Bar Styling** - Add to AppShell
2. **Global Modals** - Add to AppShell
3. **System Notifications** - Add to AppShell
4. **Orientation Lock** - Add to AppShell

All without affecting screen components.

## Regression Prevention Checklist

When adding new features:
- [ ] Does it affect system UI? → Add to AppShell
- [ ] Does it affect screen layout? → Add to ScreenContainer or screen
- [ ] Does it need theme awareness? → Use AppContext (already available in AppShell)
- [ ] Could it break StatusBar? → Review AppShell changes carefully

## Related Files

- `components/app-shell.tsx` - System UI configuration
- `app/_layout.tsx` - Provider setup
- `components/screen-container.tsx` - Screen SafeArea wrapper
- `lib/app-context.tsx` - App state (theme, language, etc.)
