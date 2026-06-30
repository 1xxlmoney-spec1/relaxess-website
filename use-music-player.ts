import { useRef, useState, useCallback, useEffect } from "react";
import { useAudio } from "@/lib/audio-context";
import { AudioTrackType } from "@/lib/_core/audio-manager";
import { useAppContext } from "@/lib/app-context";

interface Track {
  id: string;
  title: string;
  duration: string;
  category: "Free" | "Premium";
  isPremium: boolean;
  description: string;
}

/**
 * useMusicPlayer - Full AudioContext Integration
 * Connects UI track selection to AudioContext playback pipeline
 */
export function useMusicPlayer() {
  const audio = useAudio();
  const { session } = useAppContext();
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  console.log("[useMusicPlayer] Hook initialized");

  // Sync with AudioContext state
  useEffect(() => {
    console.log("[useMusicPlayer] useEffect - audio state changed", {
      currentTrackId: audio.currentTrackId,
      audioIsPlaying: audio.isPlaying,
    });
    if (audio.currentTrackId) {
      setCurrentTrack({
        id: audio.currentTrackId,
        title: audio.currentTrackId,
        duration: "",
        category: "Free",
        isPremium: false,
        description: "",
      });
      setIsPlaying(audio.isPlaying);
    } else {
      setCurrentTrack(null);
      setIsPlaying(false);
    }
  }, [audio.currentTrackId, audio.isPlaying]);

  const playTrack = useCallback(
    async (track: Track) => {
      console.log("[useMusicPlayer] playTrack() called");
      console.log("  trackId =", track.id);
      console.log("  trackTitle =", track.title);
      console.log("  sessionIsPremium =", session.isPremium);
      
      try {
        // Call AudioContext.play() with track ID
        console.log("[useMusicPlayer] Calling audio.play()");
        await audio.play(track.id as AudioTrackType);
        console.log("[useMusicPlayer] audio.play() completed");
        
        // Update local state
        setCurrentTrack(track);
        setIsPlaying(true);
        console.log("[useMusicPlayer] Local state updated");
      } catch (error) {
        console.error("[useMusicPlayer] playTrack error:", error);
      }
    },
    [audio, session.isPremium]
  );

  const pauseTrack = useCallback(async () => {
    console.log("[useMusicPlayer] pauseTrack() called");
    try {
      await audio.pause();
      setIsPlaying(false);
      console.log("[useMusicPlayer] pauseTrack() completed");
    } catch (error) {
      console.error("[useMusicPlayer] pauseTrack error:", error);
    }
  }, [audio]);

  const resumeTrack = useCallback(async () => {
    console.log("[useMusicPlayer] resumeTrack() called");
    try {
      await audio.resume();
      setIsPlaying(true);
      console.log("[useMusicPlayer] resumeTrack() completed");
    } catch (error) {
      console.error("[useMusicPlayer] resumeTrack error:", error);
    }
  }, [audio]);

  return {
    currentTrack,
    isPlaying,
    playTrack,
    pauseTrack,
    resumeTrack,
  };
}
