/**
 * AudioController - UNIFIED AUDIO PLAYBACK ARCHITECTURE
 * 
 * Single source of truth for all audio playback.
 * 
 * RESPONSIBILITIES:
 * 1. Single entry point: playAudio(trackId)
 * 2. Mandatory validation: free-tier limits + premium checks
 * 3. Unified notification system
 * 4. State management
 * 5. Hard enforcement of business rules
 * 
 * NO OTHER COMPONENT is allowed to call playTrack() or audio APIs directly.
 */

import { playTrack, stopSound, getCurrentTrackId, setLimitNotificationCallback } from "./simple-audio";
import { validateFreeTierPlayback } from "./_core/free-tier-limits";
import { AUDIO_TRACKS, AudioTrackType } from "./_core/audio-manager";

// Notification callback - internal only
let notificationHandler: ((message: string) => void) | null = null;

/**
 * Register notification handler (called from GlobalAudioBar)
 */
export function registerNotificationHandler(handler: (message: string) => void) {
  notificationHandler = handler;
  // Also register with simple-audio so limit messages flow through the same handler
  setLimitNotificationCallback(handler);
}

/**
 * Trigger notification (internal only)
 */
function notifyUser(message: string) {
  if (notificationHandler) {
    notificationHandler(message);
  }
}

/**
 * UNIFIED AUDIO PLAYBACK ENTRY POINT
 * 
 * This is the ONLY way to play audio in the entire app.
 * 
 * @param trackId - Track to play
 * @param isPremium - User premium status (from session.isPremium)
 * @returns true if playback started, false if blocked
 */
export async function playAudio(
  trackId: AudioTrackType,
  isPremium: boolean
): Promise<boolean> {
  try {
    // Get track metadata
    const track = AUDIO_TRACKS[trackId];
    if (!track) {
      console.error("[AudioController] Track not found:", trackId);
      notifyUser("Track not found");
      return false;
    }

    // GATE 1: Check if user has access to this track (premium-only)
    if (track.isPremium && !isPremium) {
      notifyUser(`Unlock ${track.name} with Premium`);
      return false;
    }

    // GATE 2: Check free-tier daily limits (MANDATORY)
    const limitValidation = await validateFreeTierPlayback(trackId, isPremium);
    if (!limitValidation.allowed) {
      notifyUser(limitValidation.message || "Daily limit reached\nReturn tomorrow or enjoy unlimited listening with Relaxess Premium.");
      return false;
    }

    // GATE 3: All validations passed - play audio
    
    // If same track is already playing, stop it
    const currentTrackId = getCurrentTrackId();
    if (currentTrackId === trackId) {
      stopSound();
      return false;
    }

    // Play the track
    await playTrack(trackId, track.s3Url, isPremium);

    // Note: Listening time is recorded in simple-audio.ts when audio stops

    return true;
  } catch (error) {
    console.error("[AudioController] Playback error:", error);
    notifyUser("Error playing audio");
    return false;
  }
}

/**
 * Stop audio playback
 */
export function stopAudio() {
  stopSound();
}

/**
 * Get current track ID
 */
export function getCurrentAudio(): string | null {
  return getCurrentTrackId();
}
