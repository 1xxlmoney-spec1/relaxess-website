/**
 * AppShell - Global wrapper for system UI configuration
 * 
 * This component exclusively handles:
 * - StatusBar configuration (theme-based styling)
 * - Navigation structure
 * - Root background
 * 
 * Screens must NOT override or configure StatusBar.
 * All StatusBar logic is centralized here to prevent regressions.
 */

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useAppContext } from "@/lib/app-context";
import { RootBackground } from "@/components/root-background";
import { View } from "react-native";

/**
 * DynamicStatusBar - Responds to theme changes
 * 
 * Mapping:
 * - Dark mode: style="light-content" (light icons for dark background)
 * - Light mode: style="dark-content" (dark icons for light background)
 */
function DynamicStatusBar() {
  const { theme } = useAppContext();

  const barStyle =
    theme === "dark" ? "light-content" : "dark-content";

  return (
    <StatusBar
      style={barStyle as any}
      backgroundColor="transparent"
      translucent
    />
  );
}

/**
 * AppShell - Root container for all app content
 * 
 * Responsibilities:
 * 1. Render DynamicStatusBar (ONLY place StatusBar exists)
 * 2. Render RootBackground (theme-aware background)
 * 3. Render navigation Stack (all screens)
 * 
 * What it does NOT do:
 * - Screen-specific layout
 * - SafeArea configuration (handled by ScreenContainer in screens)
 * - Content rendering (delegated to screens)
 */
export function AppShell() {
  return (
    <RootBackground>
      <View style={{ flex: 1, position: "relative" }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="oauth/callback" />
          <Stack.Screen name="session" options={{ presentation: "card", gestureEnabled: true }} />
          <Stack.Screen name="breathing" options={{ presentation: "card", gestureEnabled: true }} />
          <Stack.Screen name="relaxation-tools" options={{ presentation: "card", gestureEnabled: true }} />
          <Stack.Screen name="sleep" options={{ presentation: "card", gestureEnabled: true }} />
          <Stack.Screen name="grounding" options={{ presentation: "card", gestureEnabled: true }} />
          <Stack.Screen name="quiet" options={{ presentation: "card", gestureEnabled: true }} />
          <Stack.Screen name="body-scan" options={{ presentation: "card", gestureEnabled: true }} />
          <Stack.Screen name="safe-place-visualization" options={{ presentation: "card", gestureEnabled: true }} />
        </Stack>
      </View>
      <DynamicStatusBar />
    </RootBackground>
  );
}
