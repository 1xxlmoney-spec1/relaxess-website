
import { ScreenContainer } from "@/components/screen-container";
import { useAppContext } from "@/lib/app-context";
import { useTranslation } from "@/lib/i18n";
import { useRouter } from "expo-router";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";
import { useState, useEffect } from "react";
import { ScrollView, View, Text, Pressable, KeyboardAvoidingView, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";

interface BodyScanStep {
  icon: string;
  titleKey: string;
  descriptionKey: string;
}

const BODY_SCAN_STEPS: BodyScanStep[] = [
  {
    icon: "🙂",
    titleKey: "bodyScan.step1Title",
    descriptionKey: "bodyScan.step1Description",
  },
  {
    icon: "🫶",
    titleKey: "bodyScan.step2Title",
    descriptionKey: "bodyScan.step2Description",
  },
  {
    icon: "💪",
    titleKey: "bodyScan.step3Title",
    descriptionKey: "bodyScan.step3Description",
  },
  {
    icon: "❤️",
    titleKey: "bodyScan.step4Title",
    descriptionKey: "bodyScan.step4Description",
  },
  {
    icon: "🌿",
    titleKey: "bodyScan.step5Title",
    descriptionKey: "bodyScan.step5Description",
  },
  {
    icon: "🦵",
    titleKey: "bodyScan.step6Title",
    descriptionKey: "bodyScan.step6Description",
  },
];

export default function BodyScanScreen() {
  const { incrementMessageCount, language } = useAppContext();
  const { t } = useTranslation(language);
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const [currentStepIndex, setCurrentStepIndex] = useState(-1); // -1 = intro, 0-5 = steps, 6 = completion
  const [isCompleted, setIsCompleted] = useState(false);

  // Animation for completion message
  const completionMessageOpacity = useSharedValue(0);
  
  // Animation for step instruction text
  const stepTextOpacity = useSharedValue(0);

  const animatedCompletionStyle = useAnimatedStyle(() => ({
    opacity: completionMessageOpacity.value,
  }));
  
  const animatedStepTextStyle = useAnimatedStyle(() => ({
    opacity: stepTextOpacity.value,
  }));

  // Trigger fade-in animation when completed
  useEffect(() => {
    if (isCompleted) {
      completionMessageOpacity.value = withTiming(1, {
        duration: 1200,
        easing: Easing.inOut(Easing.ease),
      });
    }
  }, [isCompleted]);
  
  // Trigger fade-in animation for step text
  useEffect(() => {
    if (currentStepIndex >= 0) {
      stepTextOpacity.value = 0;
      stepTextOpacity.value = withTiming(1, {
        duration: 600,
        easing: Easing.inOut(Easing.ease),
      });
    }
  }, [currentStepIndex]);

  const isIntroScreen = currentStepIndex === -1;
  const isCompletionScreen = isCompleted;
  const currentStep = currentStepIndex >= 0 ? BODY_SCAN_STEPS[currentStepIndex] : null;
  const progressPercentage = isIntroScreen ? 0 : ((currentStepIndex + 1) / BODY_SCAN_STEPS.length) * 100;

  const handleStart = () => {
    setCurrentStepIndex(0);
    incrementMessageCount();
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleNext = () => {
    if (currentStepIndex < BODY_SCAN_STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      incrementMessageCount();
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } else {
      // Completed all steps
      handleComplete();
    }
  };

  const handleComplete = () => {
    setIsCompleted(true);
    incrementMessageCount();
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleRepeat = () => {
    setCurrentStepIndex(0);
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
  if (isCompletionScreen) {
    return (
      <ScreenContainer className="bg-background" edges={["top", "left", "right"]}>
        <View className="flex-1 justify-between px-6 py-8">
          {/* Header */}
          <View className="gap-2 pt-24">
            <Text className="text-3xl font-bold text-foreground">
              {t('bodyScan.title')}
            </Text>
            <Text className="text-sm text-muted">
              {t('bodyScan.subtitle')}
            </Text>
          </View>

          {/* Completion Message */}
          <Animated.View
            style={[
              { flex: 1, justifyContent: "center", alignItems: "center", gap: 24 },
              animatedCompletionStyle,
            ]}
          >
            <Text className="text-5xl">✨</Text>
            <Text className="text-4xl font-bold text-foreground text-center">
              {t('bodyScan.completionTitle')}
            </Text>
            <Text className="text-2xl font-medium text-foreground text-center leading-relaxed px-4">
              {t('bodyScan.completionMessage')}
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
                    {t('bodyScan.repeat')}
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
                    {t('bodyScan.done')}
                  </Text>
                </View>
              </Pressable>
            </View>
          </View>
        </View>
      </ScreenContainer>
    );
  }

  // Introduction Screen
  if (isIntroScreen) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScreenContainer className="bg-background" edges={["top", "left", "right"]}>
          <View className="flex-1 justify-between px-6 py-8">
            {/* Header */}
            <View className="gap-2 pt-24">
              <Text className="text-3xl font-bold text-foreground">
                {t('bodyScan.title')}
              </Text>
              <Text className="text-sm text-muted">
                {t('bodyScan.subtitle')}
              </Text>
            </View>

            {/* Progress */}
            <View className="gap-3 mb-8">
              <Text className="text-sm font-medium text-muted">
                {t('bodyScan.progress', { current: '0', total: BODY_SCAN_STEPS.length.toString() })}
              </Text>
              <View className="h-2 bg-surface rounded-full overflow-hidden">
                <View
                  style={{
                    width: "0%",
                    backgroundColor: colors.primary,
                    height: "100%",
                  }}
                  className="rounded-full"
                />
              </View>
            </View>

            {/* Content */}
            <View className="flex-1 justify-start gap-4 pt-4">
              {/* Illustration at Top */}
              <View className="items-center gap-1">
                <Text className="text-5xl">🧘</Text>
                <Text className="text-lg font-semibold text-foreground text-center">
                  {t('bodyScan.introTitle')}
                </Text>
              </View>

              {/* Introduction Text */}
              <View className="gap-2 px-2">
                <Text className="text-sm text-foreground text-center leading-snug">
                  {t('bodyScan.introText1')}
                </Text>
                <Text className="text-sm text-foreground text-center leading-snug">
                  {t('bodyScan.introText2')}
                </Text>
                <Text className="text-sm text-foreground text-center leading-snug">
                  {t('bodyScan.introText3')}
                </Text>
                <Text className="text-sm text-foreground text-center leading-snug">
                  {t('bodyScan.introText4')}
                </Text>
              </View>
            </View>

            {/* Navigation Buttons */}
            <View className="gap-3">
              <View className="flex-row gap-3">
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
                      {t('common.back')}
                    </Text>
                  </View>
                </Pressable>

                <Pressable
                  onPress={handleStart}
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
                      {t('common.start')}
                    </Text>
                  </View>
                </Pressable>
              </View>
            </View>
          </View>
        </ScreenContainer>
      </KeyboardAvoidingView>
    );
  }

  // Step Screen
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScreenContainer className="bg-background" edges={["top", "left", "right"]}>
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View className="flex-1 justify-between px-6 py-8">
            {/* Header */}
            <View className="gap-2 pt-24">
              <Text className="text-3xl font-bold text-foreground">
                {t('bodyScan.title')}
              </Text>
              <Text className="text-sm text-muted">
                {t('bodyScan.subtitle')}
              </Text>
            </View>

            {/* Progress Section */}
            <View className="gap-3 mb-8">
              <Text className="text-sm font-medium text-muted">
                {t('bodyScan.progress', { current: (currentStepIndex + 1).toString(), total: BODY_SCAN_STEPS.length.toString() })}
              </Text>
              <View className="h-2 bg-surface rounded-full overflow-hidden">
                <View
                  style={{
                    width: `${progressPercentage}%`,
                    backgroundColor: colors.primary,
                    height: "100%",
                  }}
                  className="rounded-full"
                />
              </View>
            </View>

            {/* Step Content */}
            <View className="flex-1 justify-center gap-6 py-8">
              {currentStep && (
                <>
                  <View className="items-center gap-4">
                    <Text className="text-6xl">{currentStep.icon}</Text>
                    <Text className="text-2xl font-bold text-foreground text-center">
                      {t(currentStep.titleKey)}
                    </Text>
                  </View>

                  <Animated.View 
                    className="p-5 rounded-3xl bg-surface border border-border"
                    style={animatedStepTextStyle}
                  >
                    <Text className="text-base text-foreground text-center leading-relaxed font-medium">
                      {t(currentStep.descriptionKey)}
                    </Text>
                  </Animated.View>
                </>
              )}
            </View>

            {/* Navigation Buttons */}
            <View className="gap-3">
              <View className="flex-row gap-3">
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
                      {t('common.back')}
                    </Text>
                  </View>
                </Pressable>

                <Pressable
                  onPress={handleNext}
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
                      {currentStepIndex === BODY_SCAN_STEPS.length - 1
                        ? t('bodyScan.finish')
                        : t('common.next')}
                    </Text>
                  </View>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </ScreenContainer>
    </KeyboardAvoidingView>
  );
}
