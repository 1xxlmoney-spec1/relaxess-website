import { View } from "react-native";
import { useAppContext } from "@/lib/app-context";

export function RootBackground({ children }: { children: React.ReactNode }) {
  const { theme } = useAppContext();
  const isDarkMode = theme === "dark";

  if (isDarkMode) {
    // Dark theme: Deep teal ocean with cyan glow
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#0A1F2E",
        }}
      >
        {/* Top-right cyan glow */}
        <View
          style={{
            position: "absolute",
            top: -150,
            right: -150,
            width: 500,
            height: 500,
            borderRadius: 250,
            backgroundColor: "rgba(0,217,255,0.12)",
            opacity: 0.6,
            pointerEvents: "none",
          }}
        />

        {/* Bottom-left subtle cyan glow */}
        <View
          style={{
            position: "absolute",
            bottom: -200,
            left: -200,
            width: 600,
            height: 600,
            borderRadius: 300,
            backgroundColor: "rgba(0,217,255,0.08)",
            opacity: 0.4,
            pointerEvents: "none",
          }}
        />

        {children}
      </View>
    );
  }

  // Light theme: serene daytime (sky blue that contrasts with white status bar icons)
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#6BA3D4",
      }}
    >
      {children}
    </View>
  );
}
