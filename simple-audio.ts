/**
 * SimpleAudio.ts - Single Source of Truth for Audio Playback
 * 
 * Manages:
 * - Audio playback (play/stop)
 * - Global state (currentTrackId, isPlaying)
 * - State subscriptions for UI components
 * - Free tier daily play limits (for free users only)
 */

import { validateFreeTierPlayback, recordListeningTime, getListeningSecondsForToday } from "./_core/free-tier-limits";

const DAILY_LIMIT_SECONDS = 1800; // 30 minutes in seconds

let currentAudio: HTMLAudioElement | null = null;
let currentTrackId: string | null = null;
let isPlayingState: boolean = false;
let limitNotificationCallback: ((message: string) => void) | null = null;
let playStartTime: number | null = null; // Track when audio started for listening time
let currentUserIsPremium: boolean = false; // Track current user's premium status
let limitTimer: ReturnType<typeof setTimeout> | null = null; // Hard auto-stop timer for free users

// Subscription system for state changes
type StateChangeCallback = (state: { currentTrackId: string | null; isPlaying: boolean }) => void;
const listeners: Set<StateChangeCallback> = new Set();

/**
 * Subscribe to audio state changes
 */
export function subscribe(callback: StateChangeCallback): () => void {
  listeners.add(callback);
  
  // Return unsubscribe function
  return () => {
    listeners.delete(callback);
  };
}

/**
 * Notify all listeners of state change
 */
function notifyListeners() {
  const state = { currentTrackId, isPlaying: isPlayingState };
  listeners.forEach((callback) => {
    try {
      callback(state);
    } catch (error) {
      console.error("Error in audio state listener:", error);
    }
  });
}

/**
 * Play a track with free-tier limit validation
 */
export async function playTrack(trackId: string, url: string, isPremium: boolean = false) {
  // Store premium status for later use in stopSound
  currentUserIsPremium = isPremium;

  // IF same track is already playing, STOP it
  if (currentTrackId === trackId && currentAudio && !currentAudio.paused) {
    stopSound();
    return;
  }

  // VALIDATE free-tier limits BEFORE playing (only for free users)
  const validation = await validateFreeTierPlayback(trackId as any, isPremium);
  if (!validation.allowed) {
    console.log("[SimpleAudio] Playback blocked by free-tier limits:", validation.message);
    isPlayingState = false;
    notifyListeners();
    // Trigger notification callback if set
    if (limitNotificationCallback && validation.message) {
      limitNotificationCallback(validation.message);
    }
    return;
  }

  // STOP any existing audio
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.src = "";
    currentAudio = null;
  }

  // CREATE new audio
  currentAudio = new Audio(url);
  currentAudio.loop = true;
  currentAudio.volume = 1;

  // Record when playback starts for listening time tracking
  playStartTime = Date.now();

  currentAudio.play().catch(err => {
    console.error("AUDIO PLAY FAILED", err);
    isPlayingState = false;
    playStartTime = null;
    notifyListeners();
  });

  // SET current track
  currentTrackId = trackId;
  isPlayingState = true;

  // PART 1: HARD AUTO-STOP TIMER (CRITICAL)
  // For free users, set a hard timer to stop audio at 30 minutes
  if (!isPremium) {
    // Get remaining listening time for this track
    const listeningSeconds = await getListeningSecondsForToday(trackId as any);
    const remainingMs = (DAILY_LIMIT_SECONDS - listeningSeconds) * 1000;
    
    if (remainingMs > 0) {
      // Clear any existing timer
      if (limitTimer) {
        clearTimeout(limitTimer);
      }
      
      // Set new timer to auto-stop when limit is reached
      limitTimer = setTimeout(() => {
        console.log("[SimpleAudio] 30-minute limit reached. Auto-stopping.");
        stopSound();
        if (limitNotificationCallback) {
          limitNotificationCallback("Daily limit reached. Premium users enjoy unlimited listening.");
        }
      }, remainingMs);
      
      console.log(`[SimpleAudio] Hard auto-stop timer set for ${remainingMs / 1000}s (${Math.floor(remainingMs / 1000 / 60)}m remaining)`);
    }
  }

  // Notify listeners
  notifyListeners();

  return currentAudio;
}

/**
 * Stop audio playback
 */
export function stopSound() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.src = "";
    currentAudio = null;
  }
  
  // CLEAR hard auto-stop timer
  if (limitTimer) {
    clearTimeout(limitTimer);
    limitTimer = null;
  }
  
  // Record listening time before clearing track (only for free users)
  if (currentTrackId && playStartTime) {
    const elapsedSeconds = Math.floor((Date.now() - playStartTime) / 1000);
    recordListeningTime(currentTrackId as any, elapsedSeconds, currentUserIsPremium);
  }
  
  currentTrackId = null;
  isPlayingState = false;
  playStartTime = null;

  // Notify listeners
  notifyListeners();
}

/**
 * Get current track ID
 */
export function getCurrentTrackId(): string | null {
  return currentTrackId;
}

/**
 * Get current playing state
 */
export function getIsPlaying(): boolean {
  return isPlayingState;
}

/**
 * Get current state
 */
export function getAudioState() {
  return {
    currentTrackId,
    isPlaying: isPlayingState,
  };
}

/**
 * Set notification callback for limit messages
 */
export function setLimitNotificationCallback(callback: (message: string) => void) {
  limitNotificationCallback = callback;
}

/**
 * Get remaining listening seconds for a track (for UI display)
 * Returns Infinity for premium users
 */
export async function getRemainingListeningSeconds(trackId: string, isPremium: boolean): Promise<number> {
  if (isPremium) {
    return Infinity;
  }
  
  const listeningSeconds = await getListeningSecondsForToday(trackId as any);
  return Math.max(0, DAILY_LIMIT_SECONDS - listeningSeconds);
}
