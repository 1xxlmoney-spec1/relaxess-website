import React, { useEffect, useState } from "react";
import { View, Text, Pressable, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import { useSimpleAudio } from "@/hooks/use-simple-audio";
import { AUDIO_TRACKS } from "@/lib/_core/audio-manager";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAppContext } from "@/lib/app-context";
import * as Haptics from "expo-haptics";
import { getRemainingListeningSeconds } from "@/lib/simple-audio";
import { registerNotificationHandler } from "@/lib/audio-controller";

/**
 * GlobalAudioBar - Global persistent audio control component
 * 
 * Premium Apple-style mini player with:
 * - 72px height with smooth rounded top corners
 * - Track title (18px SemiBold) + "Playing" status text
 * - Circular 48x48 stop button with press feedback
 * - Smooth fade-in/slide-up animations (450ms ease-out)
 * - Calm gray background
 * - Subtle premium shadow
 * - Always mounted; visibility controlled via animated opacity and pointerEvents
 * - Proper text padding and alignment per Apple HIG
 * - Displays limit notification inside the bar (no separate banner)
 * 
 * FREE TIER LIMITS:
 * - Validation happens in audio-controller.ts BEFORE playback
 * - Listening time is recorded in simple-audio.ts when audio stops
 * - No UI-based timer logic (all enforcement is backend)
 * - Shows "Daily limit reached" message when limit is hit
 */
export function GlobalAudioBar() {
  const { currentTrackId, isPlaying, stop } = useSimpleAudio();
  const { session } = useAppContext();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const [limitMessage, setLimitMessage] = useState<string | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
  
  // Animation state for fade in/out and slide up
  const animationProgress = useSharedValue(0);
  
  // Animation state for limit message overlay fade-in
  const limitMessageOpacity = useSharedValue(0);

  // Register limit notification callback
  useEffect(() => {
    const handleLimitNotification = (message: string) => {
      setLimitMessage(message);
      // Show overlay for any limit message
      if (message.includes("Daily limit")) {
        // Animate limit message overlay in
        limitMessageOpacity.value = withTiming(1, {
          duration: 400,
          easing: Easing.out(Easing.cubic),
        });
        // Auto-stop if audio is currently playing
        if (isPlaying) {
          stop();
        }
      }
    };
    
    // Register with audio-controller which will propagate to simple-audio
    registerNotificationHandler(handleLimitNotification);
  }, [stop, limitMessageOpacity, isPlaying]);

  // Clear limit message when track changes
  useEffect(() => {
    if (currentTrackId && isPlaying) {
      setLimitMessage(null);
      limitMessageOpacity.value = 0;
    }
  }, [currentTrackId, isPlaying, limitMessageOpacity]);

  // Update remaining seconds for free users
  useEffect(() => {
    if (!currentTrackId || !isPlaying || session?.isPremium) {
      setRemainingSeconds(null);
      return;
    }

    const updateRemaining = async () => {
      const remaining = await getRemainingListeningSeconds(currentTrackId, session?.isPremium || false);
      setRemainingSeconds(remaining);
    };

    updateRemaining();

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev === null || prev === undefined) return null;
        if (prev <= 0) {
          stop();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentTrackId, isPlaying, session?.isPremium, stop]);

  // Animate when audio state changes or limit message appears
  useEffect(() => {
    if ((isPlaying && currentTrackId) || limitMessage) {
      animationProgress.value = withTiming(1, {
        duration: 450,
        easing: Easing.out(Easing.cubic),
      });
    } else {
      animationProgress.value = withTiming(0, {
        duration: 450,
        easing: Easing.out(Easing.cubic),
      });
    }
  }, [isPlaying, currentTrackId, limitMessage, animationProgress]);

  // Force animation reset when component unmounts or audio state becomes invalid
  useEffect(() => {
    return () => {
      // Reset animation on unmount to prevent stuck state
      if (!isPlaying || !currentTrackId) {
        animationProgress.value = 0;
      }
    };
  }, []);

  // Get track name from AUDIO_TRACKS
  const currentTrackTitle = AUDIO_TRACKS[currentTrackId as keyof typeof AUDIO_TRACKS]?.name || "Unknown Track";

  // Format remaining time as mm:ss
  const formatRemainingTime = (seconds: number | null): string => {
    if (seconds === null || seconds === undefined || seconds === Infinity) return "";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStop = () => {
    setLimitMessage(null);
    limitMessageOpacity.value = 0;
    stop();
    
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  // Determine calm colors based on theme
  const isDark = colorScheme === "dark";
  const barBackgroundColor = "#687076";
  const borderColor = isDark
    ? "rgba(100, 150, 200, 0.2)" // Subtle blue border
    : "rgba(100, 140, 180, 0.2)"; // Subtle blue border

  // Animated style for fade in/out and slide up
  const animatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      animationProgress.value,
      [0, 1],
      [60, 0], // Slide up from 60px below
      Extrapolate.CLAMP
    );
    return {
      opacity: animationProgress.value,
      transform: [{ translateY }],
      pointerEvents: animationProgress.value < 0.5 ? "none" : "auto",
    };
  });
  
  // Animated style for limit message overlay fade-in
  const limitMessageAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: limitMessageOpacity.value,
      pointerEvents: limitMessageOpacity.value === 0 ? "none" : "auto",
    };
  });

  return (
    <Animated.View
      style={[
        {
          paddingBottom: Math.max(insets.bottom, 0),
          overflow: "hidden",
          backgroundColor: "rgba(120, 115, 105, 0.18)",
        },
        animatedStyle,
      ]}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 20,
          paddingVertical: 14,
          minHeight: 72,
          backgroundColor: barBackgroundColor,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          borderTopWidth: 1,
          borderTopColor: borderColor,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -6 },
          shadowOpacity: 0.25,
          shadowRadius: 16,
          elevation: 12,
        }}
      >
        {/* Show limit notification or audio player content */}
        {limitMessage ? (
          // Limit notification state
          <View style={{ flex: 1, justifyContent: "center" }}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: isDark ? "#f5f5f5" : "#ffffff",
                letterSpacing: -0.4,
                marginBottom: 4,
              }}
            >
              Daily limit reached.
            </Text>
            <Text
              numberOfLines={2}
              style={{
                fontSize: 13,
                fontWeight: "500",
                color: isDark ? "rgba(245, 245, 245, 0.75)" : "rgba(255, 255, 255, 0.85)",
                letterSpacing: 0.3,
              }}
            >
              Premium users enjoy unlimited listening.
            </Text>
          </View>
        ) : (
          // Audio player state
          <>
            {/* Left: Track info */}
            <View style={{ flex: 1, marginRight: 16, justifyContent: "center" }}>
              {/* Track title */}
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  color: "#ffffff",
                  letterSpacing: -0.4,
                  marginBottom: 3,
                }}
              >
                {currentTrackTitle}
              </Text>

              {/* Playing status */}
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "500",
                  color: "#ffffff",
                  letterSpacing: 0.3,
                }}
              >
                Playing{remainingSeconds !== null && remainingSeconds !== Infinity ? ` • ${formatRemainingTime(remainingSeconds)} remaining` : ""}
              </Text>
            </View>

            {/* Right: Stop button - only show if actually playing */}
            {isPlaying && currentTrackId && (
              <Pressable
                onPress={handleStop}
                style={({ pressed }) => ({
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: pressed
                    ? "rgba(74,64,54,0.18)"
                    : "rgba(74,64,54,0.10)",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: [{ scale: pressed ? 0.92 : 1 }],
                })}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <MaterialIcons name="volume-off" size={26} color="#4DB8D8" />
              </Pressable>
            )}
          </>
        )}
        
        {/* Limit message overlay - fades in when limit reached */}
        <Animated.View
          style={[
            {
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: barBackgroundColor,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 20,
            },
            limitMessageAnimatedStyle,
          ]}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: "500",
              color: "#ffffff",
              letterSpacing: -0.3,
              textAlign: "center",
              lineHeight: 20,
            }}
          >
            Daily limit reached{"\n"}Return tomorrow or enjoy unlimited listening with Relaxess Premium.
          </Text>
        </Animated.View>
      </View>
    </Animated.View>
  );
}
