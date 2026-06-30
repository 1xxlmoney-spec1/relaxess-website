import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AudioManager, AUDIO_TRACKS } from '../lib/_core/audio-manager';

describe('Audio Toggle Button Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should have ocean track configured for light theme', () => {
    const oceanTrack = AUDIO_TRACKS['ocean'];
    expect(oceanTrack).toBeDefined();
    expect(oceanTrack.id).toBe('ocean');
    expect(oceanTrack.name).toBe('Calm Oceanic Tide');
    expect(oceanTrack.isSessionAudio).toBe(true);
    expect(oceanTrack.s3Url).toContain('calm-oceanic-tide.mp3');
  });

  it('should have summer-night track configured for dark theme', () => {
    const summerNightTrack = AUDIO_TRACKS['summer-night'];
    expect(summerNightTrack).toBeDefined();
    expect(summerNightTrack.id).toBe('summer-night');
    expect(summerNightTrack.name).toBe('Summer Night');
    expect(summerNightTrack.isSessionAudio).toBe(true);
    expect(summerNightTrack.s3Url).toContain('summer-night.mp3');
  });

  it('should have gentle-breathing track configured for soundscapes', () => {
    const gentleBreathingTrack = AUDIO_TRACKS['gentle-breathing'];
    expect(gentleBreathingTrack).toBeDefined();
    expect(gentleBreathingTrack.id).toBe('gentle-breathing');
    expect(gentleBreathingTrack.name).toBe('Gentle Breathing');
    expect(gentleBreathingTrack.isPremium).toBe(false);
    expect(gentleBreathingTrack.isSessionAudio).toBe(false);
    expect(gentleBreathingTrack.s3Url).toContain('gentle-breathing.mp3');
  });

  it('should initialize AudioManager as singleton', () => {
    const manager1 = AudioManager.getInstance();
    const manager2 = AudioManager.getInstance();
    expect(manager1).toBe(manager2);
  });

  it('should start with no track playing', () => {
    const manager = AudioManager.getInstance();
    expect(manager.getCurrentTrackId()).toBeNull();
    expect(manager.getIsPlaying()).toBe(false);
  });

  it('should have all S3 URLs configured', () => {
    const tracks = Object.values(AUDIO_TRACKS);
    tracks.forEach((track) => {
      expect(track.s3Url).toBeDefined();
      expect(track.s3Url).toContain('https://');
      expect(track.s3Url).toContain('s3');
      expect(track.s3Url).toContain('.mp3');
    });
  });

  it('should have premium and free tracks properly marked', () => {
    const freeTrack = AUDIO_TRACKS['gentle-breathing'];
    expect(freeTrack.isPremium).toBe(false);

    const premiumTracks = [
      'ocean',
      'summer-night',
      'rain-after-midnight',
      'whispering-forest',
      'velvet-evening',
      'blue-silence',
      'slow-city-lights',
      'cozy-fireplace',
      'my-own-place',
      'gentle-purring',
    ];

    premiumTracks.forEach((trackId) => {
      const track = AUDIO_TRACKS[trackId as keyof typeof AUDIO_TRACKS];
      expect(track.isPremium).toBe(true);
    });
  });

  it('should have session audio tracks properly marked', () => {
    const sessionTracks = ['ocean', 'summer-night'];
    sessionTracks.forEach((trackId) => {
      const track = AUDIO_TRACKS[trackId as keyof typeof AUDIO_TRACKS];
      expect(track.isSessionAudio).toBe(true);
    });

    const nonSessionTracks = [
      'gentle-breathing',
      'rain-after-midnight',
      'whispering-forest',
      'velvet-evening',
      'blue-silence',
      'slow-city-lights',
      'cozy-fireplace',
      'my-own-place',
      'gentle-purring',
    ];

    nonSessionTracks.forEach((trackId) => {
      const track = AUDIO_TRACKS[trackId as keyof typeof AUDIO_TRACKS];
      expect(track.isSessionAudio).toBe(false);
    });
  });

  it('should support subscription to audio state changes', () => {
    const manager = AudioManager.getInstance();
    const listener = vi.fn();

    const unsubscribe = manager.subscribe(listener);
    expect(typeof unsubscribe).toBe('function');

    unsubscribe();
  });
});
