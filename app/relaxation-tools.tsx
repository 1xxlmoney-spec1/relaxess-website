import { ScrollView, Text, View, Pressable, Platform } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useAppContext } from "@/lib/app-context";
import { useTranslation } from "@/lib/i18n";
import { useRouter } from "expo-router";
import { useColors } from "@/hooks/use-colors";
import { cn } from "@/lib/utils";
import * as Haptics from "expo-haptics";

interface RelaxationTool {
  id: string;
  titleKey: string;
  descriptionKey: string;
  isPremium: boolean;
  href: '/' | '/breathing' | '/sleep' | '/grounding' | '/quiet';
  icon: string;
}

const RELAXATION_TOOLS: RelaxationTool[] = [
  {
    id: "breathing",
    titleKey: "tools.breathing",
    descriptionKey: "breathing.title",
    isPremium: false,
    href: "/breathing",
    icon: "🫁",
  },
  {
    id: "sleep",
    titleKey: "tools.sleep",
    descriptionKey: "sleep.title",
    isPremium: true,
    href: "/sleep",
    icon: "😴",
  },
  {
    id: "grounding",
    titleKey: "tools.grounding",
    descriptionKey: "grounding.title",
    isPremium: true,
    href: "/grounding",
    icon: "🌍",
  },
  {
    id: "quiet",
    titleKey: "tools.quiet",
    descriptionKey: "quiet.title",
    isPremium: true,
    href: "/quiet",
    icon: "🤫",
  },
];

export default function RelaxationToolsScreen() {
  const { language, session } = useAppContext();
  const { t } = useTranslation(language);
  const router = useRouter();
  const colors = useColors();

  const handleToolPress = (tool: RelaxationTool) => {
    if (tool.isPremium && !session.isPremium) {
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      // TODO: Show premium upgrade modal
      return;
    }

    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    router.push(tool.href);
  };

  const handleBack = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
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
          <View className="flex-row justify-between items-center mb-8">
            <Pressable
              onPress={handleBack}
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.6 : 1,
                },
              ]}
            >
              <Text className="text-primary font-semibold">{t("common.back")}</Text>
            </Pressable>
            <Text className="text-2xl font-bold text-foreground">
              {t("tools.title")}
            </Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Tools Grid */}
          <View className="gap-4">
            {RELAXATION_TOOLS.map((tool) => {
              const isLocked = tool.isPremium && !session.isPremium;

              return (
                <Pressable
                  key={tool.id}
                  onPress={() => handleToolPress(tool)}
                  disabled={isLocked}
                  style={({ pressed }) => [
                    {
                      opacity: isLocked ? 0.6 : pressed ? 0.8 : 1,
                      transform: [{ scale: isLocked ? 1 : pressed ? 0.97 : 1 }],
                    },
                  ]}
                >
                  <View
                    className={cn(
                      "p-6 rounded-2xl border-2 gap-3",
                      isLocked
                        ? "bg-surface border-border opacity-60"
                        : "bg-surface border-primary"
                    )}
                  >
                    <View className="flex-row justify-between items-start">
                      <View className="flex-1 gap-2">
                        <Text className="text-xl font-bold text-foreground">
                          {t(tool.titleKey)}
                        </Text>
                        <Text className="text-sm text-muted">
                          {t(tool.descriptionKey)}
                        </Text>
                      </View>
                      <Text className="text-3xl">{tool.icon}</Text>
                    </View>

                    {isLocked && (
                      <View className="mt-2 pt-2 border-t border-border">
                        <Text className="text-xs font-semibold text-warning">
                          {t("tools.premiumOnly")}
                        </Text>
                      </View>
                    )}
                  </View>
                </Pressable>
              );
            })}
          </View>

          {/* Premium Upgrade CTA */}
          {!session.isPremium && (
            <View className="mt-8 p-6 rounded-2xl bg-primary bg-opacity-10 border border-primary gap-3">
              <Text className="text-lg font-bold text-primary">
                {t("premium.title")}
              </Text>
              <Text className="text-sm text-foreground">
                Unlock all relaxation tools and unlimited AI messages.
              </Text>
              <Pressable
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.8 : 1,
                    transform: [{ scale: pressed ? 0.97 : 1 }],
                  },
                ]}
              >
                <View className="py-3 px-4 rounded-xl bg-primary items-center">
                  <Text className="text-background font-bold">
                    {t("premium.subscribe")}
                  </Text>
                </View>
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
