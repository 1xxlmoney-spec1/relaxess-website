/**
 * AudioContext - Unified Audio System Integration
 *
 * ARCHITECTURE:
 * Step 3 (Decision Layer) → Step 4 (Business Rules) → Step 2 (AudioManager) → Step 5 (Debug)
 *
 * This context wires all layers together and exposes the complete audio pipeline.
 */

import React, { createContext, useContext, useEffect, useState, useRef, ReactNode } from "react";
import { AudioManager, AudioTrackType, AUDIO_TRACKS } from "@/lib/_core/audio-manager";
import { decideAudio, type AudioDecisionOutput } from "@/lib/_core/audio-decision-layer";
import { evaluateBusinessRules, type BusinessRulesInput } from "@/lib/_core/audio-business-rules";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface AudioContextType {
  // AudioManager state
  currentTrackId: AudioTrackType | null;
  isPlaying: boolean;

  // Control methods
  play: (trackId: AudioTrackType) => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  stop: () => Promise<void>;

  // Session tracking (for business rules)
  sessionExchangeCount: number;
  sessionStartTime: number | null;
  gentleBreathingPlaysToday: number;
  hasReachedSessionLimit: boolean;
  hasReachedGentleBreathingLimit: boolean;

  // Increment methods
  incrementExchangeCount: () => void;
  resetSessionTracking: () => void;
  incrementGentleBreathingPlays: () => void;
  resetGentleBreathingPlays: () => void;

  // User feedback
  limitNotification: string | null;
  clearNotification: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

// Global AudioManager instance
const audioManager = AudioManager.getInstance();

export function AudioProvider({ children }: { children: ReactNode }) {
  // AudioManager state
  const [currentTrackId, setCurrentTrackId] = useState<AudioTrackType | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Session tracking
  const [sessionExchangeCount, setSessionExchangeCount] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [gentleBreathingPlaysToday, setGentleBreathingPlaysToday] = useState(0);

  // User feedback
  const [limitNotification, setLimitNotification] = useState<string | null>(null);

  // Session timer
  const sessionTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load persisted state on mount
  useEffect(() => {
    const loadState = async () => {
      const savedExchanges = await AsyncStorage.getItem("sessionExchangeCount");
      const savedStartTime = await AsyncStorage.getItem("sessionStartTime");
      const savedBreathing = await AsyncStorage.getItem("gentleBreathingPlaysToday");
      const savedBreathingDate = await AsyncStorage.getItem("gentleBreathingPlayDate");

      if (savedExchanges) setSessionExchangeCount(parseInt(savedExchanges));
      if (savedStartTime) setSessionStartTime(parseInt(savedStartTime));

      // Check if breathing plays are from today
      const today = new Date().toDateString();
      if (savedBreathing && savedBreathingDate === today) {
        setGentleBreathingPlaysToday(parseInt(savedBreathing));
      } else {
        setGentleBreathingPlaysToday(0);
      }
    };

    loadState();
  }, []);

  // Start session timer when chat becomes active
  useEffect(() => {
    if (sessionExchangeCount > 0 && !sessionStartTime) {
      const startTime = Date.now();
      setSessionStartTime(startTime);
      AsyncStorage.setItem("sessionStartTime", startTime.toString());
    }

    if (sessionExchangeCount > 0 && !sessionTimerRef.current) {
      sessionTimerRef.current = setInterval(() => {
        // Timer just counts - actual duration calculated from sessionStartTime
      }, 1000);
    } else if (sessionExchangeCount === 0 && sessionTimerRef.current) {
      clearInterval(sessionTimerRef.current);
      sessionTimerRef.current = null;
    }

    return () => {
      if (sessionTimerRef.current) {
        clearInterval(sessionTimerRef.current);
      }
    };
  }, [sessionExchangeCount, sessionStartTime]);

  /**
   * Calculate session duration in seconds
   */
  const getSessionDurationSeconds = (): number => {
    if (!sessionStartTime) return 0;
    return Math.floor((Date.now() - sessionStartTime) / 1000);
  };

  /**
   * Check if session has reached limits
   */
  const hasReachedSessionLimit = (): boolean => {
    const exchangeLimit = sessionExchangeCount >= 10;
    const durationLimit = getSessionDurationSeconds() >= 30 * 60; // 30 minutes
    return exchangeLimit || durationLimit;
  };

  const hasReachedGentleBreathingLimit = (): boolean => {
    return gentleBreathingPlaysToday >= 2;
  };

  /**
   * STEP 3: Decision Layer
   * Decides WHAT should play based on app state
   */
  const makeDecision = (trackId: AudioTrackType, isPremium: boolean): AudioDecisionOutput => {
    return decideAudio(
      {
        isChatActive: sessionExchangeCount > 0,
        theme: "light",
        selectedSoundscape: null,
        audioEnabled: true,
        isPremium,
      },
      currentTrackId
    );
  };

  /**
   * STEP 4: Business Rules Layer
   * Validates if Decision Layer output is allowed
   */
  const validateWithBusinessRules = (
    decision: AudioDecisionOutput,
    trackId: AudioTrackType,
    isPremium: boolean
  ): { allowed: boolean; message?: string } => {
    const businessRulesInput: BusinessRulesInput = {
      decision,
      chatExchangeCount: sessionExchangeCount,
      chatSessionDurationSeconds: getSessionDurationSeconds(),
      gentleBreathingPlaysToday,
      isPremium,
      currentTrackUrl: currentTrackId || null,
    };

    const rulesOutput = evaluateBusinessRules(businessRulesInput);

    return {
      allowed: rulesOutput.decision === "allow",
      message: rulesOutput.message,
    };
  };

  /**
   * MAIN CONTROL: play()
   *
   * Executes full pipeline:
   * Step 3 → Step 4 → Step 2 → Step 5
   */
  const play = async (trackId: AudioTrackType, isPremium: boolean = false) => {
    console.log("[AudioContext] play() called with trackId:", trackId);
    try {
      // STEP 3: Decision Layer - decide what to play
      const decision = makeDecision(trackId, isPremium);
      console.log("[AudioContext] decision:", decision);

      // STEP 4: Business Rules - validate the decision
      const rulesResult = validateWithBusinessRules(decision, trackId, isPremium);
      console.log("[AudioContext] rulesResult:", rulesResult);

      // If blocked by business rules
      if (!rulesResult.allowed) {
        console.log("[AudioContext] Playback blocked by business rules:", rulesResult.message);
        setLimitNotification(rulesResult.message || "Audio playback not allowed");
        return;
      }
      console.log("[AudioContext] Business rules passed");

      // STEP 2: AudioManager - execute playback
      // Get S3 URL for the track
      const trackUrl = AUDIO_TRACKS[trackId]?.s3Url;
      if (!trackUrl) {
        throw new Error(`Missing S3 URL for track: ${trackId}`);
      }

      if (decision.action === "play") {
        console.log("[AudioContext] Calling audioManager.play() with URL:", trackUrl);
        await audioManager.play(trackUrl);
        console.log("[AudioContext] audioManager.play() completed");
        setCurrentTrackId(trackId);
        setIsPlaying(true);
      } else if (decision.action === "switch") {
        console.log("[AudioContext] Calling audioManager.switch() with URL:", trackUrl);
        await audioManager.switch(trackUrl);
        console.log("[AudioContext] audioManager.switch() completed");
        setCurrentTrackId(trackId);
        setIsPlaying(true);
      } else {
        console.log("[AudioContext] Unknown decision action:", decision.action);
      }

      setLimitNotification(null);
    } catch (error) {
      console.error("[AudioContext] Play error:", error);
      setLimitNotification("Error playing audio");
    }
  };



  /**
   * MAIN CONTROL: pause()
   */
  const pause = async () => {
    try {
      // AudioManager doesn't have pause - use stop
      await audioManager.stop();
      setIsPlaying(false);
    } catch (error) {
      console.error("[AudioContext] Pause error:", error);
    }
  };

  /**
   * MAIN CONTROL: resume()
   */
  const resume = async () => {
    try {
      // AudioManager doesn't have resume - would need to replay
      // For now, just log
      console.log("[AudioContext] resume() not implemented in core engine");
    } catch (error) {
      console.error("[AudioContext] Resume error:", error);
    }
  };

  /**
   * MAIN CONTROL: stop()
   */
  const stop = async () => {
    try {
      await audioManager.stop();
      setIsPlaying(false);
      setCurrentTrackId(null);
      setLimitNotification(null);
    } catch (error) {
      console.error("[AudioContext] Stop error:", error);
    }
  };

  /**
   * Session tracking methods
   */
  const incrementExchangeCount = async () => {
    const newCount = sessionExchangeCount + 1;
    setSessionExchangeCount(newCount);
    await AsyncStorage.setItem("sessionExchangeCount", newCount.toString());

    // Check if limit reached after increment
    if (newCount >= 10) {
      setLimitNotification("Free listening limit reached. You can enjoy more sounds with Premium.");
      await stop();
    }
  };

  const resetSessionTracking = async () => {
    setSessionExchangeCount(0);
    setSessionStartTime(null);
    await AsyncStorage.setItem("sessionExchangeCount", "0");
    await AsyncStorage.removeItem("sessionStartTime");
  };

  const incrementGentleBreathingPlays = async () => {
    const newCount = gentleBreathingPlaysToday + 1;
    setGentleBreathingPlaysToday(newCount);
    const today = new Date().toDateString();
    await AsyncStorage.setItem("gentleBreathingPlaysToday", newCount.toString());
    await AsyncStorage.setItem("gentleBreathingPlayDate", today);

    if (newCount === 1) {
      setLimitNotification("You have 1 free listening session remaining today.");
    } else if (newCount >= 2) {
      setLimitNotification("Daily free listening limit reached. Please return tomorrow or upgrade to Premium.");
      await stop();
    }
  };

  const resetGentleBreathingPlays = async () => {
    setGentleBreathingPlaysToday(0);
    const today = new Date().toDateString();
    await AsyncStorage.setItem("gentleBreathingPlaysToday", "0");
    await AsyncStorage.setItem("gentleBreathingPlayDate", today);
  };

  const clearNotification = () => {
    setLimitNotification(null);
  };

  const value: AudioContextType = {
    currentTrackId,
    isPlaying,
    play,
    pause,
    resume,
    stop,
    sessionExchangeCount,
    sessionStartTime,
    gentleBreathingPlaysToday,
    hasReachedSessionLimit: hasReachedSessionLimit(),
    hasReachedGentleBreathingLimit: hasReachedGentleBreathingLimit(),
    limitNotification,
    clearNotification,
    incrementExchangeCount,
    resetSessionTracking,
    incrementGentleBreathingPlays,
    resetGentleBreathingPlays,
  };

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
}

export function useAudio(): AudioContextType {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within AudioProvider");
  }
  return context;
}
