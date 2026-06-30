import { View } from "react-native";
import { useColors } from "@/hooks/use-colors";

export function RootBackground({ children }: { children: React.ReactNode }) {
  const colors = useColors();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
      {children}
    </View>
  );
}
