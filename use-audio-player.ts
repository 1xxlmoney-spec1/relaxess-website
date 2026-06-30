import { useEffect, useState } from "react";
import { useAudioPlayer as useExpoAudioPlayer, type AudioPlayer } from "expo-audio";
import { useAudio } from "@/lib/audio-context";
import { AudioTrackType, AUDIO_TRACKS } from "@/lib/_core/audio-manager";

/**
 * Hook to manage audio playback for a specific track
 * Integrates with the global AudioContext to ensure only one track plays at a time
 */
export function useAudioPlayerHook(trackId: AudioTrackType) {
  const { currentTrackId, isPlaying, play, pause, resume, stop } = useAudio();
  const [player, setPlayer] = useState<AudioPlayer | null>(null);

  const track = AUDIO_TRACKS[trackId];
  const isCurrentTrack = currentTrackId === trackId;

  // Create audio player for this track
  useEffect(() => {
    const createPlayer = async () => {
      try {
        const audioUri = getAudioUri(trackId);
        const newPlayer = useExpoAudioPlayer(audioUri);
        // Note: isLooping and shouldPlay are set via player methods
        setPlayer(newPlayer);
      } catch (error) {
        console.error(`[useAudioPlayerHook] Failed to create player for ${trackId}:`, error);
      }
    };

    createPlayer();
  }, [trackId]);

  // Handle playback based on global state
  useEffect(() => {
    if (!player) return;

    const syncPlayback = async () => {
      if (isCurrentTrack && isPlaying) {
        // Play this track
        try {
          await player.play();
        } catch (error) {
          console.error(`[useAudioPlayerHook] Failed to play ${trackId}:`, error);
        }
      } else if (isCurrentTrack && !isPlaying) {
        // Pause this track
        try {
          await player.pause();
        } catch (error) {
          console.error(`[useAudioPlayerHook] Failed to pause ${trackId}:`, error);
        }
      } else if (!isCurrentTrack) {
        // Stop this track if another is playing
        try {
          await player.pause();
        } catch (error) {
          console.error(`[useAudioPlayerHook] Failed to stop ${trackId}:`, error);
        }
      }
    };

    syncPlayback();
  }, [player, isCurrentTrack, isPlaying, trackId]);

  return {
    player,
    isCurrentTrack,
    isPlaying: isCurrentTrack && isPlaying,
    play: () => play(trackId),
    pause,
    resume,
    stop,
    track,
  };
}

function getAudioUri(trackId: AudioTrackType): string {
  // Use S3 URLs from AUDIO_TRACKS
  const track = AUDIO_TRACKS[trackId];
  if (!track) {
    throw new Error(`Track not found: ${trackId}`);
  }
  return track.s3Url;
}
