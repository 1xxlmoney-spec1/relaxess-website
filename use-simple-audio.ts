import { useState, useEffect } from "react";
import { subscribe, getCurrentTrackId, getIsPlaying, stopSound, playTrack } from "@/lib/simple-audio";

/**
 * useSimpleAudio - Hook to subscribe to audio state changes
 * 
 * Provides:
 * - currentTrackId: currently playing track ID
 * - isPlaying: whether audio is currently playing
 * - stop: function to stop audio
 * - play: function to play a track
 */
export function useSimpleAudio() {
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(getCurrentTrackId());
  const [isPlaying, setIsPlaying] = useState<boolean>(getIsPlaying());

  useEffect(() => {
    // Subscribe to state changes
    const unsubscribe = subscribe((state) => {
      setCurrentTrackId(state.currentTrackId);
      setIsPlaying(state.isPlaying);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  return {
    currentTrackId,
    isPlaying,
    stop: stopSound,
    play: playTrack,
  };
}
