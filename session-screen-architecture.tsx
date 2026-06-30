/**
 * Session Screen Architecture
 * 
 * Clean separation of concerns:
 * - UI components (SessionHeader, ChatArea, InputArea)
 * - State management (SessionState, InputState)
 * - Interaction handlers (prepared for AI + speech-to-text)
 * - No AI logic or speech recognition yet
 * 
 * Future integration points:
 * - AI response generation
 * - Speech-to-text transcription
 * - Text-to-speech playback
 */

import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useColors } from "@/hooks/use-colors";
import { cn } from "@/lib/utils";
import * as Haptics from "expo-haptics";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type SessionState = "idle" | "typing" | "listening" | "loading_response";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  source?: "text" | "voice"; // Track message source
}

export interface SessionScreenProps {
  title: string;
  onClose: () => void;
  onSendMessage?: (message: string) => void;
  onMicrophonePress?: () => void;
  messages?: Message[];
  isLoading?: boolean;
  sessionState?: SessionState;
}

// ============================================================================
// SESSION HEADER COMPONENT
// ============================================================================

interface SessionHeaderProps {
  title: string;
  subtitle?: string;
  onClose: () => void;
  audioEnabled?: boolean;
}

export function SessionHeader({
  title,
  subtitle,
  onClose,
  audioEnabled,
}: SessionHeaderProps) {
  const colors = useColors();

  return (
    <View className="flex-row items-center justify-between px-4 py-3 border-b border-border pt-40">
      <View className="flex-1">
        <Text className="text-lg font-semibold text-foreground">{title}</Text>
        {subtitle && (
          <Text className="text-xs text-muted mt-0.5">{subtitle}</Text>
        )}
      </View>

      {audioEnabled && (
        <View className="mr-3 px-2 py-1 bg-primary rounded-full">
          <Text className="text-xs text-background font-semibold">🔊</Text>
        </View>
      )}

      <TouchableOpacity onPress={onClose} className="p-2">
        <Text className="text-2xl font-bold text-foreground">✕</Text>
      </TouchableOpacity>
    </View>
  );
}

// ============================================================================
// CHAT AREA COMPONENT
// ============================================================================

interface ChatAreaProps {
  messages: Message[];
  isLoading: boolean;
  emptyStateText: string;
}

export function ChatArea({
  messages,
  isLoading,
  emptyStateText,
}: ChatAreaProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const colors = useColors();

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    if (scrollViewRef.current && messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <ScrollView
      ref={scrollViewRef}
      className="flex-1 px-4 py-4"
      contentContainerStyle={{ paddingBottom: 16 }}
      showsVerticalScrollIndicator={false}
    >
      {messages.length === 0 ? (
        <View className="flex-1 items-center justify-center py-8">
          <Text className="text-base text-muted text-center">
            {emptyStateText}
          </Text>
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
  );
}

// ============================================================================
// INPUT AREA COMPONENT
// ============================================================================

interface InputAreaProps {
  onSendMessage: (message: string) => void;
  onMicrophonePress: () => void;
  isLoading: boolean;
  sessionState: SessionState;
  placeholderText: string;
}

export function InputArea({
  onSendMessage,
  onMicrophonePress,
  isLoading,
  sessionState,
  placeholderText,
}: InputAreaProps) {
  const [inputValue, setInputValue] = useState("");
  const colors = useColors();

  const handleSend = () => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput || isLoading) {
      return;
    }

    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    onSendMessage(trimmedInput);
    setInputValue("");
  };

  const handleMicrophonePress = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onMicrophonePress();
  };

  // Microphone button shows listening state
  const isListening = sessionState === "listening";


  return (
    <View className="px-4 py-4 border-t border-border">
      <View className="flex-row items-center gap-2">
        {/* Text input */}
        <TextInput
          className="flex-1 px-4 py-3 bg-surface border border-border rounded-full text-foreground"
          placeholder={placeholderText}
          placeholderTextColor={colors.muted}
          value={inputValue}
          onChangeText={setInputValue}
          editable={!isLoading && sessionState !== "listening"}
          multiline
          maxLength={1000}
        />

        {/* Microphone button (UI only, no functionality yet) */}
        <TouchableOpacity
          onPress={handleMicrophonePress}
          disabled={isLoading}
          className={cn(
            "w-12 h-12 rounded-full items-center justify-center",
            isLoading ? "bg-muted/50" : "bg-surface border border-border"
          )}
        >
          <Text
            className={cn(
              "text-lg",
              isListening ? "text-primary" : "text-foreground"
            )}
          >
            🎤
          </Text>
          {isListening && (
            <View className="absolute inset-0 rounded-full border-2 border-primary opacity-50" />
          )}
        </TouchableOpacity>

        {/* Send button */}
        <TouchableOpacity
          onPress={handleSend}
          disabled={isLoading || !inputValue.trim()}
          className={cn(
            "w-12 h-12 rounded-full items-center justify-center",
            isLoading || !inputValue.trim() ? "bg-muted/50" : "bg-primary"
          )}
        >
          <Text className="text-lg">
            {isLoading ? "..." : "➤"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Listening indicator text */}
      {isListening && (
        <Text className="text-xs text-primary mt-2 text-center">
          Listening...
        </Text>
      )}
    </View>
  );
}

// ============================================================================
// MAIN SESSION SCREEN COMPONENT
// ============================================================================

export function SessionScreenArchitecture({
  title,
  onClose,
  onSendMessage,
  onMicrophonePress,
  messages = [],
  isLoading = false,
  sessionState = "idle",
}: SessionScreenProps) {
  const colors = useColors();

  const handleSendMessage = (message: string) => {
    if (onSendMessage) {
      onSendMessage(message);
    }
  };

  const handleMicrophonePress = () => {
    if (onMicrophonePress) {
      onMicrophonePress();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View className="flex-1 bg-background">
        {/* Header */}
        <SessionHeader
          title={title}
          subtitle="Start speaking or typing to begin your session"
          onClose={onClose}
          audioEnabled={true}
        />

        {/* Chat area */}
        <ChatArea
          messages={messages}
          isLoading={isLoading}
          emptyStateText="Start speaking or typing to begin your session"
        />

        {/* Input area */}
        <InputArea
          onSendMessage={handleSendMessage}
          onMicrophonePress={handleMicrophonePress}
          isLoading={isLoading}
          sessionState={sessionState}
          placeholderText="Type or use microphone..."
        />
      </View>
    </KeyboardAvoidingView>
  );
}
