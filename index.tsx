import { ScrollView, Text, View, TouchableOpacity, Pressable, Platform } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useAppContext } from "@/lib/app-context";
import { useTranslation } from "@/lib/i18n";
import { useRouter } from "expo-router";
import { useColors } from "@/hooks/use-colors";
import { useAudio } from "@/lib/audio-context";
import { stopSound, getCurrentTrackId } from "@/lib/simple-audio";
import { cn } from "@/lib/utils";
import * as Haptics from "expo-haptics";
import { useState } from "react";
import { IconSymbol } from "@/components/ui/icon-symbol";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { RelaxessHeader } from "@/components/relaxess-header";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  const audio = useAudio();
  const { t } = useTranslation(language);
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [selectedMood, setLocalSelectedMood] = useState<string | null>(null);



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

  const handleAudioToggle = async () => {
    try {
      const newAudioState = !audioEnabled;
      await setAudioEnabled(newAudioState);
      
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch (error) {
      console.error('[HomeScreen] Audio toggle error:', error);
    }
  };



  return (
    <>
      <ScreenContainer className={theme === "dark" ? "" : "bg-background"}>
        <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        scrollEnabled={true}
        contentOffset={{ x: 0, y: 0 }}
      >
        <View className="px-6 py-4 gap-6 flex-1 justify-between">
          {/* Header with controls */}
          <View
            style={{
              height: 60,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingTop: insets.top + 12,
              paddingHorizontal: 0,
              marginBottom: 16,
            }}
          >
            {/* Theme Toggle - Premium Apple VisionOS Style */}
            <Pressable
              onPress={handleThemeToggle}
              style={({ pressed }) => [
                {
                  width: 42,
                  height: 42,
                  borderRadius: 21,
                  backgroundColor: theme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.72)",
                  borderWidth: 1,
                  borderColor: theme === "dark" ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.90)",
                  justifyContent: "center",
                  alignItems: "center",
                  transform: [{ scale: pressed ? 0.94 : 1 }],
                  shadowColor: theme === "dark" ? "#7FDFFF" : "#7A9AB0",
                  shadowOpacity: theme === "dark" ? 0.22 : 0.16,
                  shadowRadius: theme === "dark" ? 16 : 18,
                  shadowOffset: theme === "dark" ? { width: 0, height: 6 } : { width: 0, height: 8 },
                  overflow: "hidden",
                },
              ]}
            >
              {/* Internal glass highlight - reflected daylight (light theme only) */}
              {theme !== "dark" && (
                <View
                  style={{
                    position: "absolute",
                    top: 3,
                    left: 4,
                    right: 4,
                    height: 11,
                    backgroundColor: "rgba(255,255,255,0.60)",
                    borderRadius: 8,
                    opacity: 0.85,
                  }}
                />
              )}
              {/* Lower refraction layer - liquid glass effect (light theme only) */}
              {theme !== "dark" && (
                <View
                  style={{
                    position: "absolute",
                    bottom: 5,
                    left: 6,
                    right: 6,
                    height: 8,
                    backgroundColor: "rgba(180,220,240,0.18)",
                    borderRadius: 8,
                    opacity: 0.55,
                  }}
                />
              )}
              {/* Inner highlight reflection - dark theme only */}
              {theme === "dark" && (
                <View
                  style={{
                    position: "absolute",
                    top: 1,
                    left: 4,
                    right: 4,
                    height: 12,
                    backgroundColor: "rgba(255,255,255,0.12)",
                    borderRadius: 20,
                    opacity: 0.45,
                  }}
                />
              )}
              {/* Icon - centered and clearly visible */}
              <MaterialIcons
                name={theme === "dark" ? "wb-sunny" : "nightlight-round"}
                size={theme === "dark" ? 22 : 18}
                color={theme === "dark" ? "#FFE6A8" : "#48606F"}
              />
            </Pressable>

            {/* Relaxess Header */}
            <RelaxessHeader />
          </View>

          {/* Title Section */}
          <View className="items-center gap-2 mb-2">
            <Text className="text-2xl font-bold text-foreground text-center">
              {t("home.title")}
            </Text>
            <View className="h-1 w-16 bg-primary rounded-full" />
          </View>

          {/* Mood Selection Grid */}
          <View className="gap-3 mb-2">
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
                    "py-3 px-6 rounded-2xl border-2 transition-all",
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
                  "py-3 px-6 rounded-3xl items-center",
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
            <Text className="text-xs text-muted text-center leading-tight">
              {t("settings.disclaimer")}
            </Text>
          </View>
        </View>
        </ScrollView>
      </ScreenContainer>


    </>
  );
}
