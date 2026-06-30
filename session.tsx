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
import { useAudio } from "@/lib/audio-context";

import { cn } from "@/lib/utils";
import * as Haptics from "expo-haptics";
import { Audio } from "expo-av";
import Animated, { FadeIn, Layout } from "react-native-reanimated";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  ScrollView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";


export default function SessionScreen() {
  const { theme, language, session, audioEnabled } = useAppContext();
  const { messages, isLoading, error, sendMessage, startNewSession, messagesRemainingToday } = useOpenAI();
  const { t } = useTranslation(language);
  const router = useRouter();
  const colors = useColors();
  const audio = useAudio();

  // Audio recording - using expo-av Audio.Recording
  const recordingRef = useRef<Audio.Recording | null>(null);
  const recordingStartTimeRef = useRef<number>(0);

  const [inputValue, setInputValue] = useState("");
  const [sessionInitialized, setSessionInitialized] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionError, setTranscriptionError] = useState<string | null>(null);

  const scrollViewRef = useRef<ScrollView>(null);

  // Initialize audio mode on mount
  useEffect(() => {
    const initAudio = async () => {
      try {
        // Request microphone permission
        const permission = await Audio.requestPermissionsAsync();
        if (!permission.granted) {
          setPermissionError("Microphone permission was denied");
          return;
        }

        // Set audio mode for recording
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
      } catch (error) {
        console.error("Failed to initialize audio:", error);
        setPermissionError("Failed to initialize audio");
      }
    };
    initAudio();
  }, []);

  // Initialize session with mood and greeting
  useEffect(() => {
    if (!sessionInitialized && session.selectedMood) {
      startNewSession(session.selectedMood);
      setSessionInitialized(true);
    }
  }, [session.selectedMood, sessionInitialized]);

  // Audio auto-play removed - audio system in stub mode

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollViewRef.current && messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  // Handle send message
  const handleSend = async () => {
    const trimmedInput = inputValue.trim();
    // Prevent send if already loading or request in progress
    if (!trimmedInput || isLoading) {
      return;
    }

    // Check if OpenAI client is already processing a request
    try {
      const openaiClient = getOpenAIClient();
      if (openaiClient.isRequestInProgress()) {
        return;
      }
    } catch (err) {
      // Client not initialized yet, continue
    }

    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    // Clear input
    setInputValue("");

    // Send message
    await sendMessage(trimmedInput);

    // Increment audio session exchange count for free tier tracking
    audio.incrementExchangeCount();
  };

  // Format timestamp
  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Handle microphone button press - start/stop recording
  const handleMicrophonePress = async () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    if (!isListening) {
      // START RECORDING
      try {
        const recording = new Audio.Recording();
        
        await recording.prepareToRecordAsync({
          isMeteringEnabled: true,
          android: {
            extension: ".m4a",
            outputFormat: Audio.AndroidOutputFormat.MPEG_4,
            audioEncoder: Audio.AndroidAudioEncoder.AAC,
            sampleRate: 44100,
            numberOfChannels: 1,
            bitRate: 128000,
          },
          ios: {
            extension: ".m4a",
            audioQuality: Audio.IOSAudioQuality.HIGH,
            sampleRate: 44100,
            numberOfChannels: 1,
            bitRate: 128000,
          },
          web: {} as any,
        });

        await recording.startAsync();
        recordingRef.current = recording;
        recordingStartTimeRef.current = Date.now();
        setIsListening(true);
        setPermissionError(null);
        setTranscriptionError(null);
        console.log("[Session] 🎤 Recording started");
      } catch (error) {
        console.error("[Session] ❌ Failed to start recording:", error);
        setPermissionError("Failed to start recording");
      }
    } else {
      // STOP RECORDING
      try {
        if (!recordingRef.current) {
          setPermissionError("No active recording");
          return;
        }

        await recordingRef.current.stopAndUnloadAsync();
        const uri = recordingRef.current.getURI();
        recordingRef.current = null;
        setIsListening(false);

        console.log("[Session] 📁 Recording stopped. URI:", uri);

        if (uri) {
          // START TRANSCRIPTION IMMEDIATELY
          console.log("[Session] 🚀 Starting transcription...");
          await handleTranscribeRecording(uri);
        } else {
          console.error("[Session] ❌ No URI returned from recording");
          setPermissionError("Failed to get recording URI");
        }

        if (Platform.OS !== "web") {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      } catch (error) {
        console.error("[Session] ❌ Failed to stop recording:", error);
        setPermissionError("Failed to stop recording");
      }
    }
  };

  // Handle transcription of recorded audio
  const handleTranscribeRecording = async (recordingUri: string) => {
    try {
      setIsTranscribing(true);
      setTranscriptionError(null);
      console.log("[Session] 🚀 Starting transcription process");

      // Get OpenAI API key from environment
      const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error("OpenAI API key not configured");
      }

      // Read audio file and convert to blob
      const response = await fetch(recordingUri);
      const blob = await response.blob();
      
      // Create FormData for Whisper API
      const formData = new FormData();
      formData.append("file", blob, "recording.m4a");
      formData.append("model", "whisper-1");

      // Send to OpenAI Whisper API
      const transcriptionResponse = await axios.post(
        "https://api.openai.com/v1/audio/transcriptions",
        formData,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const transcribedText = transcriptionResponse.data.text;
      console.log("[Session] ✅ Transcription successful:", transcribedText);

      // Place transcribed text into input field
      setInputValue(transcribedText);

    } catch (error) {
      console.error("[Session] ❌ Transcription failed:", error);
      setTranscriptionError(
        error instanceof Error ? error.message : "Transcription failed"
      );
    } finally {
      setIsTranscribing(false);
    }
  };

  // Close session
  const handleClose = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  return (
      <ScreenContainer className={theme === "dark" ? "flex-1" : "flex-1 bg-background"}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
          {/* Header */}
          <View className="flex-row items-center justify-between px-4 py-3 border-b border-border pt-40">
            <View className="flex-1">
              <Text className="text-lg font-semibold text-foreground">{t("session.title")}</Text>
              <Text className="text-xs text-muted mt-0.5">
                {session.isPremium
                  ? t("session.premiumUser")
                  : t("session.messagesRemaining", { count: messagesRemainingToday.toString() })}  
              </Text>
            </View>


            {/* Close button */}
            <TouchableOpacity onPress={handleClose} className="p-2">
              <Text className="text-2xl font-bold" style={{ color: theme === "dark" ? "#ffffff" : "#000000" }}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Error message */}
          {error && (
            <View className="mx-4 mt-3 p-3 bg-error/10 border border-error rounded-lg">
              <Text className="text-sm text-error">{error}</Text>
            </View>
          )}

          {/* Permission error message */}
          {permissionError && (
            <View className="mx-4 mt-3 p-3 bg-error/10 border border-error rounded-lg">
              <Text className="text-sm text-error">
                {permissionError || t('session.microphoneAccessRequired')}
              </Text>
            </View>
          )}

          {/* Transcription error message */}
          {transcriptionError && (
            <View className="mx-4 mt-3 p-3 bg-error/10 border border-error rounded-lg">
              <Text className="text-sm text-error">{transcriptionError}</Text>
            </View>
          )}

          {/* Transcription in progress indicator */}
          {isTranscribing && (
            <View className="mx-4 mt-3 p-3 bg-primary/10 border border-primary rounded-lg flex-row items-center gap-2">
              <ActivityIndicator size="small" color={colors.primary} />
              <Text className="text-sm text-primary font-semibold">{t('session.transcriberIndicator')}</Text>
            </View>
          )}

          {/* Gentle Breathing limit notification */}
          {audio.limitNotification && (
            <View className="mx-4 mt-3 p-3 bg-warning/10 border border-warning rounded-lg flex-row items-center justify-between">
              <Text className="text-sm text-warning font-semibold flex-1">{audio.limitNotification}</Text>
              <TouchableOpacity onPress={audio.clearNotification} className="ml-2">
                <Text className="text-lg text-warning">✕</Text>
              </TouchableOpacity>
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
              messages.map((msg, index) => (
                <Animated.View
                  key={msg.id}
                  className={cn("mb-4 flex-row", msg.role === "user" ? "justify-end" : "justify-start")}
                  entering={msg.role === "assistant" ? FadeIn.duration(400).delay(index * 50) : undefined}
                  layout={Layout.springify()}
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
                </Animated.View>
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
            {/* Listening indicator */}
            {isListening && (
              <View className="mb-3 flex-row items-center gap-2 px-3 py-2 bg-primary/10 rounded-lg border border-primary">
                <Text className="text-sm text-primary font-semibold">{t('session.listeningIndicator')}</Text>
              </View>
            )}
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
                disabled={isLoading}
                className={cn(
                  "w-12 h-12 rounded-full items-center justify-center transition-all",
                  isListening ? "bg-primary scale-110" : "bg-surface border border-border"
                )}
              >
                <Text className={cn("text-lg", isListening ? "text-background" : "text-foreground")}>🎤</Text>
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
