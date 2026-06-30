import { View, ImageBackground } from "react-native";
import { SafeAreaView, type Edge } from "react-native-safe-area-context";
import { useAppContext } from "@/lib/app-context";
import { cn } from "@/lib/utils";

export interface ScreenContainerProps {
  children?: React.ReactNode;
  edges?: Edge[];
  className?: string;
  containerClassName?: string;
  safeAreaClassName?: string;
  style?: any;
}

export function ScreenContainer({
  children,
  edges = ["top", "bottom", "left", "right"],
  className,
  safeAreaClassName,
  style,
}: ScreenContainerProps) {
  const { theme } = useAppContext();
  const isDarkMode = theme === "dark";

  return (
    <View style={{ flex: 1 }}>
      {isDarkMode && (
        <ImageBackground
          source={{
            uri: "https://d2xsxph8kpxj0f.cloudfront.net/310519663634810326/cLCRG6KQTTAEtGgCLZTdkj/dark-theme-landscape-NK3jDpdzsZBvEPocB6TfDU.webp",
          }}
          resizeMode="cover"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: "none",
          } as any}
        >
          {/* Premium gradient overlay - warm, calm, emotionally supportive */}
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(28, 45, 54, 0.72)",
            }}
            pointerEvents="none"
          />

          {/* Soft fog layer - top area */}
          <View
            style={{
              position: "absolute",
              top: 0,
              left: "50%",
              width: "180%",
              height: "50%",
              marginLeft: "-90%",
              backgroundColor: "rgba(95, 154, 157, 0.08)",
              borderRadius: 1000,
              opacity: 0.6,
              pointerEvents: "none",
            }}
          />

          {/* Subtle teal ambient glow - middle area */}
          <View
            style={{
              position: "absolute",
              top: "40%",
              left: "50%",
              width: "160%",
              height: "60%",
              marginLeft: "-80%",
              backgroundColor: "rgba(130, 183, 180, 0.06)",
              borderRadius: 1000,
              opacity: 0.5,
              pointerEvents: "none",
            }}
          />

          {/* Gentle depth gradient - bottom area */}
          <View
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "40%",
              backgroundColor: "rgba(49, 70, 79, 0.15)",
              opacity: 0.4,
              pointerEvents: "none",
            }}
          />
        </ImageBackground>
      )}

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
          } as any}
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

      <SafeAreaView
        edges={edges}
        style={{ flex: 1, backgroundColor: "transparent" }}
        className={cn("flex-1", safeAreaClassName)}
      >
        <View
          className={cn("flex-1 pt-6", className)}
          style={{ backgroundColor: "transparent" }}
        >
          {children}
        </View>
      </SafeAreaView>
    </View>
  );
}
