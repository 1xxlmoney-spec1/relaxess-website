import { View, Text, Pressable, ScrollView, Image, Platform } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useAppContext } from "@/lib/app-context";
import { useTranslation } from "@/lib/i18n";
import { useMemo, useState, useEffect, useRef } from "react";
import { useRouter } from "expo-router";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";

type VisualizationEnvironment = "ocean" | "rain" | "forest" | "fireplace" | "crickets" | "purring" | "custom";

interface EnvironmentOption {
  id: VisualizationEnvironment;
  icon: string;
  title: string;
  description: string;
  imageUrl: string;
  guidedText: string;
}

const getEnvironments = (t: (key: string) => string) => [
  {
    id: "ocean" as const,
    icon: "🌊",
    title: t('safePlace.beach.title'),
    description: t('safePlace.beach.description'),
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663634810326/cLCRG6KQTTAEtGgCLZTdkj/safe-place-ocean-g3DKc3LAsnA3rcmHqwLWmj.webp",
    guidedText: t('safePlace.beach.guidedText'),
  },
  {
    id: "rain" as const,
    icon: "🌧️",
    title: t('safePlace.rain.title'),
    description: t('safePlace.rain.description'),
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663634810326/cLCRG6KQTTAEtGgCLZTdkj/safe-place-rain-iAJHnQUR3Gtat2enqu2zMA.webp",
    guidedText: t('safePlace.rain.guidedText'),
  },
  {
    id: "forest" as const,
    icon: "🌲",
    title: t('safePlace.forest.title'),
    description: t('safePlace.forest.description'),
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663634810326/cLCRG6KQTTAEtGgCLZTdkj/safe-place-forest-mrLtiMiCXg2PP5WPvwxrfX.webp",
    guidedText: t('safePlace.forest.guidedText'),
  },
  {
    id: "fireplace" as const,
    icon: "🔥",
    title: t('safePlace.fireplace.title'),
    description: t('safePlace.fireplace.description'),
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663634810326/cLCRG6KQTTAEtGgCLZTdkj/safe-place-fireplace-QwvBU88DrvxyQorYDQ4xoX.webp",
    guidedText: t('safePlace.fireplace.guidedText'),
  },
  {
    id: "crickets" as const,
    icon: "🦗",
    title: t('safePlace.crickets.title'),
    description: t('safePlace.crickets.description'),
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663634810326/cLCRG6KQTTAEtGgCLZTdkj/safe-place-crickets-338ewbLFvDpydRLxNYCjbe.webp",
    guidedText: t('safePlace.crickets.guidedText'),
  },
  {
    id: "purring" as const,
    icon: "🐱",
    title: t('safePlace.purring.title'),
    description: t('safePlace.purring.description'),
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663634810326/cLCRG6KQTTAEtGgCLZTdkj/sleeping-cat-cozy-room-hq-jGd3mp7zWsonUDtn9w5D9E.png",
    guidedText: t('safePlace.purring.guidedText'),
  },
  {
    id: "custom" as const,
    icon: "✨",
    title: t('safePlace.custom.title'),
    description: t('safePlace.custom.description'),
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663634810326/cLCRG6KQTTAEtGgCLZTdkj/safe-place-abstract-WwHZG9STAthx63LWbjivVt.webp",
    guidedText: t('safePlace.custom.guidedText'),
  },
];

type ScreenState = "intro" | "select" | "visualization" | "relax" | "completion";

export default function SafePlaceVisualizationScreen() {
  const { language } = useAppContext();
  const { t } = useTranslation(language);
  const router = useRouter();
  const colors = useColors();

  const [currentScreen, setCurrentScreen] = useState<ScreenState>("intro");
  const [selectedEnvironment, setSelectedEnvironment] = useState<VisualizationEnvironment | null>(null);
  const environments = useMemo(() => getEnvironments(t), [t]);

  // Animation values
  const contentOpacity = useSharedValue(0);
  const completionMessageOpacity = useSharedValue(0);

  useEffect(() => {
    // Fade in content when screen changes
    contentOpacity.value = 0;
    contentOpacity.value = withTiming(1, {
      duration: 600,
      easing: Easing.inOut(Easing.ease),
    });
  }, [currentScreen]);

  useEffect(() => {
    // Fade in completion message
    if (currentScreen === "completion") {
      completionMessageOpacity.value = 0;
      completionMessageOpacity.value = withTiming(1, {
        duration: 1200,
        easing: Easing.inOut(Easing.ease),
      });
    }
  }, [currentScreen]);

  const animatedContentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  const animatedCompletionStyle = useAnimatedStyle(() => ({
    opacity: completionMessageOpacity.value,
  }));

  const handleStart = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setCurrentScreen("select");
  };

  const handleSelectEnvironment = (envId: VisualizationEnvironment) => {
    setSelectedEnvironment(envId);
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setCurrentScreen("visualization");
  };

  const handleContinueToRelax = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setCurrentScreen("relax");
  };

  const handleFinish = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setCurrentScreen("completion");
  };

  const handleRepeat = () => {
    setCurrentScreen("intro");
    setSelectedEnvironment(null);
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleDone = () => {
    router.back();
  };



  const renderIntroScreen = () => (
    <Animated.View style={animatedContentStyle} className="flex-1 justify-center items-center gap-6 px-6">
      <Text className="text-5xl">🌄</Text>
      <Text className="text-3xl font-bold text-foreground text-center">{t('safePlace.title')}</Text>
      <Text className="text-lg text-muted text-center leading-relaxed">
        {t('safePlace.introduction')}
      </Text>
      <Pressable
        onPress={handleStart}
        style={({ pressed }) => [
          {
            opacity: pressed ? 0.8 : 1,
            transform: [{ scale: pressed ? 0.97 : 1 }],
          },
        ]}
      >
        <View className="py-4 px-8 rounded-3xl bg-primary items-center">
          <Text className="text-lg font-bold text-background">{t('safePlace.start')}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );

  const renderSelectScreen = () => (
    <Animated.View style={animatedContentStyle} className="flex-1">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="px-6 pb-20">
          <View className="mb-8">
            <Text className="text-2xl font-bold text-foreground mb-2">{t('safePlace.choosePlace')}</Text>
            <Text className="text-muted">{t('safePlace.choosePlaceDescription')}</Text>
          </View>
          <View className="gap-4">
            {environments.map((env) => (
              <Pressable
                key={env.id}
                onPress={() => handleSelectEnvironment(env.id)}
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.8 : 1,
                    transform: [{ scale: pressed ? 0.97 : 1 }],
                  },
                ]}
              >
                <View className="mb-4 rounded-2xl overflow-hidden border border-border bg-surface">
                  <Image
                    source={{ uri: env.imageUrl }}
                    style={{ width: "100%", height: 160 }}
                    resizeMode="cover"
                  />
                  <View className="p-4">
                    <View className="flex-row items-center gap-3 mb-2">
                      <Text className="text-3xl">{env.icon}</Text>
                      <Text className="text-xl font-bold text-foreground">{env.title}</Text>
                    </View>
                    <Text className="text-muted text-sm">{env.description}</Text>
                  </View>
                </View>
              </Pressable>
          ))}
          </View>
        </View>
      </ScrollView>
    </Animated.View>
  );

  const renderVisualizationScreen = () => {
    const environment = environments.find((e: EnvironmentOption) => e.id === selectedEnvironment);
    if (!environment) return null;

    return (
      <Animated.View style={animatedContentStyle} className="flex-1 justify-center items-center px-6 gap-6">
        <Image
          source={{ uri: environment.imageUrl }}
          style={{ width: 200, height: 200 }}
          resizeMode="cover"
          className="rounded-2xl"
        />
        <View className="bg-surface rounded-2xl p-6 gap-4">
          <Text className="text-2xl font-bold text-foreground text-center">{environment.title}</Text>
          <Text className="text-lg text-foreground text-center leading-relaxed">{environment.guidedText}</Text>
        </View>
        <Pressable
          onPress={handleContinueToRelax}
          style={({ pressed }) => [
            {
              opacity: pressed ? 0.8 : 1,
              transform: [{ scale: pressed ? 0.97 : 1 }],
            },
          ]}
        >
          <View className="py-4 px-8 rounded-3xl bg-primary items-center">
            <Text className="text-lg font-bold text-background">{t('safePlace.continue')}</Text>
          </View>
        </Pressable>
      </Animated.View>
    );
  };

  const renderRelaxScreen = () => (
    <Animated.View style={animatedContentStyle} className="flex-1 justify-center items-center px-6 gap-6">
      <Text className="text-5xl">🧘</Text>
      <Text className="text-3xl font-bold text-foreground text-center">{t('safePlace.stay')}</Text>
      <Text className="text-lg text-muted text-center leading-relaxed">
        {t('safePlace.stayDescription')}
      </Text>
      <Pressable
        onPress={handleFinish}
        style={({ pressed }) => [
          {
            opacity: pressed ? 0.8 : 1,
            transform: [{ scale: pressed ? 0.97 : 1 }],
          },
        ]}
      >
        <View className="py-4 px-8 rounded-3xl bg-primary items-center">
          <Text className="text-lg font-bold text-background">{t('safePlace.continue')}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );

  const renderCompletionScreen = () => (
    <Animated.View style={animatedCompletionStyle} className="flex-1 justify-center items-center px-6 gap-6">
      <Text className="text-5xl">✨</Text>
      <Text className="text-3xl font-bold text-foreground text-center">{t('safePlace.complete')}</Text>
      <Text className="text-lg text-muted text-center leading-relaxed">
        {t('safePlace.completeDescription')}
      </Text>
      <View className="flex-row gap-3 w-full">
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
            <Text className="text-lg font-bold text-background">{t('safePlace.repeat')}</Text>
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
            <Text className="text-lg font-bold text-foreground">{t('safePlace.done')}</Text>
          </View>
        </Pressable>
      </View>
    </Animated.View>
  );

  return (
    <ScreenContainer className="pt-24">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="px-6 pb-20">
          {currentScreen === "intro" && renderIntroScreen()}
          {currentScreen === "select" && renderSelectScreen()}
          {currentScreen === "visualization" && renderVisualizationScreen()}
          {currentScreen === "relax" && renderRelaxScreen()}
          {currentScreen === "completion" && renderCompletionScreen()}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
