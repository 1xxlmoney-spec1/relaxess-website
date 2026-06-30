import { ScrollView, Text, View, Pressable, TextInput, Platform, KeyboardAvoidingView } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useAppContext } from "@/lib/app-context";
import { useTranslation } from "@/lib/i18n";
import { useRouter } from "expo-router";
import { useColors } from "@/hooks/use-colors";
import { cn } from "@/lib/utils";
import * as Haptics from "expo-haptics";
import { useState, useRef } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  const { language, incrementMessageCount } = useAppContext();
  const { t } = useTranslation(language);
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [userResponses, setUserResponses] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const scrollViewRef = useRef<ScrollView>(null);

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
    // TODO: Show completion message
    router.back();
  };

  const handleExit = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

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
        <View className="flex-row justify-between items-center px-6 py-4 border-b border-border">
          <Pressable
            onPress={handleExit}
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.6 : 1,
              },
            ]}
          >
            <Text className="text-primary font-semibold">{t("common.back")}</Text>
          </Pressable>

          <Text className="text-lg font-bold text-foreground">
            {t("grounding.title")}
          </Text>

          <Text className="text-sm text-muted">
            {currentStepIndex + 1}/{GROUNDING_STEPS.length}
          </Text>
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
                Your Responses
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
              Take your time. There are no right or wrong answers. Just notice what's around you and within you.
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
              placeholder={`${currentStep.number} thing${currentStep.number !== 1 ? "s" : ""}...`}
              placeholderTextColor={colors.muted}
              multiline
              maxLength={200}
              className={cn(
                "flex-1 px-4 py-3 rounded-2xl text-foreground",
                "bg-surface"
              )}
              style={{
                maxHeight: 80,
                color: colors.foreground,
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
