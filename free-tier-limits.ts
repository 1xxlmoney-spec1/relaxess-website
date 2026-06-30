/**
 * FreeTierLimits - Daily listening time limit system for free users ONLY
 * 
 * RULES:
 * - Free users: max 1800 seconds (30 minutes) per 24 hours per free track
 * - Only applies to 3 free tracks: ocean, summer-night, gentle-breathing
 * - Premium users: NO LIMITS (bypass all checks)
 * - Resets automatically every 24 hours (based on local device date)
 * - Persisted in AsyncStorage
 * - Tracks ACTUAL LISTENING TIME, not play button clicks
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { AudioTrackType } from "./audio-manager";

// Storage keys
const LISTENING_SECONDS_PREFIX = "free_tier_listening_seconds_";
const LISTENING_DATE_PREFIX = "free_tier_listening_date_";

// Free tracks allowed for free users
const FREE_TIER_TRACKS: AudioTrackType[] = ["ocean", "summer-night", "gentle-breathing"];

// Max listening seconds per 24 hours for free users (30 minutes)
const DAILY_LIMIT_SECONDS = 1800;

/**
 * Get today's date as a string (YYYY-MM-DD)
 */
function getTodayString(): string {
  return new Date().toDateString();
}

/**
 * Check if a track is a free tier track
 */
function isFreeTierTrack(trackId: AudioTrackType): boolean {
  return FREE_TIER_TRACKS.includes(trackId);
}

/**
 * Get the total listening seconds for a track today
 */
export async function getListeningSecondsForToday(trackId: AudioTrackType): Promise<number> {
  try {
    const secondsKey = `${LISTENING_SECONDS_PREFIX}${trackId}`;
    const dateKey = `${LISTENING_DATE_PREFIX}${trackId}`;

    const savedSeconds = await AsyncStorage.getItem(secondsKey);
    const savedDate = await AsyncStorage.getItem(dateKey);
    const today = getTodayString();

    // If date doesn't match today, reset seconds
    if (savedDate !== today) {
      await AsyncStorage.setItem(secondsKey, "0");
      await AsyncStorage.setItem(dateKey, today);
      return 0;
    }

    return savedSeconds ? parseInt(savedSeconds, 10) : 0;
  } catch (error) {
    console.error("[FreeTierLimits] Error getting listening seconds:", error);
    return 0;
  }
}

/**
 * Add listening seconds to a track's daily total
 */
async function addListeningSeconds(trackId: AudioTrackType, seconds: number): Promise<void> {
  try {
    const secondsKey = `${LISTENING_SECONDS_PREFIX}${trackId}`;
    const dateKey = `${LISTENING_DATE_PREFIX}${trackId}`;
    const today = getTodayString();

    const currentSeconds = await getListeningSecondsForToday(trackId);
    const newSeconds = Math.min(currentSeconds + seconds, DAILY_LIMIT_SECONDS); // Cap at limit

    await AsyncStorage.setItem(secondsKey, newSeconds.toString());
    await AsyncStorage.setItem(dateKey, today);

  } catch (error) {
    console.error("[FreeTierLimits] Error adding listening seconds:", error);
  }
}

/**
 * MAIN VALIDATION FUNCTION - ONLY FOR FREE USERS
 * 
 * Call this BEFORE attempting to play audio.
 * 
 * @param trackId - Track to validate
 * @param isPremium - User premium status
 * @returns { allowed: boolean, remainingSeconds: number, message?: string }
 */
export async function validateFreeTierPlayback(
  trackId: AudioTrackType,
  isPremium: boolean
): Promise<{ allowed: boolean; remainingSeconds: number; message?: string }> {
  // Premium users: no limits, always allowed
  if (isPremium) {
    return { allowed: true, remainingSeconds: Infinity };
  }

  // Not a free tier track: allow (premium-only tracks are blocked elsewhere)
  if (!isFreeTierTrack(trackId)) {
    return { allowed: true, remainingSeconds: Infinity };
  }

  // Free user trying to play a free tier track: check daily listening limit
  const listeningSeconds = await getListeningSecondsForToday(trackId);
  const remainingSeconds = Math.max(0, DAILY_LIMIT_SECONDS - listeningSeconds);

  if (remainingSeconds <= 0) {
    return {
      allowed: false,
      remainingSeconds: 0,
      message: "Daily limit reached\nReturn tomorrow or enjoy unlimited listening with Relaxess Premium.",
    };
  }

  return { allowed: true, remainingSeconds };
}

/**
 * RECORD LISTENING TIME - ONLY FOR FREE USERS
 * 
 * Call this when audio stops to record how long the user actually listened.
 * Only records for free tier tracks.
 * 
 * @param trackId - Track that was played
 * @param elapsedSeconds - How many seconds the user actually listened
 * @param isPremium - User premium status (skip recording if premium)
 */
export async function recordListeningTime(
  trackId: AudioTrackType,
  elapsedSeconds: number,
  isPremium: boolean
): Promise<void> {
  // Premium users: do not record (no limits)
  if (isPremium) {
    return;
  }

  // Only record for free tier tracks
  if (isFreeTierTrack(trackId)) {
    await addListeningSeconds(trackId, elapsedSeconds);
  }
}

/**
 * DEBUG: Get all listening times (for testing)
 */
export async function getDebugListeningTimes(): Promise<Record<string, { seconds: number; date: string; remaining: number }>> {
  try {
    const times: Record<string, { seconds: number; date: string; remaining: number }> = {};

    for (const trackId of FREE_TIER_TRACKS) {
      const secondsKey = `${LISTENING_SECONDS_PREFIX}${trackId}`;
      const dateKey = `${LISTENING_DATE_PREFIX}${trackId}`;

      const seconds = await AsyncStorage.getItem(secondsKey);
      const date = await AsyncStorage.getItem(dateKey);
      const secondsNum = seconds ? parseInt(seconds, 10) : 0;

      times[trackId] = {
        seconds: secondsNum,
        date: date || "never",
        remaining: Math.max(0, DAILY_LIMIT_SECONDS - secondsNum),
      };
    }

    return times;
  } catch (error) {
    console.error("[FreeTierLimits] Error getting debug times:", error);
    return {};
  }
}

/**
 * DEBUG: Reset all listening times (for testing)
 */
export async function resetDebugListeningTimes(): Promise<void> {
  try {
    for (const trackId of FREE_TIER_TRACKS) {
      const secondsKey = `${LISTENING_SECONDS_PREFIX}${trackId}`;
      const dateKey = `${LISTENING_DATE_PREFIX}${trackId}`;

      await AsyncStorage.removeItem(secondsKey);
      await AsyncStorage.removeItem(dateKey);
    }

  } catch (error) {
    console.error("[FreeTierLimits] Error resetting listening times:", error);
  }
}
