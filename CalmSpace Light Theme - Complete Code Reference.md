# CalmSpace Light Theme - Complete Code Reference

## 1. LIGHT THEME COLORS (theme.config.js)

```javascript
const themeColors = {
  primary: { light: '#0a7ea4' },           // Bright cyan accent
  background: { light: '#ffffff' },        // Pure white
  surface: { light: '#f5f5f5' },          // Light gray for cards
  foreground: { light: '#11181C' },       // Dark text
  muted: { light: '#687076' },            // Secondary text
  border: { light: '#E5E7EB' },           // Light borders
  success: { light: '#22C55E' },
  warning: { light: '#F59E0B' },
  error: { light: '#EF4444' },
};
```

---

## 2. LIGHT THEME BACKGROUND (ScreenContainer)

**Location:** `components/screen-container.tsx` (lines 99-169)

```tsx
{!isDarkMode && (
  <ImageBackground
    source={{
      uri: "https://d2xsxph8kpxj0f.cloudfront.net/310519663634810326/cLCRG6KQTTAEtGgCLZTdkj/light-theme-lagoon-o3jFbUDtkB8ZdkCdcrLVeV.webp",
    }}
    resizeMode="cover"
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: "none",
    }}
  >
    {/* Soft gradient overlay - fresh, calm, hopeful */}
    <View
      style={{
        flex: 1,
        backgroundColor: "rgba(234, 247, 246, 0.58)",
      }}
      pointerEvents="none"
    />

    {/* Soft white ambient glow - top area */}
    <View
      style={{
        position: "absolute",
        top: 0,
        left: "50%",
        width: "180%",
        height: "50%",
        marginLeft: "-90%",
        backgroundColor: "rgba(248, 252, 252, 0.12)",
        borderRadius: 1000,
        opacity: 0.5,
        pointerEvents: "none",
      }}
    />

    {/* Gentle aqua reflection - middle area */}
    <View
      style={{
        position: "absolute",
        top: "40%",
        left: "50%",
        width: "160%",
        height: "60%",
        marginLeft: "-80%",
        backgroundColor: "rgba(183, 216, 211, 0.05)",
        borderRadius: 1000,
        opacity: 0.4,
        pointerEvents: "none",
      }}
    />

    {/* Subtle depth layer - bottom area */}
    <View
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "40%",
        backgroundColor: "rgba(212, 233, 230, 0.08)",
        opacity: 0.3,
        pointerEvents: "none",
      }}
    />
  </ImageBackground>
)}
```

**Key Properties:**
- **Background Image:** Morning lagoon landscape (S3 URL)
- **Overlay:** `rgba(234, 247, 246, 0.58)` - soft aqua tint
- **Top Glow:** `rgba(248, 252, 252, 0.12)` - white ambient light
- **Middle Reflection:** `rgba(183, 216, 211, 0.05)` - aqua shimmer
- **Bottom Depth:** `rgba(212, 233, 230, 0.08)` - subtle shadow

---

## 3. LIGHT THEME CARDS (Mood Selection)

**Location:** `app/(tabs)/index.tsx` (lines 197-224)

```tsx
{/* Mood Selection Grid */}
<View className="gap-3 mb-2">
  {MOODS.map((mood) => (
    <Pressable
      key={mood.id}
      onPress={() => handleMoodSelect(mood.id)}
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.8 : 1,
          transform: [{ scale: pressed ? 0.97 : 1 }],
        },
      ]}
    >
      <View
        className={cn(
          "py-3 px-6 rounded-2xl border-2 transition-all",
          selectedMood === mood.id
            ? "bg-primary border-primary"
            : "bg-surface border-border"
        )}
      >
        <Text className="text-center text-lg font-semibold text-foreground">
          {t(mood.key)}
        </Text>
      </View>
    </Pressable>
  ))}
</View>
```

**Light Theme Styling:**
- **Unselected State:**
  - Background: `#f5f5f5` (light gray)
  - Border: `#E5E7EB` (light border)
  - Text: `#11181C` (dark text)
  - Border Width: 2px
  - Rounded: 2xl (16px)
  - Padding: 3 vertical, 6 horizontal

- **Selected State:**
  - Background: `#0a7ea4` (bright cyan)
  - Border: `#0a7ea4` (cyan)
  - Text: `#ffffff` (white, via Tailwind)

- **Press Feedback:**
  - Opacity: 0.8
  - Scale: 0.97

---

## 4. LIGHT THEME BUTTONS

### Start Session Button

**Location:** `app/(tabs)/index.tsx` (lines 226-248)

```tsx
<Pressable
  onPress={handleStartSession}
  disabled={!selectedMood}
  style={({ pressed }) => [
    {
      opacity: !selectedMood ? 0.5 : pressed ? 0.9 : 1,
      transform: [{ scale: !selectedMood ? 1 : pressed ? 0.97 : 1 }],
    },
  ]}
>
  <View
    className={cn(
      "py-3 px-6 rounded-3xl items-center",
      selectedMood ? "bg-primary" : "bg-muted"
    )}
  >
    <Text className="text-lg font-bold text-foreground">
      {t("home.startSession")}
    </Text>
  </View>
</Pressable>
```

**Light Theme Styling:**
- **Enabled State:**
  - Background: `#0a7ea4` (bright cyan)
  - Text: `#11181C` (dark text)
  - Padding: 3 vertical, 6 horizontal
  - Rounded: 3xl (24px)

- **Disabled State:**
  - Background: `#687076` (muted gray)
  - Opacity: 0.5

- **Press Feedback:**
  - Opacity: 0.9
  - Scale: 0.97

### Relaxation Tools Button

**Location:** `app/(tabs)/index.tsx` (lines 250-265)

```tsx
<Pressable
  onPress={handleRelaxationTools}
  style={({ pressed }) => [
    {
      opacity: pressed ? 0.8 : 1,
      transform: [{ scale: pressed ? 0.97 : 1 }],
    },
  ]}
>
  <View className="py-3 px-6 rounded-2xl bg-surface border border-border items-center">
    <Text className="text-base font-semibold text-foreground">
      🧘 {t("tools.title")}
    </Text>
  </View>
</Pressable>
```

**Light Theme Styling:**
- **Background:** `#f5f5f5` (light gray)
- **Border:** `#E5E7EB` (light border)
- **Text:** `#11181C` (dark text)
- **Border Width:** 1px
- **Rounded:** 2xl (16px)
- **Padding:** 3 vertical, 6 horizontal

- **Press Feedback:**
  - Opacity: 0.8
  - Scale: 0.97

---

## 5. LIGHT THEME THEME TOGGLE BUTTON

**Location:** `app/(tabs)/index.tsx` (lines 142-183)

```tsx
{/* Theme Toggle - Premium Apple VisionOS Style */}
<Pressable
  onPress={handleThemeIconTap}
  style={({ pressed }) => [
    {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: "rgba(255,255,255,0.55)",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.38)",
      justifyContent: "center",
      alignItems: "center",
      transform: [{ scale: pressed ? 0.94 : 1 }],
      shadowColor: "rgba(120,180,220,0.20)",
      shadowOpacity: 0.18,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 5 },
      overflow: "hidden",
    },
  ]}
>
  {/* Inner highlight reflection - subtle glass effect */}
  <View
    style={{
      position: "absolute",
      top: 1,
      left: 4,
      right: 4,
      height: 12,
      backgroundColor: "rgba(255,255,255,0.12)",
      borderRadius: 20,
      opacity: 0.45,
    }}
  />
  {/* Icon - centered and clearly visible */}
  <MaterialIcons
    name="nightlight-round"
    size={22}
    color="#4E6473"
  />
</Pressable>
```

**Light Theme Styling:**
- **Size:** 50×50 (circular, borderRadius: 25)
- **Background:** `rgba(255,255,255,0.55)` (frosted glass)
- **Border:** 1px `rgba(255,255,255,0.38)` (subtle edge)
- **Shadow:**
  - Color: `rgba(120,180,220,0.20)` (cool blue)
  - Opacity: 0.18
  - Radius: 12px
  - Offset: { x: 0, y: 5 }
- **Icon:** Moon (nightlight-round) at 22px, color `#4E6473` (slate)
- **Reflection:** `rgba(255,255,255,0.12)` at 0.45 opacity
- **Press Feedback:** Scale 1 → 0.94 (no bounce)

---

## 6. LIGHT THEME NAVIGATION BAR

**Location:** `app/(tabs)/_layout.tsx` (lines 18-41)

```tsx
<Tabs
  screenOptions={{
    tabBarActiveTintColor: colors.tint,  // Light: #0a7ea4 (cyan)
    headerShown: false,
    tabBarButton: HapticTab,
    tabBarStyle: {
      paddingTop: 8,
      paddingBottom: bottomPadding,
      height: tabBarHeight,
      backgroundColor: colors.background,  // Light: #ffffff
      borderTopColor: colors.border,       // Light: #E5E7EB
      borderTopWidth: 0.5,
      overflow: "visible",
    },
    tabBarLabelStyle: {
      fontSize: 12,
      fontWeight: "500",
      marginTop: 2,
      marginBottom: 0,
      lineHeight: 14,
      height: "auto",
      overflow: "visible",
    },
  }}
>
  <Tabs.Screen
    name="index"
    options={{
      title: "Home",
      tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
    }}
  />
  <Tabs.Screen
    name="settings"
    options={{
      title: "Settings",
      tabBarIcon: ({ color }) => <IconSymbol size={28} name="gearshape.fill" color={color} />,
    }}
  />
  <Tabs.Screen
    name="music"
    options={{
      title: "Music",
      tabBarIcon: ({ color }) => <IconSymbol size={28} name="music.note" color={color} />,
    }}
  />
</Tabs>
```

**Light Theme Styling:**
- **Background:** `#ffffff` (pure white)
- **Border Top:** 0.5px `#E5E7EB` (light gray)
- **Active Icon Color:** `#0a7ea4` (bright cyan)
- **Inactive Icon Color:** `#687076` (muted gray)
- **Label Color:** `#687076` (muted gray, via Tailwind)
- **Padding:** 8px top, safe-area bottom
- **Height:** 56px + bottom padding

---

## 7. LIGHT THEME TEXT COLORS

**Via Tailwind Classes:**

```tsx
// Foreground (primary text)
className="text-foreground"  // Light: #11181C (dark)

// Muted (secondary text)
className="text-muted"       // Light: #687076 (gray)

// Primary (accent)
className="text-primary"     // Light: #0a7ea4 (cyan)
```

---

## 8. COMPLETE LIGHT THEME VISUAL HIERARCHY

```
┌─────────────────────────────────────────────┐
│  Light Theme Lagoon Background              │
│  - Base: rgba(234, 247, 246, 0.58)         │
│  - Top Glow: rgba(248, 252, 252, 0.12)     │
│  - Middle: rgba(183, 216, 211, 0.05)       │
│  - Bottom: rgba(212, 233, 230, 0.08)       │
│                                             │
│  ┌─────────────────────────────────────┐  │
│  │ Theme Toggle Button                 │  │
│  │ - Background: rgba(255,255,255,0.55)│  │
│  │ - Border: rgba(255,255,255,0.38)    │  │
│  │ - Icon: Moon #4E6473                │  │
│  │ - Shadow: rgba(120,180,220,0.20)    │  │
│  └─────────────────────────────────────┘  │
│                                             │
│  ┌─────────────────────────────────────┐  │
│  │ CalmSpace Header                    │  │
│  │ (Premium Typography)                │  │
│  └─────────────────────────────────────┘  │
│                                             │
│  ┌─────────────────────────────────────┐  │
│  │ Mood Cards (Unselected)             │  │
│  │ - Background: #f5f5f5               │  │
│  │ - Border: #E5E7EB                   │  │
│  │ - Text: #11181C                     │  │
│  │ - Rounded: 16px                     │  │
│  └─────────────────────────────────────┘  │
│                                             │
│  ┌─────────────────────────────────────┐  │
│  │ Start Session Button (Enabled)      │  │
│  │ - Background: #0a7ea4 (cyan)        │  │
│  │ - Text: #11181C                     │  │
│  │ - Rounded: 24px                     │  │
│  └─────────────────────────────────────┘  │
│                                             │
│  ┌─────────────────────────────────────┐  │
│  │ Relaxation Tools Button             │  │
│  │ - Background: #f5f5f5               │  │
│  │ - Border: #E5E7EB                   │  │
│  │ - Text: #11181C                     │  │
│  │ - Rounded: 16px                     │  │
│  └─────────────────────────────────────┘  │
│                                             │
│  Disclaimer Text: #687076 (muted)          │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ Navigation Bar (Bottom)                     │
│ - Background: #ffffff                       │
│ - Border Top: #E5E7EB                       │
│ - Active Icon: #0a7ea4 (cyan)              │
│ - Inactive Icon: #687076 (gray)            │
│ - Labels: #687076 (gray)                   │
└─────────────────────────────────────────────┘
```

---

## 9. SUMMARY: LIGHT THEME COLOR PALETTE

| Element | Color | Hex/RGBA |
|---------|-------|----------|
| **Background** | Pure White | `#ffffff` |
| **Surface (Cards)** | Light Gray | `#f5f5f5` |
| **Primary (Accent)** | Bright Cyan | `#0a7ea4` |
| **Foreground (Text)** | Dark Gray | `#11181C` |
| **Muted (Secondary)** | Medium Gray | `#687076` |
| **Border** | Light Gray | `#E5E7EB` |
| **Overlay (Bg)** | Soft Aqua | `rgba(234, 247, 246, 0.58)` |
| **Glass (Button)** | Frosted White | `rgba(255,255,255,0.55)` |
| **Shadow (Button)** | Cool Blue | `rgba(120,180,220,0.20)` |

---

## 10. TAILWIND CLASSES USED IN LIGHT THEME

```tsx
// Spacing
className="px-6"          // Horizontal padding
className="py-3"          // Vertical padding
className="gap-3"         // Gap between items
className="mb-2"          // Margin bottom

// Layout
className="flex-1"        // Flex grow
className="items-center"  // Center horizontally
className="justify-center" // Center vertically
className="flex-row"      // Horizontal layout

// Typography
className="text-2xl"      // Large heading
className="text-lg"       // Large text
className="text-base"     // Base text
className="text-xs"       // Small text
className="font-bold"     // Bold weight
className="font-semibold" // Semi-bold weight
className="text-center"   // Center text
className="text-foreground" // Dark text
className="text-muted"    // Gray text

// Colors
className="bg-primary"    // Cyan background
className="bg-surface"    // Light gray background
className="bg-muted"      // Gray background
className="border-primary" // Cyan border
className="border-border" // Light border

// Rounded
className="rounded-2xl"   // 16px border radius
className="rounded-3xl"   // 24px border radius
className="rounded-full"  // Circular

// Transitions
className="transition-all" // Smooth transitions
```

