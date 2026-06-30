import { ScrollView, Text, View, Pressable, TextInput, Platform, KeyboardAvoidingView } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useAppContext } from "@/lib/app-context";
import { useTranslation } from "@/lib/i18n";
import { useRouter } from "expo-router";
import { useColors } from "@/hooks/use-colors";
import { cn } from "@/lib/utils";
import * as Haptics from "expo-haptics";
import { useState, useRef, useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";

interface GroundingStep {
  number: number;
  key: string;
  icon: string;
}

const GROUNDING_STEPS: GroundingStep[] = [
  { number: 5, key: "grounding.step1", icon: "👀" },
  { number: 4, key: "grounding.step2", icon: "✋" },
  { number: 3, key: "grounding.step3", icon: "👂" },
  { number: 2, key: "grounding.step4", icon: "👃" },
  { number: 1, key: "grounding.step5", icon: "❤️" },
];

export default function GroundingScreen() {
  const { theme, language, incrementMessageCount } = useAppContext();
  const { t } = useTranslation(language);
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [userResponses, setUserResponses] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Animation for completion message
  const completionMessageOpacity = useSharedValue(0);

  const animatedCompletionStyle = useAnimatedStyle(() => ({
    opacity: completionMessageOpacity.value,
  }))

  // Trigger fade-in animation when completed
  useEffect(() => {
    if (isCompleted) {
      completionMessageOpacity.value = withTiming(1, {
        duration: 1200,
        easing: Easing.inOut(Easing.ease),
      });
    }
  }, [isCompleted]);

  const currentStep = GROUNDING_STEPS[currentStepIndex];
  const isLastStep = currentStepIndex === GROUNDING_STEPS.length - 1;

  const handleAddResponse = () => {
    if (!inputValue.trim()) return;

    const newResponses = [...userResponses, inputValue.trim()];
    setUserResponses(newResponses);
    setInputValue("");
    incrementMessageCount();

    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    // Move to next step or complete
    if (isLastStep) {
      handleComplete();
    } else {
      setCurrentStepIndex(currentStepIndex + 1);
    }

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleComplete = () => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setIsCompleted(true);
  };

  const handleRepeat = () => {
    setCurrentStepIndex(0);
    setUserResponses([]);
    setInputValue("");
    setIsCompleted(false);
    completionMessageOpacity.value = 0;
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleDone = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  const handleExit = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  // Completion Screen
  if (isCompleted) {
    return (
      <ScreenContainer className="bg-background" edges={["top", "left", "right"]}>
        <View className="flex-1 justify-between px-6 py-8">
          {/* Header */}
          <View className="gap-2 pt-24">
            <Text className="text-3xl font-bold text-foreground">
              {t('grounding.title')}
            </Text>
            <Text className="text-sm text-muted">
              {t('grounding.subtitle')}
            </Text>
          </View>

          {/* Completion Message */}
          <Animated.View
            style={[
              { flex: 1, justifyContent: "center", alignItems: "center", gap: 24 },
              animatedCompletionStyle,
            ]}
          >
            <Text className="text-4xl font-bold text-foreground text-center">
              {t('grounding.completionTitle')}
            </Text>
            <Text className="text-2xl font-medium text-foreground text-center leading-relaxed px-4">
              {t('grounding.completionMessage')}
            </Text>
          </Animated.View>

          {/* Completion Buttons */}
          <View className="gap-3">
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
                    {t('grounding.repeatExercise')}
                  </Text>
                </View>
              </Pressable>

              <Pressable
                onPress={handleDone}
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
                    {t('grounding.done')}
                  </Text>
                </View>
              </Pressable>
            </View>
          </View>
        </View>
      </ScreenContainer>
    );
  }

  // Main Exercise Screen
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScreenContainer
        className="bg-background"
        edges={["top", "left", "right"]}
      >
        {/* Header */}
        <View
          className="flex-row items-center px-6 border-b border-border"
          style={{
            paddingTop: 70,
            paddingBottom: 12,
            minHeight: 120,
          }}
        >
          {/* LEFT */}
          <Pressable style={{ flex: 1 }} onPress={handleExit}>
            <Text className="text-primary font-semibold">
              {t("common.back")}
            </Text>
          </Pressable>

          {/* CENTER */}
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text
              numberOfLines={1}
              className="text-lg font-bold text-foreground text-center"
            >
              {t('grounding.title')}
            </Text>
          </View>

          {/* RIGHT */}
          <View style={{ flex: 1, alignItems: "flex-end" }}>
            <Text className="text-sm text-muted">
                {t('grounding.progress', { current: (currentStepIndex + 1).toString(), total: GROUNDING_STEPS.length.toString() })}
              </Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View className="h-1 bg-surface">
          <View
            className="h-full bg-primary"
            style={{
              width: `${((currentStepIndex + 1) / GROUNDING_STEPS.length) * 100}%`,
            }}
          />
        </View>

        {/* Content */}
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 px-6 py-8"
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          contentContainerStyle={{ paddingBottom: 16 }}
        >
          {/* Current Step */}
          <View className="items-center gap-6 mb-8">
            <Text className="text-5xl">{currentStep.icon}</Text>
            <View className="items-center gap-2">
              <Text className="text-2xl font-bold text-foreground text-center">
                {t(currentStep.key)}
              </Text>
              <Text className="text-sm text-muted">
                {t("grounding.progress", {
                  current: (currentStepIndex + 1).toString(),
                  total: GROUNDING_STEPS.length.toString(),
                })}
              </Text>
            </View>
          </View>

          {/* Previous Responses */}
          {userResponses.length > 0 && (
            <View className="gap-3 mb-8">
              <Text className="text-sm font-semibold text-muted uppercase">
                {t('grounding.yourResponses')}
              </Text>
              {userResponses.map((response, index) => (
                <View
                  key={index}
                  className="p-4 rounded-2xl bg-surface border border-border"
                >
                  <Text className="text-sm text-foreground leading-relaxed">
                    <Text className="font-semibold text-primary">
                      {GROUNDING_STEPS[index].number}:
                    </Text>{" "}
                    {response}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Instruction */}
          <View className="p-4 rounded-2xl bg-primary bg-opacity-10 border border-primary">
            <Text className="text-sm text-foreground text-center leading-relaxed">
              {t('grounding.instruction')}
            </Text>
          </View>
        </ScrollView>

        {/* Input Area */}
        <View
          className="px-6 py-4 border-t border-border"
          style={{ paddingBottom: Math.max(insets.bottom, 16) }}
        >
          <View className="flex-row gap-3 items-end">
            <TextInput
              value={inputValue}
              onChangeText={setInputValue}
              placeholder={t('grounding.findThings', { count: currentStep.number.toString() })}
              placeholderTextColor={colors.muted}
              multiline
              maxLength={200}
              className={cn(
                "flex-1 px-4 py-3 rounded-2xl",
                "bg-surface"
              )}
              style={{
                maxHeight: 80,
                color: theme === "dark" ? "#FFFFFF" : "#11181C",
                backgroundColor:
                  theme === "dark"
                    ? "rgba(255,255,255,0.12)"
                    : "#FFFFFF",
                borderWidth: 1,
                borderColor:
                  theme === "dark"
                    ? "rgba(255,255,255,0.25)"
                    : "#E5E7EB",
              }}
            />

            <Pressable
              onPress={handleAddResponse}
              disabled={!inputValue.trim()}
              style={({ pressed }) => [
                {
                  opacity: !inputValue.trim() ? 0.5 : pressed ? 0.8 : 1,
                  transform: [{ scale: pressed ? 0.95 : 1 }],
                },
              ]}
              className="p-3 bg-primary rounded-full items-center justify-center"
            >
              <Text className="text-background font-bold text-lg">✓</Text>
            </Pressable>
          </View>
        </View>
      </ScreenContainer>
    </KeyboardAvoidingView>
  );
}
