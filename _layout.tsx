import 'react-native-gesture-handler';
import "@/global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { Platform, View } from "react-native";
// import "@/lib/_core/nativewind-pressable"; // TEMPORARY: Testing gesture isolation
import { ThemeProvider } from "@/lib/theme-provider";
import { AppProvider } from "@/lib/app-context";
import { OpenAIProvider } from "@/lib/openai-context";
import { AudioProvider } from "@/lib/audio-context";
import { AppShell } from "@/components/app-shell";
import { GlobalAudioBar } from "@/components/global-audio-bar";
import {
  SafeAreaFrameContext,
  SafeAreaInsetsContext,
  SafeAreaProvider,
  initialWindowMetrics,
} from "react-native-safe-area-context";
import type { EdgeInsets, Metrics, Rect } from "react-native-safe-area-context";

import { trpc, createTRPCClient } from "@/lib/trpc";
import { initManusRuntime, subscribeSafeAreaInsets } from "@/lib/_core/manus-runtime";

const DEFAULT_WEB_INSETS: EdgeInsets = { top: 0, right: 0, bottom: 0, left: 0 };
const DEFAULT_WEB_FRAME: Rect = { x: 0, y: 0, width: 0, height: 0 };

export const unstable_settings = {
  anchor: "(tabs)",
};

/**
 * RootLayout - Application entry point
 * 
 * Responsibilities:
 * 1. Initialize providers (AppProvider, ThemeProvider, OpenAIProvider, AudioProvider)
 * 2. Set up SafeAreaProvider with proper insets
 * 3. Initialize Manus runtime
 * 4. Render AppShell (which handles all system UI)
 * 
 * What it does NOT do:
 * - StatusBar configuration (delegated to AppShell → DynamicStatusBar)
 * - Screen rendering (delegated to AppShell → Stack)
 * - Content layout (delegated to screens)
 */



export default function RootLayout() {
  const initialInsets = initialWindowMetrics?.insets ?? DEFAULT_WEB_INSETS;
  const initialFrame = initialWindowMetrics?.frame ?? DEFAULT_WEB_FRAME;

  const [insets, setInsets] = useState<EdgeInsets>(initialInsets);
  const [frame, setFrame] = useState<Rect>(initialFrame);

  // Initialize Manus runtime for cookie injection from parent container
  useEffect(() => {
    initManusRuntime();
  }, []);

  const handleSafeAreaUpdate = useCallback((metrics: Metrics) => {
    setInsets(metrics.insets);
    setFrame(metrics.frame);
  }, []);

  useEffect(() => {
    if (Platform.OS !== "web") return;
    const unsubscribe = subscribeSafeAreaInsets(handleSafeAreaUpdate);
    return () => unsubscribe();
  }, [handleSafeAreaUpdate]);

  // Create clients once and reuse them
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Disable automatic refetching on window focus for mobile
            refetchOnWindowFocus: false,
            // Retry failed requests once
            retry: 1,
          },
        },
      }),
  );
  const [trpcClient] = useState(() => createTRPCClient());

  // Ensure minimum 8px padding for top and bottom on mobile
  const providerInitialMetrics = useMemo(() => {
    const metrics = initialWindowMetrics ?? { insets: initialInsets, frame: initialFrame };
    return {
      ...metrics,
      insets: {
        ...metrics.insets,
        top: Math.max(metrics.insets.top, 16),
        bottom: Math.max(metrics.insets.bottom, 12),
      },
    };
  }, [initialInsets, initialFrame]);

  const content = (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <View style={{ flex: 1, flexDirection: "column" }}>
            {/* AppShell handles all system UI: StatusBar, Navigation, RootBackground */}
            <AppShell />
            {/* Global Audio Bar at bottom - includes limit notification inside */}
            <GlobalAudioBar />
          </View>
        </QueryClientProvider>
      </trpc.Provider>
    </GestureHandlerRootView>
  );

  const shouldOverrideSafeArea = Platform.OS === "web";

  if (shouldOverrideSafeArea) {
    return (
      <AppProvider>
        <AudioProvider>
          <OpenAIProvider>
            <ThemeProvider>
              <SafeAreaProvider initialMetrics={providerInitialMetrics}>
                <SafeAreaFrameContext.Provider value={frame}>
                  <SafeAreaInsetsContext.Provider value={insets}>
                    {content}
                  </SafeAreaInsetsContext.Provider>
                </SafeAreaFrameContext.Provider>
              </SafeAreaProvider>
            </ThemeProvider>
          </OpenAIProvider>
        </AudioProvider>
      </AppProvider>
    );
  }

  return (
    <AppProvider>
      <AudioProvider>
        <OpenAIProvider>
          <ThemeProvider>
            <SafeAreaProvider initialMetrics={providerInitialMetrics}>
              {content}
            </SafeAreaProvider>
          </ThemeProvider>
        </OpenAIProvider>
      </AudioProvider>
    </AppProvider>
  );
}
