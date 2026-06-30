import { View, type ViewProps } from "react-native";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

interface GlowingIconProps extends Omit<ViewProps, "children"> {
  name: Parameters<typeof IconSymbol>[0]["name"];
  size?: number;
  color: string;
  isActive?: boolean;
}

/**
 * Premium icon wrapper with soft cyan glow effect for navigation dock.
 * Active icons glow with cyan luminescence; inactive icons remain subtle.
 */
export function GlowingIcon({
  name,
  size = 28,
  color,
  isActive = false,
  style,
  ...props
}: GlowingIconProps) {
  const colors = useColors();

  return (
    <View
      style={[
        {
          alignItems: "center",
          justifyContent: "center",
          width: size + 12,
          height: size + 12,
        },
        style,
      ]}
      {...props}
    >
      {/* Glow layer - only visible when active */}
      {isActive && (
        <View
          style={{
            position: "absolute",
            width: size + 20,
            height: size + 20,
            borderRadius: (size + 20) / 2,
            backgroundColor: "rgba(127, 223, 255, 0.15)",
            shadowColor: "#7FDFFF",
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.4,
            shadowRadius: 12,
            elevation: 8,
          }}
        />
      )}

      {/* Icon */}
      <IconSymbol name={name} size={size} color={color} />
    </View>
  );
}
