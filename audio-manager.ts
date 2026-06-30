/**
 * Audio Manager for CalmSpace
 * Handles seamless audio playback with looping, fade-in/fade-out transitions
 */

import { useAudioPlayer, setAudioModeAsync } from 'expo-audio';
import { Platform } from 'react-native';

export type AudioTrack = 'relaxm1' | 'relaxm2' | 'forest' | 'rain';

export interface AudioTrackConfig {
  id: AudioTrack;
  name: string;
  category: 'free' | 'premium';
  uri: string; // Local asset URI
  duration: number; // Duration in milliseconds (approximate)
}

/**
 * Audio track configurations
 * URIs point to local bundled audio files
 */
export const AUDIO_TRACKS: Record<AudioTrack, AudioTrackConfig> = {
  relaxm1: {
    id: 'relaxm1',
    name: 'Relaxing Music',
    category: 'free',
    uri: require('@/assets/audio/RelaxM1.mp3'),
    duration: 15 * 60 * 1000, // 15 minutes
  },
  relaxm2: {
    id: 'relaxm2',
    name: 'Relaxing Music (Premium)',
    category: 'premium',
    uri: require('@/assets/audio/RelaxM2.mp3'),
    duration: 15 * 60 * 1000, // 15 minutes
  },
  forest: {
    id: 'forest',
    name: 'Forest Sounds',
    category: 'premium',
    uri: require('@/assets/audio/Forest.mp3'),
    duration: 15 * 60 * 1000, // 15 minutes
  },
  rain: {
    id: 'rain',
    name: 'Rain Sounds',
    category: 'premium',
    uri: require('@/assets/audio/Rain.mp3'),
    duration: 15 * 60 * 1000, // 15 minutes
  },
};

/**
 * Initialize audio mode for iOS (allow playback in silent mode)
 */
export async function initializeAudioMode() {
  try {
    await setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      interruptionModeIOS: 1, // Mix with other audio
    });
  } catch (error) {
    console.error('Failed to initialize audio mode:', error);
  }
}

/**
 * Audio Player Manager
 * Handles playback, looping, and transitions
 */
export class AudioPlayerManager {
  private player: ReturnType<typeof useAudioPlayer> | null = null;
  private currentTrack: AudioTrack | null = null;
  private isPlaying = false;
  private fadeTimeout: NodeJS.Timeout | null = null;

  constructor() {
    initializeAudioMode();
  }

  /**
   * Load and play an audio track with optional fade-in
   */
  async playTrack(track: AudioTrack, fadeIn = false) {
    try {
      const trackConfig = AUDIO_TRACKS[track];
      if (!trackConfig) {
        throw new Error(`Unknown audio track: ${track}`);
      }

      // Stop current track if playing
      if (this.player && this.isPlaying) {
        await this.stopTrack(true); // Fade out
      }

      // Create new player
      const { useAudioPlayer: createPlayer } = await import('expo-audio');
      this.player = createPlayer(trackConfig.uri);

      // Set to loop
      this.player.loop = true;

      // Fade in if requested
      if (fadeIn && this.player.volume !== undefined) {
        this.player.volume = 0;
        await this.player.play();
        this.isPlaying = true;
        this.currentTrack = track;
        await this.fadeIn();
      } else {
        await this.player.play();
        this.isPlaying = true;
        this.currentTrack = track;
      }
    } catch (error) {
      console.error('Failed to play audio track:', error);
    }
  }

  /**
   * Stop current track with optional fade-out
   */
  async stopTrack(fadeOut = false) {
    try {
      if (!this.player || !this.isPlaying) return;

      if (fadeOut) {
        await this.fadeOut();
      }

      await this.player.pause();
      this.isPlaying = false;
      this.currentTrack = null;
    } catch (error) {
      console.error('Failed to stop audio track:', error);
    }
  }

  /**
   * Pause current track
   */
  async pauseTrack() {
    try {
      if (!this.player || !this.isPlaying) return;
      await this.player.pause();
      this.isPlaying = false;
    } catch (error) {
      console.error('Failed to pause audio track:', error);
    }
  }

  /**
   * Resume current track
   */
  async resumeTrack() {
    try {
      if (!this.player) return;
      await this.player.play();
      this.isPlaying = true;
    } catch (error) {
      console.error('Failed to resume audio track:', error);
    }
  }

  /**
   * Fade in audio over 500ms
   */
  private fadeIn() {
    return new Promise<void>((resolve) => {
      if (!this.player || this.player.volume === undefined) {
        resolve();
        return;
      }

      const duration = 500; // ms
      const steps = 20;
      const stepDuration = duration / steps;
      let currentStep = 0;

      const fadeInterval = setInterval(() => {
        if (!this.player || this.player.volume === undefined) {
          clearInterval(fadeInterval);
          resolve();
          return;
        }

        currentStep++;
        const progress = currentStep / steps;
        this.player.volume = Math.min(progress, 1);

        if (currentStep >= steps) {
          clearInterval(fadeInterval);
          this.player.volume = 1;
          resolve();
        }
      }, stepDuration);
    });
  }

  /**
   * Fade out audio over 500ms
   */
  private fadeOut() {
    return new Promise<void>((resolve) => {
      if (!this.player || this.player.volume === undefined) {
        resolve();
        return;
      }

      const duration = 500; // ms
      const steps = 20;
      const stepDuration = duration / steps;
      let currentStep = 0;
      const startVolume = this.player.volume;

      const fadeInterval = setInterval(() => {
        if (!this.player || this.player.volume === undefined) {
          clearInterval(fadeInterval);
          resolve();
          return;
        }

        currentStep++;
        const progress = currentStep / steps;
        this.player.volume = Math.max(startVolume * (1 - progress), 0);

        if (currentStep >= steps) {
          clearInterval(fadeInterval);
          this.player.volume = 0;
          resolve();
        }
      }, stepDuration);
    });
  }

  /**
   * Switch to a different audio track with fade transition
   */
  async switchTrack(newTrack: AudioTrack) {
    try {
      if (this.currentTrack === newTrack) return;

      // Fade out current track
      if (this.isPlaying) {
        await this.fadeOut();
        await this.pauseTrack();
      }

      // Play new track with fade in
      await this.playTrack(newTrack, true);
    } catch (error) {
      console.error('Failed to switch audio track:', error);
    }
  }

  /**
   * Get current playback state
   */
  getState() {
    return {
      isPlaying: this.isPlaying,
      currentTrack: this.currentTrack,
      volume: this.player?.volume ?? 1,
    };
  }

  /**
   * Release player resources
   */
  release() {
    try {
      if (this.fadeTimeout) {
        clearTimeout(this.fadeTimeout);
      }
      if (this.player) {
        this.player.release();
        this.player = null;
      }
      this.isPlaying = false;
      this.currentTrack = null;
    } catch (error) {
      console.error('Failed to release audio player:', error);
    }
  }
}

// Singleton instance
let audioManager: AudioPlayerManager | null = null;

export function getAudioManager(): AudioPlayerManager {
  if (!audioManager) {
    audioManager = new AudioPlayerManager();
  }
  return audioManager;
}

export function releaseAudioManager() {
  if (audioManager) {
    audioManager.release();
    audioManager = null;
  }
}
