import { ScrollView, Text, View, Pressable, TextInput, Platform, KeyboardAvoidingView } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useAppContext } from "@/lib/app-context";
import { useTranslation } from "@/lib/i18n";
import { useRouter } from "expo-router";
import { useColors } from "@/hooks/use-colors";
import { cn } from "@/lib/utils";
import * as Haptics from "expo-haptics";
import { useState, useEffect, useRef } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ChatMessage {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: number;
}

export default function SleepModeScreen() {
  const { theme, language, session, incrementMessageCount, audioEnabled } = useAppContext();
  const { t } = useTranslation(language);
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Initialize session with gentle greeting
  useEffect(() => {
    if (!sessionStarted) {
      const greeting: ChatMessage = {
        id: "greeting",
        role: "ai",
        content: t("sleep.message1"),
        timestamp: Date.now(),
      };
      setMessages([greeting]);
      setSessionStarted(true);
    }
  }, []);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: inputValue.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    incrementMessageCount();

    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    // Simulate slower AI response (Sleep Mode is slower)
    setIsLoading(true);
    try {
      // Longer delay for sleep mode (more contemplative)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const sleepResponses = [
        t("sleep.message1"),
        t("sleep.message2"),
        t("sleep.message3"),
        "There's no rush. Just breathe.",
        "Let your body relax.",
        "You're safe here.",
        "Close your eyes if you'd like.",
      ];

      const aiResponse: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "ai",
        content: sleepResponses[Math.floor(Math.random() * sleepResponses.length)],
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("Failed to get AI response:", error);
    } finally {
      setIsLoading(false);
    }

    // Scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleExit = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScreenContainer
        className="bg-background"
        edges={["top", "left", "right"]}
        containerClassName="flex-1 bg-background opacity-90"
      >
        {/* Header */}
        <View className="flex-row justify-between items-center px-6 py-4 border-b border-border opacity-75">
          <Pressable
            onPress={handleExit}
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.4 : 0.6,
              },
            ]}
          >
            <Text className="text-primary font-semibold text-sm">{t("common.back")}</Text>
          </Pressable>

          <Text className="text-lg font-bold text-foreground opacity-75">
            {t("sleep.title")}
          </Text>

          <Text className="text-sm opacity-50">{audioEnabled ? "🔊" : "🔇"}</Text>
        </View>

        {/* Chat Messages - Dimmed */}
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 px-4 py-4 opacity-80"
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          contentContainerStyle={{ paddingBottom: 16 }}
        >
          {messages.map((message) => (
            <View
              key={message.id}
              className={cn(
                "mb-4",
                message.role === "user" ? "items-end" : "items-start"
              )}
            >
              <View
                className={cn(
                  "max-w-xs px-4 py-3 rounded-2xl",
                  message.role === "user"
                    ? "bg-primary bg-opacity-60 rounded-br-none"
                    : "bg-surface bg-opacity-60 rounded-bl-none"
                )}
              >
                <Text
                  className={cn(
                    "text-base leading-relaxed text-sm",
                    message.role === "user" ? "text-background" : "text-foreground"
                  )}
                >
                  {message.content}
                </Text>
              </View>
            </View>
          ))}

          {isLoading && (
            <View className="items-start mb-4">
              <View className="bg-surface bg-opacity-60 px-4 py-3 rounded-2xl rounded-bl-none">
                <Text className="text-foreground text-sm opacity-60">
                  {t("common.loading")}
                </Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input Area - Dimmed */}
        <View
          className="px-4 py-4 border-t border-border opacity-75"
          style={{ paddingBottom: Math.max(insets.bottom, 16) }}
        >
          <View className="flex-row gap-3 items-end">
            <TextInput
              value={inputValue}
              onChangeText={setInputValue}
              placeholder={t("session.inputPlaceholder")}
              placeholderTextColor={colors.muted}
              multiline
              maxLength={500}
              editable={!isLoading}
              className={cn(
                "flex-1 px-4 py-3 rounded-2xl text-foreground text-sm",
                theme === "dark" ? "bg-surface bg-opacity-50" : "bg-surface bg-opacity-50"
              )}
              style={{
                maxHeight: 100,
                color: colors.foreground,
              }}
            />

            <Pressable
              onPress={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              style={({ pressed }) => [
                {
                  opacity: !inputValue.trim() ? 0.3 : pressed ? 0.6 : 0.8,
                  transform: [{ scale: pressed ? 0.95 : 1 }],
                },
              ]}
              className="p-3 bg-primary bg-opacity-60 rounded-full items-center justify-center"
            >
              <Text className="text-background font-bold text-lg opacity-75">↑</Text>
            </Pressable>
          </View>
        </View>
      </ScreenContainer>
    </KeyboardAvoidingView>
  );
}
