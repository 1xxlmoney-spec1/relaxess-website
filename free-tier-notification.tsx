import React, { useEffect, useState } from "react";
import { Text, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { registerNotificationHandler } from "@/lib/audio-controller";
import { useColors } from "@/hooks/use-colors";

/**
 * FreeTierNotification - Global notification banner for free-tier limit messages
 * 
 * Displays at the top of the screen when a free user hits their daily play limit.
 * Auto-dismisses after 4 seconds or when user taps close button.
 */
export function FreeTierNotification() {
  const [message, setMessage] = useState<string | null>(null);
  const colors = useColors();
  const animationProgress = useSharedValue(0);

  // Set up the notification callback
  useEffect(() => {
    const handleNotification = (msg: string) => {
      setMessage(msg);
      animationProgress.value = withTiming(1, {
        duration: 300,
        easing: Easing.out(Easing.cubic),
      });

      // Auto-dismiss after 4 seconds
      const timer = setTimeout(() => {
        dismissNotification();
      }, 4000);

      return () => clearTimeout(timer);
    };

    registerNotificationHandler(handleNotification);
  }, [animationProgress]);

  const dismissNotification = () => {
    animationProgress.value = withTiming(0, {
      duration: 300,
      easing: Easing.out(Easing.cubic),
    });

    setTimeout(() => {
      setMessage(null);
    }, 300);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: animationProgress.value,
      transform: [
        {
          translateY: animationProgress.value === 0 ? -100 : 0,
        },
      ],
    };
  });

  if (!message) {
    return null;
  }

  return (
    <Animated.View
      style={[
        {
          backgroundColor: "#687076",
          paddingHorizontal: 16,
          paddingVertical: 12,
          marginHorizontal: 12,
          marginTop: 12,
          borderRadius: 12,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
        },
        animatedStyle,
      ]}
    >
      <Text
        style={{
          flex: 1,
          fontSize: 14,
          fontWeight: "500",
          color: "#fff",
          marginRight: 12,
        }}
      >
        {message}
      </Text>
      <Pressable
        onPress={dismissNotification}
        style={({ pressed }) => ({
          opacity: pressed ? 0.7 : 1,
          padding: 4,
        })}
      >
        <Text style={{ fontSize: 18, color: "#fff", fontWeight: "600" }}>×</Text>
      </Pressable>
    </Animated.View>
  );
}
