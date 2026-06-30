import { ScrollView, Text, View, Pressable, Platform, Switch } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useAppContext } from "@/lib/app-context";
import { useTranslation, SUPPORTED_LANGUAGES, type Language } from "@/lib/i18n";
import { useColors } from "@/hooks/use-colors";
import { cn } from "@/lib/utils";
import * as Haptics from "expo-haptics";

export default function SettingsTabScreen() {
  const {
    theme,
    setTheme,
    language,
    setLanguage,
    audioEnabled,
    setAudioEnabled,
    session,
    setPremium,
  } = useAppContext();
  const { t } = useTranslation(language);
  const colors = useColors();

  const handleThemeChange = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleAudioToggle = () => {
    setAudioEnabled(!audioEnabled);
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleUpgradePremium = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    // TODO: Show premium subscription modal
    setPremium(true); // Placeholder
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
      >
        <View className="flex-1 px-6 py-8">
          {/* Header */}
          <Text className="text-3xl font-bold text-foreground mb-8">
            {t("settings.title")}
          </Text>

          {/* Theme Section */}
          <View className="gap-4 mb-8">
            <Text className="text-sm font-semibold text-muted uppercase">
              {t("settings.theme")}
            </Text>
            <View className="flex-row gap-3">
              <Pressable
                onPress={handleThemeChange}
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.8 : 1,
                    transform: [{ scale: pressed ? 0.97 : 1 }],
                  },
                ]}
                className="flex-1"
              >
                <View
                  className={cn(
                    "py-3 px-4 rounded-xl border-2 items-center",
                    theme === "dark"
                      ? "bg-primary border-primary"
                      : "bg-surface border-border"
                  )}
                >
                  <Text
                    className={cn(
                      "font-semibold",
                      theme === "dark" ? "text-background" : "text-foreground"
                    )}
                  >
                    🌙 {t("settings.darkMode")}
                  </Text>
                </View>
              </Pressable>

              <Pressable
                onPress={handleThemeChange}
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.8 : 1,
                    transform: [{ scale: pressed ? 0.97 : 1 }],
                  },
                ]}
                className="flex-1"
              >
                <View
                  className={cn(
                    "py-3 px-4 rounded-xl border-2 items-center",
                    theme === "light"
                      ? "bg-primary border-primary"
                      : "bg-surface border-border"
                  )}
                >
                  <Text className="font-semibold text-foreground">
                    ☀️ {t("settings.lightMode")}
                  </Text>
                </View>
              </Pressable>
            </View>
          </View>

          {/* Language Section */}
          <View className="gap-4 mb-8">
            <Text className="text-sm font-semibold text-muted uppercase">
              {t("settings.language")}
            </Text>
            <View className="gap-2">
              {(Object.entries(SUPPORTED_LANGUAGES) as [Language, string][]).map(
                ([lang, name]) => (
                  <Pressable
                    key={lang}
                    onPress={() => handleLanguageChange(lang)}
                    style={({ pressed }) => [
                      {
                        opacity: pressed ? 0.8 : 1,
                        transform: [{ scale: pressed ? 0.97 : 1 }],
                      },
                    ]}
                  >
                    <View
                      className={cn(
                        "py-3 px-4 rounded-xl border-2 flex-row justify-between items-center",
                        language === lang
                          ? "bg-primary border-primary"
                          : "bg-surface border-border"
                      )}
                    >
                      <Text className="font-semibold text-foreground">
                        {name}
                      </Text>
                      {language === lang && (
                        <Text className="text-foreground">✓</Text>
                      )}
                    </View>
                  </Pressable>
                )
              )}
            </View>
          </View>

          {/* Audio Section */}
          <View className="gap-4 mb-8 p-4 rounded-xl bg-surface border border-border">
            <View className="flex-row justify-between items-center">
              <Text className="text-base font-semibold text-foreground">
                {t("settings.sound")}
              </Text>
              <Switch
                value={audioEnabled}
                onValueChange={handleAudioToggle}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={audioEnabled ? colors.background : colors.muted}
              />
            </View>
          </View>

          {/* Subscription Section */}
          <View className="gap-4 mb-8">
            <Text className="text-sm font-semibold text-muted uppercase">
              {t("settings.subscription")}
            </Text>
            <View className="p-5 rounded-2xl bg-surface border-2 border-border gap-4">
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-base font-semibold text-foreground">
                    {session.isPremium ? t("settings.premium") : t("settings.free")}
                  </Text>
                  {session.isPremium && session.premiumExpiresAt && (
                    <Text className="text-xs text-muted mt-1">
                      Expires: {new Date(session.premiumExpiresAt).toLocaleDateString()}
                    </Text>
                  )}
                </View>
                <Text className="text-2xl">
                  {session.isPremium ? "👑" : "✨"}
                </Text>
              </View>

              {!session.isPremium && (
                <Pressable
                  onPress={handleUpgradePremium}
                  style={({ pressed }) => [
                    {
                      opacity: pressed ? 0.8 : 1,
                      transform: [{ scale: pressed ? 0.97 : 1 }],
                    },
                  ]}
                >
                  <View className="py-3 px-4 rounded-lg bg-primary items-center">
                    <Text className="text-background font-bold">
                      {t("settings.upgrade")}
                    </Text>
                  </View>
                </Pressable>
              )}
            </View>
          </View>

          {/* Disclaimer */}
          <View className="p-4 rounded-xl bg-warning bg-opacity-10 border border-warning gap-2">
            <Text className="text-xs font-semibold text-warning uppercase">
              Disclaimer
            </Text>
            <Text className="text-xs text-foreground leading-relaxed">
              {t("settings.disclaimer")}
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
