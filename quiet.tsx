import { View, Text, Pressable, Platform, Animated } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useAppContext } from "@/lib/app-context";
import { useTranslation } from "@/lib/i18n";
import { useRouter } from "expo-router";
import { useColors } from "@/hooks/use-colors";
import { useSimpleAudio } from "@/hooks/use-simple-audio";
import { AUDIO_TRACKS } from "@/lib/_core/audio-manager";

import * as Haptics from "expo-haptics";

export default function QuietModeScreen() {
  const { language, audioEnabled, session } =
    useAppContext();
  const { t } = useTranslation(language);
  const router = useRouter();
  const colors = useColors();
  const { play, stop, currentTrackId } = useSimpleAudio();

  // Controls are always visible - no auto-hide logic

  const handleAudioTrackChange = (track: "relaxm2" | "forest" | "rain") => {
    if (!session.isPremium && track !== "relaxm2") return;
    
    const trackData = AUDIO_TRACKS[track];
    if (!trackData) {
      console.error(`Track not found: ${track}`);
      return;
    }

    if (currentTrackId === track) {
      stop();
    } else {
      play(track, trackData.s3Url, session.isPremium);
    }
    
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
    <View style={{ flex: 1 }}>
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

        {/* Controls - Always Visible */}
        <View
          className="absolute bottom-0 left-0 right-0 px-6 py-8 gap-4"
        >
            {/* Audio Track Selection */}
            {session.isPremium && (
              <View className="gap-3">
                <Text className="text-sm font-semibold text-muted text-center uppercase">
                  {t("session.audioLabel")}
                </Text>
                <View className="flex-row gap-3 justify-center">
                  {AUDIO_OPTIONS.map((option) => {
                    const isActive = currentTrackId === option.id;
                    return (
                      <Pressable
                        key={option.id}
                        onPress={() =>
                          handleAudioTrackChange(option.id as "relaxm2" | "forest" | "rain")
                        }
                        style={({ pressed }) => [
                          {
                            opacity: pressed ? 0.7 : 1,
                            transform: [{ scale: pressed ? 0.95 : 1 }],
                          },
                        ]}
                      >
                        <View className={isActive ? "px-4 py-2 rounded-full bg-primary" : "px-4 py-2 rounded-full bg-surface"}>
                          <Text className={isActive ? "text-sm font-semibold text-background" : "text-sm font-semibold text-foreground"}>
                            {option.icon} {option.label}
                          </Text>
                        </View>
                      </Pressable>
                    );
                  })}
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
        </View>
      </ScreenContainer>
    </View>
  );
}
