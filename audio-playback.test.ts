import { describe, it, expect, vi, beforeEach } from "vitest";
import { AudioManager, AUDIO_TRACKS } from "@/lib/_core/audio-manager";

describe("AudioManager Playback", () => {
  let audioManager: AudioManager;

  beforeEach(() => {
    audioManager = AudioManager.getInstance();
  });

  it("should have audio tracks configured", () => {
    expect(AUDIO_TRACKS.ocean).toBeDefined();
    expect(AUDIO_TRACKS["summer-night"]).toBeDefined();
    expect(AUDIO_TRACKS["gentle-breathing"]).toBeDefined();
  });

  it("should have correct URLs for audio tracks", () => {
    expect(AUDIO_TRACKS.ocean.s3Url).toBe("/audio/calm-oceanic-tide.mp3");
    expect(AUDIO_TRACKS["summer-night"].s3Url).toBe("/audio/summer-night.mp3");
    expect(AUDIO_TRACKS["gentle-breathing"].s3Url).toBe("/audio/gentle-breathing.mp3");
  });

  it("should mark ocean and summer-night as session audio", () => {
    expect(AUDIO_TRACKS.ocean.isSessionAudio).toBe(true);
    expect(AUDIO_TRACKS["summer-night"].isSessionAudio).toBe(true);
  });

  it("should mark gentle-breathing as free", () => {
    expect(AUDIO_TRACKS["gentle-breathing"].isPremium).toBe(false);
  });

  it("should have AudioManager instance", () => {
    expect(audioManager).toBeDefined();
  });
});
