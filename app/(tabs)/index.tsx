import { ScrollView, Text, View, Pressable, Platform } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useAppContext } from "@/lib/app-context";
import { useTranslation } from "@/lib/i18n";
import { useRouter } from "expo-router";
import { useColors } from "@/hooks/use-colors";
import { cn } from "@/lib/utils";
import * as Haptics from "expo-haptics";
import { useState, useRef, useEffect } from "react";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { DevTestingPanel } from "@/lib/dev-testing-panel";

const MOODS = [
  { id: "anxiety", key: "home.mood.anxiety" },
  { id: "stress", key: "home.mood.stress" },
  { id: "overthinking", key: "home.mood.overthinking" },
  { id: "sleep", key: "home.mood.sleep" },
  { id: "sadness", key: "home.mood.sadness" },
  { id: "relax", key: "home.mood.relax" },
];

export default function HomeScreen() {
  const { theme, setTheme, language, audioEnabled, setAudioEnabled, setSelectedMood } =
    useAppContext();
  const { t } = useTranslation(language);
  const router = useRouter();
  const colors = useColors();
  const [selectedMood, setLocalSelectedMood] = useState<string | null>(null);
  const [showDevPanel, setShowDevPanel] = useState(false);
  const sunTapCountRef = useRef(0);
  const sunTapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Dev panel trigger: tap sun icon 5 times within 2 seconds
  const handleSunIconTap = () => {
    sunTapCountRef.current += 1;

    if (sunTapCountRef.current === 1) {
      // First tap - start timer
      sunTapTimeoutRef.current = setTimeout(() => {
        sunTapCountRef.current = 0;
      }, 2000);
    }

    if (sunTapCountRef.current === 5) {
      // 5 taps detected - open dev panel
      setShowDevPanel(true);
      sunTapCountRef.current = 0;
      if (sunTapTimeoutRef.current) {
        clearTimeout(sunTapTimeoutRef.current);
      }
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (sunTapTimeoutRef.current) {
        clearTimeout(sunTapTimeoutRef.current);
      }
    };
  }, []);

  const handleMoodSelect = (moodId: string) => {
    setLocalSelectedMood(moodId);
    setSelectedMood(moodId);
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleStartSession = () => {
    if (!selectedMood) return;
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    router.push("/session");
  };

  const handleRelaxationTools = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push("/relaxation-tools");
  };

  const handleThemeToggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleAudioToggle = () => {
    setAudioEnabled(!audioEnabled);
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleThemeIconTap = () => {
    handleThemeToggle();
    handleSunIconTap(); // Tap counter for dev panel
  };

  return (
    <>
      <ScreenContainer className={theme === "dark" ? "" : "bg-background"}>
        <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
      >
        <View className="flex-1 px-6 py-8 justify-between">
          {/* Header with controls */}
          <View className="flex-row justify-between items-center mb-12">
            {/* Theme Toggle */}
            <Pressable
              onPress={handleThemeIconTap}
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.6 : 1,
                  transform: [{ scale: pressed ? 0.95 : 1 }],
                },
              ]}
              className="p-2"
            >
              <Text className="text-sm font-semibold text-primary">
                {theme === "dark" ? "☀️" : "🌙"}
              </Text>
            </Pressable>

            {/* Audio Toggle */}
            <Pressable
              onPress={handleAudioToggle}
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.6 : 1,
                  transform: [{ scale: pressed ? 0.95 : 1 }],
                },
              ]}
              className="p-2"
            >
              <Text className="text-sm font-semibold text-primary">
                {audioEnabled ? "🔊" : "🔇"}
              </Text>
            </Pressable>
          </View>

          {/* Title Section */}
          <View className="items-center gap-4 mb-12">
            <Text className="text-3xl font-bold text-foreground text-center">
              {t("home.title")}
            </Text>
            <View className="h-1 w-16 bg-primary rounded-full" />
          </View>

          {/* Mood Selection Grid */}
          <View className="gap-3 mb-12">
            {MOODS.map((mood) => (
              <Pressable
                key={mood.id}
                onPress={() => handleMoodSelect(mood.id)}
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.8 : 1,
                    transform: [{ scale: pressed ? 0.97 : 1 }],
                  },
                ]}
              >
                <View
                  className={cn(
                    "py-4 px-6 rounded-2xl border-2 transition-all",
                    selectedMood === mood.id
                      ? "bg-primary border-primary"
                      : "bg-surface border-border"
                  )}
                >
                  <Text className="text-center text-lg font-semibold text-foreground">
                    {t(mood.key)}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>

          {/* Start Session Button */}
          <View className="gap-3">
            <Pressable
              onPress={handleStartSession}
              disabled={!selectedMood}
              style={({ pressed }) => [
                {
                  opacity: !selectedMood ? 0.5 : pressed ? 0.9 : 1,
                  transform: [{ scale: !selectedMood ? 1 : pressed ? 0.97 : 1 }],
                },
              ]}
            >
              <View
                className={cn(
                  "py-4 px-6 rounded-3xl items-center",
                  selectedMood ? "bg-primary" : "bg-muted"
                )}
              >
                <Text className="text-lg font-bold text-foreground">
                  {t("home.startSession")}
                </Text>
              </View>
            </Pressable>

            {/* Relaxation Tools Button */}
            <Pressable
              onPress={handleRelaxationTools}
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.8 : 1,
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                },
              ]}
            >
              <View className="py-3 px-6 rounded-2xl bg-surface border border-border items-center">
                <Text className="text-base font-semibold text-foreground">
                  🧘 {t("tools.title")}
                </Text>
              </View>
            </Pressable>

            {/* Disclaimer */}
            <Text className="text-xs text-muted text-center leading-relaxed">
              {t("settings.disclaimer")}
            </Text>
          </View>
        </View>
        </ScrollView>
      </ScreenContainer>

      <DevTestingPanel visible={showDevPanel} onClose={() => setShowDevPanel(false)} />
    </>
  );
}
