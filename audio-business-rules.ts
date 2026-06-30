/**
 * Audio Business Rules Layer (Step 4)
 *
 * ROLE: Permission gate between Decision Layer and AudioManager
 *
 * This layer validates or restricts audio decisions based on:
 * - Chat session activity (exchanges, duration)
 * - Soundscape usage counters
 * - Subscription status (free / premium)
 *
 * CRITICAL: This layer does NOT choose tracks.
 * It only allows or blocks decisions from Step 3.
 *
 * Output: ALLOW / BLOCK / MODIFY-TO-STOP
 */

export interface BusinessRulesInput {
  // Decision Layer output
  decision: {
    action: "play" | "switch" | "stop" | "none";
    trackUrl?: string;
    reason?: string;
  };

  // Chat session activity
  chatExchangeCount: number;
  chatSessionDurationSeconds: number;

  // Soundscape usage
  gentleBreathingPlaysToday: number;

  // Subscription status
  isPremium: boolean;

  // Current audio state
  currentTrackUrl: string | null;
}

export interface BusinessRulesOutput {
  // Decision: allow, block, or modify
  decision: "allow" | "block" | "modify-to-stop";

  // Message to user (if blocking)
  message?: string;

  // Modified action (if decision is modify-to-stop)
  modifiedAction?: "stop";

  // Debug info
  reason?: string;
}

/**
 * Track type detection
 */
function getTrackType(trackUrl: string | undefined): "chat-audio" | "gentle-breathing" | "soundscape" | null {
  if (!trackUrl) return null;

  // Chat audio tracks
  if (trackUrl.includes("calm-oceanic-tide") || trackUrl.includes("summer-night")) {
    return "chat-audio";
  }

  // Gentle Breathing
  if (trackUrl.includes("gentle-breathing")) {
    return "gentle-breathing";
  }

  // All other tracks are soundscapes
  return "soundscape";
}

/**
 * RULE 1: Chat Audio Limit (Free Users Only)
 *
 * Applies to: Calm Oceanic Tide, Summer Night
 * Free limit: 10 exchanges OR 30 minutes, whichever first
 * Premium: Unlimited
 */
function checkChatAudioLimit(input: BusinessRulesInput): BusinessRulesOutput | null {
  // Only applies to chat audio
  const trackType = getTrackType(input.decision.trackUrl);
  if (trackType !== "chat-audio") {
    return null;
  }

  // Premium users: no limit
  if (input.isPremium) {
    return null;
  }

  // Free users: check limits
  const exchangeLimit = input.chatExchangeCount >= 10;
  const durationLimitSeconds = input.chatSessionDurationSeconds >= 30 * 60; // 30 minutes

  if (exchangeLimit || durationLimitSeconds) {
    return {
      decision: "block",
      message: "Free listening limit reached. You can enjoy more sounds with Premium.",
      reason: `Chat audio limit exceeded (exchanges: ${input.chatExchangeCount}, duration: ${Math.floor(input.chatSessionDurationSeconds / 60)}min)`,
    };
  }

  return null;
}

/**
 * RULE 2: Gentle Breathing Limit (Free Users Only)
 *
 * Track: Gentle Breathing
 * Free limit: 2 plays per day
 * Premium: Unlimited
 */
function checkGentleBreathingLimit(input: BusinessRulesInput): BusinessRulesOutput | null {
  // Only applies to Gentle Breathing
  const trackType = getTrackType(input.decision.trackUrl);
  if (trackType !== "gentle-breathing") {
    return null;
  }

  // Premium users: no limit
  if (input.isPremium) {
    return null;
  }

  // Free users: check daily limit
  if (input.gentleBreathingPlaysToday >= 2) {
    return {
      decision: "block",
      message: "Daily free listening limit reached. Please return tomorrow or upgrade to Premium.",
      reason: `Gentle Breathing daily limit reached (${input.gentleBreathingPlaysToday} plays today)`,
    };
  }

  return null;
}

/**
 * RULE 3: Premium Override
 *
 * If premium: ignore all limits
 */
function checkPremiumOverride(input: BusinessRulesInput): BusinessRulesOutput | null {
  if (input.isPremium) {
    return {
      decision: "allow",
      reason: "Premium user - no limits applied",
    };
  }

  return null;
}

/**
 * RULE 4: Soundscape Protection Rule
 *
 * Manual soundscapes (non-chat-audio):
 * - Free users: BLOCK except Gentle Breathing
 * - Premium users: ALLOW ALL
 */
function checkSoundscapeAccess(input: BusinessRulesInput): BusinessRulesOutput | null {
  const trackType = getTrackType(input.decision.trackUrl);

  // Only applies to soundscapes (not chat-audio, not gentle-breathing)
  if (trackType !== "soundscape") {
    return null;
  }

  // Premium users: allow all
  if (input.isPremium) {
    return null;
  }

  // Free users: block all soundscapes
  return {
    decision: "block",
    message: "This soundscape is available with Premium. Upgrade to unlock all sounds.",
    reason: "Free user attempting to access premium soundscape",
  };
}

/**
 * RULE 5: Audio Safety Override
 *
 * If decision is "none" but audio is playing: send STOP
 * Prevents orphaned playback
 */
function checkAudioSafety(input: BusinessRulesInput): BusinessRulesOutput | null {
  // If decision is "none" and audio is currently playing
  if (input.decision.action === "none" && input.currentTrackUrl) {
    return {
      decision: "modify-to-stop",
      modifiedAction: "stop",
      reason: "Audio safety: stopping orphaned playback",
    };
  }

  return null;
}

/**
 * RULE: Stop Actions Always Pass
 *
 * Stop commands are never blocked
 */
function checkStopAction(input: BusinessRulesInput): BusinessRulesOutput | null {
  if (input.decision.action === "stop") {
    return {
      decision: "allow",
      reason: "Stop action always allowed",
    };
  }

  return null;
}

/**
 * Business Rules Engine
 *
 * Evaluates all rules in order and returns first applicable decision.
 * Rules are evaluated in priority order.
 */
export function evaluateBusinessRules(input: BusinessRulesInput): BusinessRulesOutput {
  // Rule: Stop actions always pass
  const stopCheck = checkStopAction(input);
  if (stopCheck) return stopCheck;

  // Rule: Audio safety override
  const safetyCheck = checkAudioSafety(input);
  if (safetyCheck) return safetyCheck;

  // Rule: Premium override (if premium, allow everything else)
  const premiumCheck = checkPremiumOverride(input);
  if (premiumCheck && premiumCheck.decision === "allow") {
    return premiumCheck;
  }

  // Rule: Chat audio limit (free users)
  const chatLimitCheck = checkChatAudioLimit(input);
  if (chatLimitCheck) return chatLimitCheck;

  // Rule: Gentle Breathing limit (free users)
  const breathingLimitCheck = checkGentleBreathingLimit(input);
  if (breathingLimitCheck) return breathingLimitCheck;

  // Rule: Soundscape access control
  const soundscapeCheck = checkSoundscapeAccess(input);
  if (soundscapeCheck) return soundscapeCheck;

  // Default: allow
  return {
    decision: "allow",
    reason: "No restrictions applied",
  };
}

/**
 * Apply business rules to Decision Layer output
 *
 * Returns modified decision or original if no changes needed.
 */
export function applyBusinessRules(
  decisionLayerOutput: any,
  businessRulesOutput: BusinessRulesOutput
): any {
  switch (businessRulesOutput.decision) {
    case "allow":
      // Pass through unchanged
      return decisionLayerOutput;

    case "block":
      // Convert to stop
      return {
        action: "stop",
        reason: businessRulesOutput.reason,
        message: businessRulesOutput.message,
      };

    case "modify-to-stop":
      // Force stop
      return {
        action: "stop",
        reason: businessRulesOutput.reason,
      };

    default:
      return decisionLayerOutput;
  }
}
