import { View, Text, Pressable, Platform } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useAppContext } from "@/lib/app-context";
import { useTranslation } from "@/lib/i18n";
import { useRouter } from "expo-router";
import { useColors } from "@/hooks/use-colors";
import { useState, useEffect } from "react";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from "react-native-reanimated";

type BreathingPhase = "inhale" | "hold" | "exhale";

interface BreathingCycle {
  phase: BreathingPhase;
  duration: number; // milliseconds
  label: string;
}

const BREATHING_CYCLES: BreathingCycle[] = [
  { phase: "inhale", duration: 4000, label: "breathing.inhale" },
  { phase: "hold", duration: 4000, label: "breathing.hold" },
  { phase: "exhale", duration: 6000, label: "breathing.exhale" },
];

export default function BreathingScreen() {
  const { language } = useAppContext();
  const { t } = useTranslation(language);
  const router = useRouter();
  const colors = useColors();

  const [currentCycleIndex, setCurrentCycleIndex] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [isActive, setIsActive] = useState(true);

  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.6);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const currentCycle = BREATHING_CYCLES[currentCycleIndex];

  useEffect(() => {
    if (!isActive) return;

    const animateBreathing = async () => {
      const targetScale = currentCycle.phase === "inhale" ? 1.5 : 1;
      const targetOpacity = currentCycle.phase === "hold" ? 0.8 : 0.6;

      scale.value = withTiming(targetScale, {
        duration: currentCycle.duration,
        easing: Easing.inOut(Easing.ease),
      });

      opacity.value = withTiming(targetOpacity, {
        duration: currentCycle.duration,
        easing: Easing.inOut(Easing.ease),
      });

      // Move to next phase after duration
      const timer = setTimeout(() => {
        if (currentCycleIndex < BREATHING_CYCLES.length - 1) {
          setCurrentCycleIndex(currentCycleIndex + 1);
        } else {
          setCurrentCycleIndex(0);
          setCycleCount(cycleCount + 1);
        }
      }, currentCycle.duration);

      return () => clearTimeout(timer);
    };

    animateBreathing();
  }, [currentCycleIndex, isActive, currentCycle.phase, currentCycle.duration]);

  const handleExit = () => {
    setIsActive(false);
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  return (
    <ScreenContainer className="bg-background">
      <View className="flex-1 justify-between px-6 py-8">
        {/* Header */}
        <View className="items-center gap-4">
          <Text className="text-3xl font-bold text-foreground">
            {t("breathing.title")}
          </Text>
          <Text className="text-sm text-muted">
            {t("breathing.title")} • Cycle {cycleCount + 1}
          </Text>
        </View>

        {/* Animated Circle */}
        <View className="items-center justify-center flex-1 gap-8">
          <Animated.View
            style={[
              {
                width: 150,
                height: 150,
                borderRadius: 75,
                backgroundColor: colors.primary,
              },
              animatedStyle,
            ]}
          />

          {/* Instruction Text */}
          <View className="items-center gap-2">
            <Text className="text-2xl font-bold text-foreground text-center">
              {t(currentCycle.label)}
            </Text>
            <Text className="text-sm text-muted">
              {Math.ceil(currentCycle.duration / 1000)} {t("common.ok")}
            </Text>
          </View>
        </View>

        {/* Exit Button */}
        <Pressable
          onPress={handleExit}
          style={({ pressed }) => [
            {
              opacity: pressed ? 0.8 : 1,
              transform: [{ scale: pressed ? 0.97 : 1 }],
            },
          ]}
        >
          <View className="py-4 px-6 rounded-3xl bg-surface items-center border border-border">
            <Text className="text-lg font-bold text-foreground">
              {t("breathing.exit")}
            </Text>
          </View>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}
