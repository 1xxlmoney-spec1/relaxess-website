import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAppContext } from "@/lib/app-context";

/**
 * RelaxessHeader - Apple VisionOS floating typography
 * 
 * Features:
 * - Apple VisionOS-style depth effect (shadow layer)
 * - Soft inner moonlight glow from text shadows
 * - Atmospheric glow layer (text-sourced only)
 * - Self-illuminated letters (no containers)
 * - Premium top-light highlight
 * - Moonlit luxury hotel branding aesthetic
 * - Theme-aware colors
 * - No animations, no containers, no floating effects
 */
export function RelaxessHeader() {
  const { theme } = useAppContext();
  const isDarkMode = theme === "dark";

  // Theme-aware main text colors
  const mainTextColor = isDarkMode ? "#F5F8FA" : "#FFFFFF";
  const shadowColor = isDarkMode ? "rgba(0,0,0,0.35)" : "rgba(0,0,0,0.18)";

  // Soft inner moonlight glow
  const glowColor = isDarkMode ? "rgba(120,220,255,0.55)" : "rgba(255,255,255,0.75)";
  const glowRadius = isDarkMode ? 38 : 10;

  // Atmospheric glow layer
  const atmosphericGlowColor = isDarkMode ? "rgba(90,190,255,0.40)" : "rgba(255,255,255,0.15)";
  const atmosphericGlowRadius = isDarkMode ? 60 : 20;

  // Highlight layer colors
  const highlightColor = isDarkMode ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.55)";

  return (
    <View style={styles.container}>
      {/* Layer 1: Depth shadow (offset +3px) */}
      <Text
        style={[
          styles.text,
          {
            color: shadowColor,
            position: "absolute",
            top: 3,
            left: 3,
          },
        ]}
      >
        Relaxess
      </Text>

      {/* Layer 2: Main text with self-illuminated glow */}
      <Text
        style={[
          styles.text,
          {
            color: mainTextColor,
            textShadowColor: glowColor,
            textShadowRadius: glowRadius,
            textShadowOffset: { width: 0, height: 0 },
          },
        ]}
      >
        Relaxess
      </Text>

      {/* Layer 3: Atmospheric glow layer (text-sourced) */}
      {isDarkMode && (
        <Text
          style={[
            styles.text,
            {
              color: mainTextColor,
              position: "absolute",
              top: 0,
              left: 0,
              opacity: 0.35,
              textShadowColor: atmosphericGlowColor,
              textShadowRadius: atmosphericGlowRadius,
              textShadowOffset: { width: 0, height: 0 },
            },
          ]}
        >
          Relaxess
        </Text>
      )}

      {/* Layer 4: Premium top-light highlight */}
      <Text
        style={[
          styles.text,
          {
            color: highlightColor,
            position: "absolute",
            top: -1,
            left: 0,
            opacity: 0.55,
          },
        ]}
      >
        Relaxess
      </Text>

      {/* Layer 5: Vision Aura */}
      <Text
        style={[
          styles.text,
          {
            position: "absolute",
            top: 0,
            left: 0,
            color: "#9BE7FF",
            opacity: 0.18,
            textShadowColor: "#6EDBFF",
            textShadowRadius: 80,
            textShadowOffset: {
              width: 0,
              height: 0,
            },
          },
        ]}
      >
        Relaxess
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  text: {
    fontSize: 34,
    fontWeight: "500",
    letterSpacing: 2.2,
  },
});
