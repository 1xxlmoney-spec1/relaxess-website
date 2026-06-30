/**
 * Audio Decision Layer (Step 3)
 *
 * ROLE: Decide WHAT audio should play and resolve to S3 URLs
 *
 * CRITICAL RULE: This layer NEVER plays audio directly.
 * It ONLY produces executable commands for AudioManager.
 *
 * INPUT SIGNALS:
 * - chat session state (active / inactive)
 * - theme (light / dark)
 * - soundscape selection (manual / none)
 * - audio toggle (ON / OFF)
 * - subscription status (free / premium — for tagging only)
 *
 * OUTPUT: AudioManager commands (switch/play/stop) with S3 URLs
 *
 * PRIORITY SYSTEM:
 * 1. Manual soundscape (HIGHEST) — always override chat audio
 * 2. Chat session audio (AUTO MODE) — theme-based
 * 3. No audio state (LOWEST) — stop immediately
 */

// S3 Audio Registry - Single Source of Truth
const AUDIO_S3_REGISTRY: Record<string, string> = {
  "calm-oceanic-tide": "https://calmspace-audio.s3.us-east-1.amazonaws.com/calm-oceanic-tide.mp3",
  "summer-night": "https://calmspace-audio.s3.us-east-1.amazonaws.com/summer-night.mp3",
  "gentle-breathing": "https://calmspace-audio.s3.us-east-1.amazonaws.com/gentle-breathing.mp3",
  "rain-after-midnight": "https://calmspace-audio.s3.us-east-1.amazonaws.com/rain-after-midnight.mp3",
  "whispering-forest": "https://calmspace-audio.s3.us-east-1.amazonaws.com/whispering-forest.mp3",
  "velvet-evening": "https://calmspace-audio.s3.us-east-1.amazonaws.com/velvet-evening.mp3",
  "blue-silence": "https://calmspace-audio.s3.us-east-1.amazonaws.com/blue-silence.mp3",
  "slow-city-lights": "https://calmspace-audio.s3.us-east-1.amazonaws.com/slow-city-lights.mp3",
  "cozy-fireplace": "https://calmspace-audio.s3.us-east-1.amazonaws.com/cozy-fireplace.mp3",
  "my-own-place": "https://calmspace-audio.s3.us-east-1.amazonaws.com/my-own-place.mp3",
  "gentle-purring": "https://calmspace-audio.s3.us-east-1.amazonaws.com/gentle-purring.mp3",
};

// Soundscape → Track mapping
const SOUNDSCAPE_TRACK_MAP: Record<string, string> = {
  "rain-scene": "rain-after-midnight",
  "fireplace-scene": "cozy-fireplace",
  "cat-scene": "gentle-purring",
  "forest-scene": "whispering-forest",
  "evening-scene": "velvet-evening",
  "city-scene": "slow-city-lights",
  "ocean-scene": "calm-oceanic-tide",
  "night-scene": "summer-night",
  "breathing-scene": "gentle-breathing",
  "silence-scene": "blue-silence",
  "place-scene": "my-own-place",
};

export interface AudioDecisionInput {
  // Chat state
  isChatActive: boolean;

  // Theme
  theme: "light" | "dark";

  // Soundscape selection
  selectedSoundscape: string | null;

  // Audio toggle
  audioEnabled: boolean;

  // Subscription status (for tagging only, not blocking)
  isPremium: boolean;
}

export interface AudioDecisionOutput {
  // Action type
  action: "play" | "switch" | "stop" | "none";

  // S3 URL (only if action is play/switch)
  trackUrl?: string;

  // Debug info
  reason?: string;
}

/**
 * Resolve track name to S3 URL
 */
function resolveTrackToUrl(trackName: string): string | null {
  return AUDIO_S3_REGISTRY[trackName] || null;
}

/**
 * Resolve soundscape to track name
 */
function resolveSoundscapeToTrack(soundscape: string): string | null {
  return SOUNDSCAPE_TRACK_MAP[soundscape] || null;
}

/**
 * Audio Decision Algorithm
 *
 * Evaluates priority rules and determines what should play.
 * Returns executable command for AudioManager.
 */
export function decideAudio(
  input: AudioDecisionInput,
  currentAudioUrl: string | null
): AudioDecisionOutput {
  // PRIORITY 1: Manual Soundscape (HIGHEST)
  if (input.selectedSoundscape) {
    const trackName = resolveSoundscapeToTrack(input.selectedSoundscape);
    if (trackName) {
      const trackUrl = resolveTrackToUrl(trackName);
      if (trackUrl) {
        // Always switch to manual soundscape
        if (currentAudioUrl !== trackUrl) {
          return {
            action: "switch",
            trackUrl,
            reason: `Manual soundscape: ${input.selectedSoundscape}`,
          };
        }
        // Already playing this track
        return {
          action: "none",
          reason: `Already playing: ${input.selectedSoundscape}`,
        };
      }
    }
  }

  // PRIORITY 2: Chat Session Audio (AUTO MODE)
  if (input.isChatActive && input.audioEnabled) {
    // Theme-based track selection
    const trackName = input.theme === "light" ? "calm-oceanic-tide" : "summer-night";
    const trackUrl = resolveTrackToUrl(trackName);

    if (trackUrl) {
      // Switch if different from current
      if (currentAudioUrl !== trackUrl) {
        return {
          action: "switch",
          trackUrl,
          reason: `Chat session audio (${input.theme} theme)`,
        };
      }
      // Already playing this track
      return {
        action: "none",
        reason: `Already playing chat audio (${input.theme} theme)`,
      };
    }
  }

  // PRIORITY 3: No Audio State (LOWEST)
  // If audio is OFF or no valid playback condition exists
  if (currentAudioUrl) {
    return {
      action: "stop",
      reason: "No valid playback condition",
    };
  }

  // Already stopped
  return {
    action: "none",
    reason: "Already stopped",
  };
}

/**
 * Execute decision output on AudioManager
 *
 * This function bridges the decision layer to the core engine.
 * It translates decisions into AudioManager commands.
 */
export async function executeAudioDecision(
  decision: AudioDecisionOutput,
  audioManager: any
): Promise<void> {
  switch (decision.action) {
    case "play":
      if (decision.trackUrl) {
        console.log(`[AudioDecision] play() → ${decision.trackUrl}`);
        await audioManager.play(decision.trackUrl);
      }
      break;

    case "switch":
      if (decision.trackUrl) {
        console.log(`[AudioDecision] switch() → ${decision.trackUrl}`);
        await audioManager.switch(decision.trackUrl);
      }
      break;

    case "stop":
      console.log("[AudioDecision] stop()");
      await audioManager.stop();
      break;

    case "none":
      // No action needed
      break;
  }
}
