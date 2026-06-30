/**
 * Sleep Mode Screen
 * Reuses existing microphone, Whisper transcription, and OpenAI chat from Session screen
 * Features: Voice input, AI responses, dark theme
 */

import { ScrollView, Text, View, TextInput, TouchableOpacity, Platform, ActivityIndicator, KeyboardAvoidingView } from "react-native";
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
import Animated, { FadeIn, Layout } from "react-native-reanimated";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function SleepModeScreen() {
  const { audioEnabled, language } = useAppContext();
  const { messages, isLoading, error, sendMessage, startNewSession } = useOpenAI();
  const { t } = useTranslation(language);
  const router = useRouter();


  // Audio recording - reuse existing expo-av Audio.Recording system
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
        const permission = await Audio.requestPermissionsAsync();
        if (!permission.granted) {
          setPermissionError("Microphone permission was denied");
          return;
        }

        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
      } catch (error) {
        console.error("[SleepMode] Failed to initialize audio:", error);
        setPermissionError("Failed to initialize audio");
      }
    };
    initAudio();
  }, []);

  // Initialize session with sleep mode greeting
  useEffect(() => {
    if (!sessionInitialized) {
      startNewSession("sleep");
      setSessionInitialized(true);
    }
  }, [sessionInitialized]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollViewRef.current && messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  // Handle send message - reuse existing OpenAI sendMessage
  const handleSend = async () => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput || isLoading) {
      return;
    }

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

    setInputValue("");
    await sendMessage(trimmedInput);
  };

  // Format timestamp
  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Handle microphone button press - REUSE EXACT LOGIC FROM SESSION SCREEN
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
        console.log("[SleepMode] 🎤 Recording started");
      } catch (error) {
        console.error("[SleepMode] ❌ Failed to start recording:", error);
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

        console.log("[SleepMode] 📁 Recording stopped. URI:", uri);

        if (uri) {
          console.log("[SleepMode] 🚀 Starting transcription...");
          await handleTranscribeRecording(uri);
        } else {
          console.error("[SleepMode] ❌ No URI returned from recording");
          setPermissionError("Failed to get recording URI");
        }

        if (Platform.OS !== "web") {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      } catch (error) {
        console.error("[SleepMode] ❌ Failed to stop recording:", error);
        setPermissionError("Failed to stop recording");
      }
    }
  };

  // Handle transcription of recorded audio - REUSE EXACT LOGIC FROM SESSION SCREEN
  const handleTranscribeRecording = async (recordingUri: string) => {
    try {
      setIsTranscribing(true);
      setTranscriptionError(null);
      console.log("[SleepMode] 🚀 Starting transcription process");

      const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error("OpenAI API key not configured");
      }

      const response = await fetch(recordingUri);
      const blob = await response.blob();
      
      const formData = new FormData();
      formData.append("file", blob, "recording.m4a");
      formData.append("model", "whisper-1");

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
      console.log("[SleepMode] ✅ Transcription successful:", transcribedText);

      setInputValue(transcribedText);

    } catch (error) {
      console.error("[SleepMode] ❌ Transcription failed:", error);
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
    <ScreenContainer className="flex-1 bg-background">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-border pt-40">
          <View className="flex-1">
            <Text className="text-lg font-semibold text-foreground">{t('sleep.title')}</Text>
            <Text className="text-xs text-muted mt-0.5">
              {t('sleep.subtitle')}
            </Text>
          </View>

          {/* Audio indicator */}
          {audioEnabled && (
            <View className="mr-3 px-2 py-1 bg-primary/20 rounded-full">
              <Text className="text-xs text-foreground font-semibold">🔊</Text>
            </View>
          )}

          {/* Close button */}
          <TouchableOpacity onPress={handleClose} className="p-2">
            <Text className="text-2xl font-bold text-foreground">✕</Text>
          </TouchableOpacity>
        </View>

        {/* Error message */}
        {error && (
          <View className="mx-4 mt-3 p-3 bg-red-900/20 border border-red-800 rounded-lg">
            <Text className="text-sm text-red-300">{error}</Text>
          </View>
        )}

        {/* Permission error message */}
        {permissionError && (
          <View className="mx-4 mt-3 p-3 bg-red-900/20 border border-red-800 rounded-lg">
            <Text className="text-sm text-red-300">
              {permissionError || t('session.microphoneAccessRequired')}
            </Text>
          </View>
        )}

        {/* Transcription error message */}
        {transcriptionError && (
          <View className="mx-4 mt-3 p-3 bg-red-900/20 border border-red-800 rounded-lg">
            <Text className="text-sm text-red-300">{transcriptionError}</Text>
          </View>
        )}

        {/* Transcription in progress indicator */}
        {isTranscribing && (
          <View className="mx-4 mt-3 p-3 bg-blue-900/20 border border-blue-800 rounded-lg flex-row items-center gap-2">
            <ActivityIndicator size="small" color="#60a5fa" />
            <Text className="text-sm text-blue-300 font-semibold">{t('session.transcriberIndicator')}</Text>
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
              <Text className="text-base text-slate-400 text-center">
                {t('sleep.emptyState')}
              </Text>
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
                      ? "bg-blue-900 rounded-br-none"
                      : "bg-slate-800 border border-slate-700 rounded-bl-none"
                  )}
                >
                  <Text
                    className={cn(
                      "text-base leading-relaxed",
                      msg.role === "user" ? "text-slate-100" : "text-slate-200"
                    )}
                  >
                    {msg.content}
                  </Text>
                  <Text
                    className={cn(
                      "text-xs mt-1",
                      msg.role === "user" ? "text-slate-300" : "text-slate-500"
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
              <View className="bg-slate-800 border border-slate-700 rounded-2xl rounded-bl-none px-4 py-3">
                <ActivityIndicator size="small" color="#60a5fa" />
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input area */}
        <View className="px-4 py-4 border-t border-slate-800">
          {/* Listening indicator */}
          {isListening && (
            <View className="mb-3 flex-row items-center gap-2 px-3 py-2 bg-blue-900/30 rounded-lg border border-blue-800">
              <Text className="text-sm text-blue-300 font-semibold">{t('session.listeningIndicator')}</Text>
            </View>
          )}
          <View className="flex-row items-center gap-2">
            <TextInput
              className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-full text-slate-100"
              placeholder={t('sleep.placeholder')}
              placeholderTextColor="#64748b"
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
                isListening ? "bg-blue-600 scale-110" : "bg-slate-800 border border-slate-700"
              )}
            >
              <Text className={cn("text-lg", isListening ? "text-slate-100" : "text-slate-300")}>🎤</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSend}
              disabled={isLoading || !inputValue.trim()}
              className={cn(
                "w-12 h-12 rounded-full items-center justify-center",
                isLoading || !inputValue.trim() ? "bg-slate-700" : "bg-blue-600"
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
