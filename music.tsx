import { ScrollView, View, Text, Pressable, Image } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useMusicPlayer } from "@/hooks/use-music-player";
import { useAppContext } from "@/lib/app-context";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { MaterialIcons } from "@expo/vector-icons";
import { cn } from "@/lib/utils";

interface Track {
  id: string;
  title: string;
  duration: string;
  category: "Free" | "Premium";
  isPremium: boolean;
  description: string;
}

const TRACKS: Track[] = [
  {
    id: "gentle-breathing",
    title: "Gentle Breathing",
    duration: "7.5 min",
    category: "Free",
    isPremium: false,
    description: "Calm breathing guide",
  },
  {
    id: "rain-after-midnight",
    title: "Rain After Midnight",
    duration: "15 min",
    category: "Premium",
    isPremium: true,
    description: "Rain atmosphere",
  },
  {
    id: "whispering-forest",
    title: "Whispering Forest",
    duration: "15 min",
    category: "Premium",
    isPremium: true,
    description: "Forest nature sounds",
  },
  {
    id: "velvet-evening",
    title: "Velvet Evening",
    duration: "15 min",
    category: "Premium",
    isPremium: true,
    description: "Smooth jazz relaxation",
  },
  {
    id: "blue-silence",
    title: "Blue Silence",
    duration: "15 min",
    category: "Premium",
    isPremium: true,
    description: "Deep emotional calm jazz",
  },
  {
    id: "slow-city-lights",
    title: "Slow City Lights",
    duration: "15 min",
    category: "Premium",
    isPremium: true,
    description: "Soft lounge night atmosphere",
  },
];

export default function MusicScreen() {
  const colors = useColors();
  const { currentTrack, isPlaying, playTrack, pauseTrack } = useMusicPlayer();
  const { session } = useAppContext();
  const isPremium = session.isPremium;

  const handleTrackPress = (track: Track) => {
    if (track.isPremium && !isPremium) {
      // Show premium modal
      return;
    }

    if (currentTrack?.id === track.id) {
      isPlaying ? pauseTrack() : playTrack(track);
    } else {
      playTrack(track);
    }
  };

  return (
    <ScreenContainer className="pt-24">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="px-6 pb-20">
          {/* Header */}
          <View className="mb-8">
            <Text className="text-4xl font-bold text-foreground mb-2">Soundscapes</Text>
            <Text className="text-muted text-sm">Find your calm moment</Text>
          </View>

          {/* Tracks */}
          <View className="gap-4">
            {TRACKS.map((track) => (
              <TrackCard
                key={track.id}
                track={track}
                isPlaying={currentTrack?.id === track.id && isPlaying}
                isPremiumUser={isPremium}
                onPress={() => handleTrackPress(track)}
                colors={colors}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

interface TrackCardProps {
  track: Track;
  isPlaying: boolean;
  isPremiumUser: boolean;
  onPress: () => void;
  colors: any;
}

function TrackCard({ track, isPlaying, isPremiumUser, onPress, colors }: TrackCardProps) {
  const isLocked = track.isPremium && !isPremiumUser;

  return (
    <Animated.View entering={FadeIn} exiting={FadeOut}>
      <Pressable
        onPress={onPress}
        disabled={isLocked}
        style={({ pressed }) => [
          {
            opacity: pressed && !isLocked ? 0.7 : 1,
          },
        ]}
      >
        <View
          className={cn(
            "rounded-2xl p-4 border",
            isPlaying
              ? "bg-primary/10 border-primary"
              : "bg-surface border-border",
            isLocked && "opacity-60"
          )}
        >
          <View className="flex-row items-center justify-between">
            {/* Track Info */}
            <View className="flex-1">
              <View className="flex-row items-center gap-2 mb-1">
                <Text className="text-lg font-semibold text-foreground">
                  {track.title}
                </Text>
                {isLocked && (
                  <MaterialIcons name="lock" size={16} color={colors.muted} />
                )}
              </View>
              <Text className="text-sm text-muted mb-2">{track.description}</Text>
              <View className="flex-row items-center gap-3">
                <Text className="text-xs text-muted">{track.duration}</Text>
                <View className="bg-primary/20 px-2 py-1 rounded-full">
                  <Text className="text-xs font-medium text-primary">
                    {track.category}
                  </Text>
                </View>
              </View>
            </View>

            {/* Play Button */}
            {!isLocked && (
              <View className="ml-4">
                <View
                  className={cn(
                    "w-12 h-12 rounded-full items-center justify-center",
                    isPlaying ? "bg-primary" : "bg-primary/20"
                  )}
                >
                  <MaterialIcons
                    name={isPlaying ? "pause" : "play-arrow"}
                    size={24}
                    color={isPlaying ? colors.background : colors.primary}
                  />
                </View>
              </View>
            )}

            {/* Lock Icon */}
            {isLocked && (
              <View className="ml-4 w-12 h-12 rounded-full items-center justify-center bg-muted/20">
                <MaterialIcons name="lock" size={24} color={colors.muted} />
              </View>
            )}
          </View>

          {/* Playing Indicator */}
          {isPlaying && (
            <View className="mt-3 h-1 bg-primary/30 rounded-full overflow-hidden">
              <Animated.View
                className="h-full bg-primary"
                style={{ width: "33%" }}
              />
            </View>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
}
