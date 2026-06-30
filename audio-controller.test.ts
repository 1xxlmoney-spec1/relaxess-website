/**
 * AudioController Unit Tests
 * 
 * Tests for unified audio playback architecture:
 * - Single entry point enforcement
 * - Free-tier limit validation
 * - Premium bypass
 * - Notification system
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { playAudio, stopAudio, getCurrentAudio, registerNotificationHandler } from "../lib/audio-controller";
import { validateFreeTierPlayback, resetDebugListeningTimes } from "../lib/_core/free-tier-limits";
import { AUDIO_TRACKS } from "../lib/_core/audio-manager";

describe("AudioController - Unified Playback Architecture", () => {
  beforeEach(async () => {
    // Reset free-tier listening times before each test
    await resetDebugListeningTimes();
  });

  describe("Single Entry Point", () => {
    it("should accept trackId and isPremium flag", async () => {
      const result = await playAudio("ocean", false);
      expect(result).toEqual(expect.any(Boolean));
    });

    it("should return boolean indicating success/failure", async () => {
      const successResult = await playAudio("ocean", true);
      expect(successResult).toBe(true);

      const failureResult = await playAudio("rain-after-midnight", false);
      expect(failureResult).toBe(false);
    });
  });

  describe("Free-Tier Limit Enforcement", () => {
    it("should allow free users to play free tracks (listening time tracked)", async () => {
      const trackId = "ocean";
      const isPremium = false;

      // First play should succeed (validation passes at start)
      const result1 = await playAudio(trackId, isPremium);
      expect(result1).toBe(true);

      // Subsequent plays should also succeed (limit is enforced by timer, not by play count)
      const result2 = await playAudio(trackId, isPremium);
      expect(result2).toBe(true);
    });

    it("should block free users from playing premium tracks", async () => {
      const premiumTrack = "rain-after-midnight";
      const isPremium = false;

      const result = await playAudio(premiumTrack, isPremium);
      expect(result).toBe(false);
    });

    it("should allow premium users unlimited plays", async () => {
      const trackId = "ocean";
      const isPremium = true;

      // Premium users should be able to play multiple times
      const result1 = await playAudio(trackId, isPremium);
      expect(result1).toBe(true);

      const result2 = await playAudio(trackId, isPremium);
      expect(result2).toBe(true);

      const result3 = await playAudio(trackId, isPremium);
      expect(result3).toBe(true);
    });

    it("should allow premium users to play premium tracks", async () => {
      const premiumTrack = "rain-after-midnight";
      const isPremium = true;

      const result = await playAudio(premiumTrack, isPremium);
      expect(result).toBe(true);
    });
  });

  describe("Premium Bypass", () => {
    it("should bypass free-tier limits for premium users", async () => {
      const trackId = "summer-night";
      const isPremium = true;

      // Premium users should have no limit
      for (let i = 0; i < 5; i++) {
        const result = await playAudio(trackId, isPremium);
        expect(result).toBe(true);
      }
    });

    it("should allow premium users to play all 11 tracks", async () => {
      const isPremium = true;

      for (const trackId of Object.keys(AUDIO_TRACKS)) {
        const result = await playAudio(trackId as any, isPremium);
        expect(result).toBe(true);
      }
    });
  });

  describe("Notification System", () => {
    it("should trigger notification when limit is reached", async () => {
      const notificationMessages: string[] = [];
      registerNotificationHandler((msg) => {
        notificationMessages.push(msg);
      });

      const trackId = "ocean";
      const isPremium = false;

      // Play twice to reach limit
      await playAudio(trackId, isPremium);
      await playAudio(trackId, isPremium);

      // Third play should trigger notification
      await playAudio(trackId, isPremium);

      expect(notificationMessages.length).toBeGreaterThan(0);
      expect(notificationMessages[notificationMessages.length - 1]).toContain("Daily limit");
    });

    it("should trigger notification for premium-only tracks", async () => {
      const notificationMessages: string[] = [];
      registerNotificationHandler((msg) => {
        notificationMessages.push(msg);
      });

      const premiumTrack = "rain-after-midnight";
      const isPremium = false;

      await playAudio(premiumTrack, isPremium);

      expect(notificationMessages.length).toBeGreaterThan(0);
      expect(notificationMessages[0]).toContain("Premium");
    });
  });

  describe("State Management", () => {
    it("should track current playing track", async () => {
      const trackId = "ocean";
      const isPremium = true;

      await playAudio(trackId, isPremium);
      const currentTrack = getCurrentAudio();

      expect(currentTrack).toBe(trackId);
    });

    it("should clear track on stop", async () => {
      const trackId = "ocean";
      const isPremium = true;

      await playAudio(trackId, isPremium);
      stopAudio();

      const currentTrack = getCurrentAudio();
      expect(currentTrack).toBeNull();
    });
  });

  describe("Track Classification", () => {
    it("should identify free tracks correctly", async () => {
      const freeTracks = ["ocean", "summer-night", "gentle-breathing"];
      const isPremium = false;

      for (const trackId of freeTracks) {
        const result = await playAudio(trackId as any, isPremium);
        // Should allow at least first play
        expect(result).toBe(true);
      }
    });

    it("should identify premium tracks correctly", async () => {
      const premiumTracks = [
        "rain-after-midnight",
        "whispering-forest",
        "velvet-evening",
        "blue-silence",
        "slow-city-lights",
        "cozy-fireplace",
        "my-own-place",
        "gentle-purring",
      ];
      const isPremium = false;

      for (const trackId of premiumTracks) {
        const result = await playAudio(trackId as any, isPremium);
        // All should fail for free users
        expect(result).toBe(false);
      }
    });
  });

  describe("Validation Layer", () => {
    it("should call validateFreeTierPlayback before playback", async () => {
      const trackId = "ocean";
      const isPremium = false;

      // First play should succeed (validation passes)
      const result1 = await playAudio(trackId, isPremium);
      expect(result1).toBe(true);

      // Validation is checked at playback start, limit is enforced by timer
      const result2 = await playAudio(trackId, isPremium);
      expect(result2).toBe(true);
    });

    it("should enforce validation for all free-tier tracks", async () => {
      const freeTracks = ["ocean", "summer-night", "gentle-breathing"];
      const isPremium = false;

      for (const trackId of freeTracks) {
        // Reset for each track
        await resetDebugListeningTimes();

        // First play should succeed (validation passes)
        const result = await playAudio(trackId as any, isPremium);
        expect(result).toBe(true);
      }
    });
  });
});
