import { View, Text, Pressable, Platform, Animated } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useAppContext } from "@/lib/app-context";
import { useTranslation } from "@/lib/i18n";
import { useRouter } from "expo-router";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";
import { useState, useEffect, useRef } from "react";

export default function QuietModeScreen() {
  const { language, audioEnabled, currentAudioTrack, setCurrentAudioTrack, session } =
    useAppContext();
  const { t } = useTranslation(language);
  const router = useRouter();
  const colors = useColors();

  const [showControls, setShowControls] = useState(true);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Auto-hide controls after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setShowControls(false));
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleShowControls = () => {
    if (!showControls) {
      setShowControls(true);
      fadeAnim.setValue(1);
    }
  };

  const handleAudioTrackChange = (track: "relaxm2" | "forest" | "rain") => {
    if (!session.isPremium && track !== "relaxm2") return;
    setCurrentAudioTrack(track);
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleExit = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  const AUDIO_OPTIONS = [
    { id: "relaxm2", label: "Music", icon: "🎵" },
    { id: "forest", label: "Forest", icon: "🌲" },
    { id: "rain", label: "Rain", icon: "🌧️" },
  ];

  return (
    <ScreenContainer className="bg-background items-center justify-center">
      {/* Background Animation */}
      <View className="absolute inset-0 flex-1 items-center justify-center">
        <Animated.View
          style={{
            width: 200,
            height: 200,
            borderRadius: 100,
            backgroundColor: colors.primary,
            opacity: 0.1,
          }}
        />
      </View>

      {/* Content */}
      <View className="flex-1 items-center justify-center px-6 gap-8">
        <Text className="text-4xl font-bold text-foreground text-center">
          {t("quiet.title")}
        </Text>
        <Text className="text-lg text-muted text-center leading-relaxed">
          {t("quiet.description")}
        </Text>
      </View>

      {/* Controls - Fade in/out */}
      {showControls && (
        <Animated.View
          style={{ opacity: fadeAnim }}
          className="absolute bottom-0 left-0 right-0 px-6 py-8 gap-4"
        >
          {/* Audio Track Selection */}
          {session.isPremium && (
            <View className="gap-3">
              <Text className="text-sm font-semibold text-muted text-center uppercase">
                {t("session.audioLabel")}
              </Text>
              <View className="flex-row gap-3 justify-center">
                {AUDIO_OPTIONS.map((option) => (
                  <Pressable
                    key={option.id}
                    onPress={() =>
                      handleAudioTrackChange(option.id as "relaxm2" | "forest" | "rain")
                    }
                    style={({ pressed }) => [
                      {
                        opacity:
                          currentAudioTrack === option.id
                            ? 1
                            : pressed
                              ? 0.7
                              : 0.5,
                        transform: [{ scale: pressed ? 0.95 : 1 }],
                      },
                    ]}
                  >
                    <View
                      className={
                        currentAudioTrack === option.id
                          ? "bg-primary px-4 py-2 rounded-full"
                          : "px-4 py-2 rounded-full"
                      }
                    >
                      <Text className="text-sm font-semibold text-foreground">
                        {option.icon} {option.label}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

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
            <View className="py-3 px-6 rounded-full bg-surface border border-border items-center">
              <Text className="text-base font-semibold text-foreground">
                {t("common.close")}
              </Text>
            </View>
          </Pressable>
        </Animated.View>
      )}

      {/* Tap to show controls */}
      {!showControls && (
        <Pressable
          onPress={handleShowControls}
          className="absolute inset-0"
          style={{ opacity: 0 }}
        />
      )}
    </ScreenContainer>
  );
}
