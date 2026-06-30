import { View, Text, Pressable, Platform } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useAppContext } from "@/lib/app-context";
import { useTranslation } from "@/lib/i18n";
import { useRouter } from "expo-router";
import { useColors } from "@/hooks/use-colors";
import { useState, useEffect, useRef } from "react";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
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

// Calculate total cycle duration
const TOTAL_CYCLE_DURATION = BREATHING_CYCLES.reduce((sum, cycle) => sum + cycle.duration, 0);

export default function BreathingScreen() {
  const { language } = useAppContext();
  const { t } = useTranslation(language);
  const router = useRouter();
  const colors = useColors();

  const [currentCycleIndex, setCurrentCycleIndex] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [isActive, setIsActive] = useState(true);

  // Use refs to track state without triggering re-renders
  const cycleIndexRef = useRef(0);
  const cycleCountRef = useRef(0);
  const animationStartTimeRef = useRef(0);
  const sessionStartTimeRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Single persistent shared animation value - GPU accelerated
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.6);
  const completionMessageOpacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const currentCycle = BREATHING_CYCLES[currentCycleIndex];
  const isCompleted = cycleCount >= 10;

  // True continuous animation loop using withSequence for infinite repetition
  useEffect(() => {
    if (!isActive) return;

    // Create the complete breathing cycle animation sequence
    const createBreathingSequence = () => {
      return withSequence(
        // Inhale: scale up to 1.5, opacity to 0.6
        withTiming(1.5, {
          duration: BREATHING_CYCLES[0].duration,
          easing: Easing.inOut(Easing.ease),
        }),
        // Hold: keep scale at 1.5, opacity up to 0.8
        withTiming(1.5, {
          duration: BREATHING_CYCLES[1].duration,
          easing: Easing.inOut(Easing.ease),
        }),
        // Exhale: scale down to 1, opacity back to 0.6
        withTiming(1, {
          duration: BREATHING_CYCLES[2].duration,
          easing: Easing.inOut(Easing.ease),
        })
      );
    };

    // Start the continuous animation loop
    const startAnimation = () => {
      if (sessionStartTimeRef.current === 0) {
        sessionStartTimeRef.current = Date.now();
      }

      animationStartTimeRef.current = Date.now();
      scale.value = createBreathingSequence();
    };

    // Update UI state independently from animation
    const updateUIState = () => {
      const elapsed = Date.now() - sessionStartTimeRef.current;
      const cycleProgress = elapsed % TOTAL_CYCLE_DURATION;

      let newCycleIndex = 0;
      let phaseTime = 0;

      for (let i = 0; i < BREATHING_CYCLES.length; i++) {
        if (cycleProgress < phaseTime + BREATHING_CYCLES[i].duration) {
          newCycleIndex = i;
          break;
        }
        phaseTime += BREATHING_CYCLES[i].duration;
      }

      cycleIndexRef.current = newCycleIndex;

      const newCycleCount = Math.floor(
        elapsed / TOTAL_CYCLE_DURATION
      );

      if (newCycleCount !== cycleCountRef.current) {
        cycleCountRef.current = newCycleCount;
        setCycleCount(newCycleCount);

        if (newCycleCount >= 10) {
          cycleCountRef.current = 10;
          setCycleCount(10);

          setIsActive(false);

          if (timerRef.current) {
            clearTimeout(timerRef.current);
          }

          return;
        }
      }

      setCurrentCycleIndex(newCycleIndex);
    };

    startAnimation();

    // Update UI state periodically without restarting animation
    const uiUpdateInterval = setInterval(updateUIState, 100);

    // Restart animation sequence when it completes (for infinite loop)
    const restartAnimation = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        if (isActive) {
          startAnimation();
          restartAnimation();
        }
      }, TOTAL_CYCLE_DURATION);
    };

    restartAnimation();

    return () => {
      clearInterval(uiUpdateInterval);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isActive]);

  // Update opacity independently to match current phase
  useEffect(() => {
    const cycle = BREATHING_CYCLES[currentCycleIndex];
    const targetOpacity = cycle.phase === "hold" ? 0.8 : 0.6;

    opacity.value = withTiming(targetOpacity, {
      duration: 100,
      easing: Easing.linear,
    });
  }, [currentCycleIndex]);

  // Fade in completion message when session completes
  useEffect(() => {
    if (isCompleted) {
      completionMessageOpacity.value = withTiming(1, {
        duration: 1200,
        easing: Easing.inOut(Easing.ease),
      });
    }
  }, [isCompleted]);

  const handleExit = () => {
    setIsActive(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  const handleRepeat = () => {
    setCycleCount(0);

    cycleCountRef.current = 0;

    sessionStartTimeRef.current = Date.now();

    setCurrentCycleIndex(0);

    setIsActive(true);

    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  return (
    <ScreenContainer className="bg-background">
      <View className="flex-1 justify-between px-6 py-8">
        {/* Header */}
        <View className="items-center gap-4 pt-24">
          <Text className="text-3xl font-bold text-foreground">
            {t("breathing.title")}
          </Text>
          {!isCompleted && (
            <Text className="text-sm text-muted">
              {t('breathing.completedCycles', { count: cycleCount.toString() })}
            </Text>
          )}
        </View>

        {/* Animated Circle or Completion Message */}
        {isCompleted ? (
          <Animated.View
            style={[
              { flex: 1, justifyContent: "center", alignItems: "center", gap: 24 },
              { opacity: completionMessageOpacity.value },
            ]}
          >
            <Text className="text-4xl font-bold text-foreground text-center">
              {t('breathing.excellent')}
            </Text>
            <Text className="text-2xl font-medium text-foreground text-center leading-relaxed px-4">
              {t('breathing.completionMessage')}
            </Text>
          </Animated.View>
        ) : (
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
                {Math.ceil(currentCycle.duration / 1000)} sec
              </Text>
            </View>
          </View>
        )}

        {/* Buttons */}
        <View className="gap-3">
          {isCompleted ? (
            <>
              {/* Side-by-side buttons for completion state */}
              <View className="flex-row gap-3">
                <Pressable
                  onPress={handleRepeat}
                  style={({ pressed }) => [
                    { flex: 1 },
                    {
                      opacity: pressed ? 0.8 : 1,
                      transform: [{ scale: pressed ? 0.97 : 1 }],
                    },
                  ]}
                >
                  <View className="py-4 px-6 rounded-3xl bg-primary items-center border border-border">
                    <Text className="text-lg font-bold text-background">
                      {t('breathing.repeatSession')}
                    </Text>
                  </View>
                </Pressable>
                <Pressable
                  onPress={handleExit}
                  style={({ pressed }) => [
                    { flex: 1 },
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
            </>
          ) : (
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
          )}
        </View>
      </View>
    </ScreenContainer>
  );
}
