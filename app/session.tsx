/**
 * Session Screen - AI Chat with Emotional Support
 * Features: Context-aware responses, message history, audio playback
 */

import { ScreenContainer } from "@/components/screen-container";
import { useAppContext } from "@/lib/app-context";
import { useOpenAI } from "@/lib/openai-context";
import { getOpenAIClient } from "@/lib/openai-service";
import { useTranslation } from "@/lib/i18n";
import { useRouter } from "expo-router";
import { useColors } from "@/hooks/use-colors";
import { cn } from "@/lib/utils";
import * as Haptics from "expo-haptics";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import { useState, useEffect, useRef } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ScrollView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  KeyboardAvoidingView,
  ImageBackground,
} from "react-native";

export default function SessionScreen() {
  const { theme, language, session, audioEnabled } = useAppContext();
  const { messages, isLoading, error, sendMessage, startNewSession, messagesRemainingToday } = useOpenAI();
  const { t } = useTranslation(language);
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const [inputValue, setInputValue] = useState("");
  const [sessionInitialized, setSessionInitialized] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false); 
  const scrollViewRef = useRef<ScrollView>(null);

  // Initialize session with mood and greeting
  useEffect(() => {
    if (!sessionInitialized && session.selectedMood) {
      startNewSession(session.selectedMood);
      setSessionInitialized(true);
    }
  }, [session.selectedMood, sessionInitialized]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollViewRef.current && messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  
    
  
  // Format timestamp
  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Close session
 const handleClose = () => {
  if (Platform.OS !== "web") {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
  router.back();
};

const handleSend = async () => {
  const trimmedInput = inputValue.trim();

  if (!trimmedInput || isLoading) return;

  try {
    const openaiClient = getOpenAIClient();
    if (openaiClient.isRequestInProgress()) return;
  } catch (err) {}

  if (Platform.OS !== "web") {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  setInputValue("");
  await sendMessage(trimmedInput);
};
  const handleMicrophonePress = async () => {
  try {
    console.log("🎤 START RECORDING");

    const permission = await Audio.requestPermissionsAsync();
    if (!permission.granted) {
      console.log("❌ Microphone permission denied");
      return;
    }

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    const { recording } = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );

    setRecording(recording);
    setIsRecording(true);

  } catch (err) {
    console.log("❌ Failed to start recording:", err);
  }
};
  return (
      <ScreenContainer className={theme === "dark" ? "flex-1" : "flex-1 bg-background"}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
          {/* Header */}
          <View className="flex-row items-center justify-between px-4 py-3 border-b border-border">
            <View className="flex-1">
              <Text className="text-lg font-semibold text-foreground">{t("session.title")}</Text>
              <Text className="text-xs text-muted mt-0.5">
                {session.isPremium
                  ? t("session.premiumUser")
                  : t("session.messagesRemaining", { count: messagesRemainingToday.toString() })}  
              </Text>
            </View>

            {/* Audio indicator */}
            {audioEnabled && (
              <View className="mr-3 px-2 py-1 bg-primary rounded-full">
                <Text className="text-xs text-background font-semibold">🔊</Text>
              </View>
            )}

            {/* Close button */}
            <TouchableOpacity onPress={handleClose} className="p-2">
              <Text className="text-xl">✕</Text>
            </TouchableOpacity>
          </View>

          {/* Error message */}
          {error && (
            <View className="mx-4 mt-3 p-3 bg-error/10 border border-error rounded-lg">
              <Text className="text-sm text-error">{error}</Text>
            </View>
          )}

          {/* Messages */}
          <ScrollView
            ref={scrollViewRef}
            className="flex-1 px-4 py-4"
            contentContainerStyle={{ paddingBottom: 16 }}
            showsVerticalScrollIndicator={false}
          >
            {messages.length === 0 ? (
              <View className="flex-1 items-center justify-center py-8">
                <Text className="text-base text-muted text-center">{t("session.startConversation")}</Text>
              </View>
            ) : (
              messages.map((msg) => (
                <View
                  key={msg.id}
                  className={cn("mb-4 flex-row", msg.role === "user" ? "justify-end" : "justify-start")}
                >
                  <View
                    className={cn(
                      "max-w-xs px-4 py-3 rounded-2xl",
                      msg.role === "user"
                        ? "bg-primary rounded-br-none"
                        : "bg-surface border border-border rounded-bl-none"
                    )}
                  >
                    <Text
                      className={cn(
                        "text-base leading-relaxed",
                        msg.role === "user" ? "text-background" : "text-foreground"
                      )}
                    >
                      {msg.content}
                    </Text>
                    <Text
                      className={cn(
                        "text-xs mt-1",
                        msg.role === "user" ? "text-background/70" : "text-muted"
                      )}
                    >
                      {formatTime(msg.timestamp)}
                    </Text>
                  </View>
                </View>
              ))
            )}

            {/* Loading indicator */}
            {isLoading && (
              <View className="flex-row items-center mb-4">
                <View className="bg-surface border border-border rounded-2xl rounded-bl-none px-4 py-3">
                  <ActivityIndicator size="small" color={colors.primary} />
                </View>
              </View>
            )}
          </ScrollView>

          {/* Input area */}
          <View className="px-4 py-4 border-t border-border">
            <View className="flex-row items-center gap-2">
              <TextInput
                className="flex-1 px-4 py-3 bg-surface border border-border rounded-full text-foreground"
                placeholder={t("session.messagePlaceholder")}
                placeholderTextColor={colors.muted}
                value={inputValue}
                onChangeText={setInputValue}
                editable={!isLoading}
                multiline
                maxLength={1000}
              />
              
              <TouchableOpacity
                onPress={handleMicrophonePress}
                className="w-12 h-12 rounded-full items-center justify-center bg-surface border border-border"
              >  
                <Text className="text-lg">🎤</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSend}
                disabled={isLoading || !inputValue.trim()}
                className={cn(
                  "w-12 h-12 rounded-full items-center justify-center",
                  isLoading || !inputValue.trim() ? "bg-muted/50" : "bg-primary"
                )}
              >
                <Text className="text-lg">{isLoading ? "..." : "→"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScreenContainer>
  );
}
