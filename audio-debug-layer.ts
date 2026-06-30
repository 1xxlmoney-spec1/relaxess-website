/**
 * Audio Debug & Diagnostic Layer (Step 5)
 *
 * READ-ONLY diagnostic system for tracing audio behavior.
 *
 * PURPOSE: Answer WHY is audio playing or NOT playing?
 *
 * This layer does NOT:
 * - control audio
 * - influence decisions
 * - execute playback
 * - modify any logic
 *
 * It ONLY traces the full pipeline and produces diagnostic reports.
 */

export interface AudioDebugReport {
  // Event metadata
  timestamp: string;
  eventTrigger: string;

  // Step 3: Decision Layer Output
  decisionLayer: {
    action: "play" | "stop" | "switch" | "none";
    trackName?: string;
    trackUrl?: string;
    priorityReason?: string;
  };

  // Step 4: Business Rules Result
  businessRules: {
    status: "allow" | "block";
    ruleTriggered?: string;
    reason?: string;
    message?: string;
  };

  // Step 2: AudioManager State
  audioManager: {
    currentTrack: string | null;
    isPlaying: boolean;
  };

  // Final execution result
  finalDecision: {
    executed: boolean;
    action: "play" | "stop" | "switch" | "none";
    reason: string;
  };

  // Root cause analysis
  rootCause: {
    layer: "decision-layer" | "business-rules" | "audio-manager" | "state-mismatch" | "missing-trigger" | "none";
    explanation: string;
  };

  // Full pipeline trace
  pipelineTrace: string[];
}

export interface AudioDebugInput {
  // Event trigger
  eventTrigger: string;

  // Step 3 output
  decisionOutput: {
    action: "play" | "stop" | "switch" | "none";
    trackUrl?: string;
    reason?: string;
  };

  // Step 4 output
  businessRulesOutput: {
    decision: "allow" | "block" | "modify-to-stop";
    message?: string;
    reason?: string;
  };

  // Step 2 state (before execution)
  audioManagerStateBefore: {
    currentTrack: string | null;
    isPlaying: boolean;
  };

  // Step 2 state (after execution)
  audioManagerStateAfter: {
    currentTrack: string | null;
    isPlaying: boolean;
  };

  // App state signals
  appState: {
    isChatActive: boolean;
    soundscapeSelected: string | null;
    theme: "light" | "dark";
    audioToggle: boolean;
    isPremium: boolean;
    chatExchangeCount: number;
    chatDurationSeconds: number;
    gentleBreathingPlaysToday: number;
  };
}

/**
 * Extract track name from S3 URL
 */
function extractTrackName(url?: string): string | undefined {
  if (!url) return undefined;

  const trackNames: Record<string, string> = {
    "calm-oceanic-tide": "Calm Oceanic Tide",
    "summer-night": "Summer Night",
    "gentle-breathing": "Gentle Breathing",
    "rain-after-midnight": "Rain After Midnight",
    "whispering-forest": "Whispering Forest",
    "velvet-evening": "Velvet Evening",
    "blue-silence": "Blue Silence",
    "slow-city-lights": "Slow City Lights",
    "cozy-fireplace": "Cozy Fireplace",
    "my-own-place": "My Own Place",
    "gentle-purring": "Gentle Purring",
  };

  for (const [key, name] of Object.entries(trackNames)) {
    if (url.includes(key)) {
      return name;
    }
  }

  return "Unknown Track";
}

/**
 * Analyze root cause of audio behavior
 */
function analyzeRootCause(input: AudioDebugInput): { layer: string; explanation: string } {
  const { decisionOutput, businessRulesOutput, audioManagerStateBefore, audioManagerStateAfter } = input;

  // Case 1: Decision Layer selected NONE
  if (decisionOutput.action === "none") {
    return {
      layer: "decision-layer",
      explanation: "No audio decision made - no valid playback condition exists",
    };
  }

  // Case 2: Business Rules blocked
  if (businessRulesOutput.decision === "block") {
    return {
      layer: "business-rules",
      explanation: `Blocked by rule: ${businessRulesOutput.reason || "Unknown rule"}`,
    };
  }

  // Case 3: Business Rules modified to stop
  if (businessRulesOutput.decision === "modify-to-stop") {
    return {
      layer: "business-rules",
      explanation: `Modified to STOP: ${businessRulesOutput.reason || "Audio safety override"}`,
    };
  }

  // Case 4: AudioManager state didn't update
  if ((decisionOutput.action === "play" || decisionOutput.action === "switch") && businessRulesOutput.decision === "allow") {
    if (audioManagerStateAfter.isPlaying === audioManagerStateBefore.isPlaying) {
      return {
        layer: "audio-manager",
        explanation: "AudioManager state did not update after execution",
      };
    }
  }

  // Case 5: State mismatch
  if (audioManagerStateAfter.currentTrack !== decisionOutput.trackUrl && decisionOutput.action === "play") {
    return {
      layer: "state-mismatch",
      explanation: "Decision requested track but AudioManager has different track",
    };
  }

  // Case 6: No issue detected
  return {
    layer: "none",
    explanation: "Audio system working as expected",
  };
}

/**
 * Build pipeline trace
 */
function buildPipelineTrace(input: AudioDebugInput): string[] {
  const trace: string[] = [];

  trace.push(`[TRIGGER] ${input.eventTrigger}`);
  trace.push(`[APP STATE] Chat: ${input.appState.isChatActive}, Theme: ${input.appState.theme}, Audio: ${input.appState.audioToggle}, Premium: ${input.appState.isPremium}`);

  // Decision Layer
  trace.push(`[DECISION LAYER] Action: ${input.decisionOutput.action}`);
  if (input.decisionOutput.trackUrl) {
    trace.push(`  → Track: ${extractTrackName(input.decisionOutput.trackUrl)}`);
    trace.push(`  → URL: ${input.decisionOutput.trackUrl}`);
  }
  if (input.decisionOutput.reason) {
    trace.push(`  → Reason: ${input.decisionOutput.reason}`);
  }

  // Business Rules
  trace.push(`[BUSINESS RULES] Status: ${input.businessRulesOutput.decision}`);
  if (input.businessRulesOutput.reason) {
    trace.push(`  → Reason: ${input.businessRulesOutput.reason}`);
  }
  if (input.businessRulesOutput.message) {
    trace.push(`  → Message: ${input.businessRulesOutput.message}`);
  }

  // AudioManager Before
  trace.push(`[AUDIO MANAGER BEFORE] Playing: ${input.audioManagerStateBefore.isPlaying}, Track: ${input.audioManagerStateBefore.currentTrack || "none"}`);

  // Execution
  const executed = input.businessRulesOutput.decision === "allow";
  trace.push(`[EXECUTION] ${executed ? "✓ EXECUTED" : "✗ BLOCKED"}`);

  // AudioManager After
  trace.push(`[AUDIO MANAGER AFTER] Playing: ${input.audioManagerStateAfter.isPlaying}, Track: ${input.audioManagerStateAfter.currentTrack || "none"}`);

  return trace;
}

/**
 * Generate Audio Debug Report
 *
 * Traces full pipeline and produces diagnostic output.
 */
export function generateAudioDebugReport(input: AudioDebugInput): AudioDebugReport {
  const rootCause = analyzeRootCause(input);
  const pipelineTrace = buildPipelineTrace(input);

  const executed = input.businessRulesOutput.decision === "allow";

  return {
    timestamp: new Date().toISOString(),
    eventTrigger: input.eventTrigger,

    decisionLayer: {
      action: input.decisionOutput.action,
      trackName: extractTrackName(input.decisionOutput.trackUrl),
      trackUrl: input.decisionOutput.trackUrl,
      priorityReason: input.decisionOutput.reason,
    },

    businessRules: {
      status: input.businessRulesOutput.decision === "allow" ? "allow" : "block",
      ruleTriggered: input.businessRulesOutput.reason,
      reason: input.businessRulesOutput.reason,
      message: input.businessRulesOutput.message,
    },

    audioManager: {
      currentTrack: input.audioManagerStateAfter.currentTrack,
      isPlaying: input.audioManagerStateAfter.isPlaying,
    },

    finalDecision: {
      executed,
      action: input.decisionOutput.action,
      reason: executed ? "Allowed by business rules" : `Blocked by ${rootCause.layer}`,
    },

    rootCause: {
      layer: rootCause.layer as any,
      explanation: rootCause.explanation,
    },

    pipelineTrace,
  };
}

/**
 * Print debug report to console
 */
export function printAudioDebugReport(report: AudioDebugReport): void {
  console.log("\n" + "=".repeat(80));
  console.log("🔍 AUDIO DEBUG REPORT");
  console.log("=".repeat(80));

  console.log(`\n⏰ Timestamp: ${report.timestamp}`);
  console.log(`📌 Event Trigger: ${report.eventTrigger}`);

  console.log(`\n📋 DECISION LAYER (Step 3):`);
  console.log(`   Action: ${report.decisionLayer.action}`);
  if (report.decisionLayer.trackName) {
    console.log(`   Track: ${report.decisionLayer.trackName}`);
  }
  if (report.decisionLayer.priorityReason) {
    console.log(`   Reason: ${report.decisionLayer.priorityReason}`);
  }

  console.log(`\n🛡️  BUSINESS RULES (Step 4):`);
  console.log(`   Status: ${report.businessRules.status}`);
  if (report.businessRules.reason) {
    console.log(`   Reason: ${report.businessRules.reason}`);
  }
  if (report.businessRules.message) {
    console.log(`   Message: ${report.businessRules.message}`);
  }

  console.log(`\n🎵 AUDIO MANAGER (Step 2):`);
  console.log(`   Playing: ${report.audioManager.isPlaying}`);
  console.log(`   Current Track: ${report.audioManager.currentTrack || "none"}`);

  console.log(`\n✅ FINAL DECISION:`);
  console.log(`   Executed: ${report.finalDecision.executed ? "YES" : "NO"}`);
  console.log(`   Reason: ${report.finalDecision.reason}`);

  console.log(`\n🔴 ROOT CAUSE:`);
  console.log(`   Layer: ${report.rootCause.layer}`);
  console.log(`   Explanation: ${report.rootCause.explanation}`);

  console.log(`\n📊 PIPELINE TRACE:`);
  report.pipelineTrace.forEach((line) => console.log(`   ${line}`));

  console.log("\n" + "=".repeat(80) + "\n");
}

/**
 * Detect common failure patterns
 */
export function detectFailurePatterns(report: AudioDebugReport): string[] {
  const patterns: string[] = [];

  // Pattern 1: Decision selected but Business Rules blocked
  if (report.decisionLayer.action !== "none" && report.businessRules.status === "block") {
    patterns.push("Decision Layer selected track BUT Business Rules blocked it");
  }

  // Pattern 2: Business Rules allowed but AudioManager not updated
  if (report.businessRules.status === "allow" && !report.audioManager.isPlaying && report.decisionLayer.action === "play") {
    patterns.push("Business Rules allowed BUT AudioManager state did not update");
  }

  // Pattern 3: AudioManager playing but different track than expected
  if (report.audioManager.isPlaying && report.audioManager.currentTrack !== report.decisionLayer.trackUrl) {
    patterns.push("AudioManager playing different track than Decision Layer selected");
  }

  // Pattern 4: Decision is NONE but audio is playing
  if (report.decisionLayer.action === "none" && report.audioManager.isPlaying) {
    patterns.push("Decision Layer says NONE but AudioManager is still playing");
  }

  return patterns;
}
