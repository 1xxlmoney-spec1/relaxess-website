import { View, Text, Pressable } from "react-native";
import { ScreenContainer } from "@/components/screen-container";

export default function AudioTestScreen() {
  const handleTest = async () => {
    console.log("[PURE TEST] Starting pure HTMLAudioElement test");

    const audio = new Audio(
      "https://calmspace-audio.s3.us-east-1.amazonaws.com/gentle-breathing.mp3"
    );

    audio.loop = true;
    audio.volume = 1;

    console.log("[PURE TEST] Audio element created");
    console.log("[PURE TEST] src =", audio.src);

    audio.oncanplay = () => {
      console.log("[PURE TEST] CAN PLAY");
    };

    audio.onerror = (e) => {
      console.error("[PURE TEST] AUDIO ERROR", e);
    };

    console.log("[PURE TEST] Event listeners attached");

    try {
      console.log("[PURE TEST] Calling audio.play()");
      await audio.play();
      console.log("[PURE TEST] PURE AUDIO PLAY SUCCESS");
    } catch (e) {
      console.error("[PURE TEST] PURE AUDIO PLAY FAILED", e);
    }
  };

  return (
    <ScreenContainer className="items-center justify-center">
      <View className="gap-4">
        <Text className="text-2xl font-bold text-foreground">Pure Audio Test</Text>
        <Text className="text-sm text-muted mb-4">
          Click button to test raw HTMLAudioElement
        </Text>
        <Pressable
          onPress={handleTest}
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? "#0a7ea4" : "#0a7ea480",
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 8,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
        >
          <Text className="text-white font-semibold text-center">Play Test Audio</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}
