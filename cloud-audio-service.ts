/**
 * Cloud Audio Service for CalmSpace
 * Manages remote audio streaming, local caching, and playback
 * Supports seamless looping and fade transitions
 * Uses modular configuration for easy provider switching (S3/Firebase)
 */

import * as FileSystem from 'expo-file-system/legacy';
import { useAudioPlayer, setAudioModeAsync } from 'expo-audio';
import { Platform } from 'react-native';
import { getAudioTrackUrl, logAudioConfiguration } from './audio-config-loader';

export type AudioTrack = 'relaxm1' | 'relaxm2' | 'forest' | 'rain';
export type AudioCategory = 'music' | 'forest' | 'rain';

export interface CloudAudioTrack {
  id: AudioTrack;
  name: string;
  category: AudioCategory;
  cloudUrl: string; // S3 or CDN URL
  localCachePath: string;
  duration: number; // milliseconds (approximate)
  isPremium: boolean;
  size: number; // bytes (for download estimation)
}

/**
 * Audio track configurations with cloud URLs
 * URLs are loaded from config/audio-config.json
 * Supports S3 and Firebase Storage (modular)
 * 
 * To update audio files:
 * 1. Edit config/audio-config.json
 * 2. Update the S3 or Firebase URL
 * 3. No code changes or app rebuild required
 */
export function buildCloudAudioTracks(): Record<AudioTrack, CloudAudioTrack> {
  const tracks: Record<AudioTrack, CloudAudioTrack> = {} as Record<AudioTrack, CloudAudioTrack>;
  const trackIds: AudioTrack[] = ['relaxm1', 'relaxm2', 'forest', 'rain'];
  
  const trackMetadata: Record<AudioTrack, { name: string; category: AudioCategory; isPremium: boolean; size: number }> = {
    relaxm1: { name: 'Relaxing Music', category: 'music', isPremium: false, size: 7 * 1024 * 1024 },
    relaxm2: { name: 'Relaxing Music (Premium)', category: 'music', isPremium: true, size: 14 * 1024 * 1024 },
    forest: { name: 'Forest Sounds', category: 'forest', isPremium: true, size: 16 * 1024 * 1024 },
    rain: { name: 'Rain Sounds', category: 'rain', isPremium: true, size: 16 * 1024 * 1024 },
  };
  
  for (const trackId of trackIds) {
    const metadata = trackMetadata[trackId];
    const cloudUrl = getAudioTrackUrl(trackId);
    
    tracks[trackId] = {
      id: trackId,
      name: metadata.name,
      category: metadata.category,
      cloudUrl,
      localCachePath: `${FileSystem.cacheDirectory}calmspace_${trackId}.mp3`,
      duration: 15 * 60 * 1000, // 15 minutes
      isPremium: metadata.isPremium,
      size: metadata.size,
    };
  }
  
  return tracks;
}

// Build tracks on module load
export const CLOUD_AUDIO_TRACKS = buildCloudAudioTracks();

export interface AudioDownloadProgress {
  trackId: AudioTrack;
  bytesWritten: number;
  totalBytes: number;
  progress: number; // 0-1
}

/**
 * Initialize audio mode for iOS (allow playback in silent mode)
 */
export async function initializeAudioMode() {
  try {
    // Log audio configuration for debugging
    logAudioConfiguration();
    
    await setAudioModeAsync({
      playsInSilentMode: true,
    });
  } catch (error) {
    console.error('Failed to initialize audio mode:', error);
  }
}

/**
 * Check if audio file is cached locally
 */
export async function isAudioCached(trackId: AudioTrack): Promise<boolean> {
  try {
    const track = CLOUD_AUDIO_TRACKS[trackId];
    const fileInfo = await FileSystem.getInfoAsync(track.localCachePath);
    return fileInfo.exists && fileInfo.size > 0;
  } catch (error) {
    console.error('Failed to check audio cache:', error);
    return false;
  }
}

/**
 * Get cache size for a specific track
 */
export async function getAudioCacheSize(trackId: AudioTrack): Promise<number> {
  try {
    const track = CLOUD_AUDIO_TRACKS[trackId];
    const fileInfo = await FileSystem.getInfoAsync(track.localCachePath);
    return fileInfo.exists ? fileInfo.size || 0 : 0;
  } catch (error) {
    console.error('Failed to get cache size:', error);
    return 0;
  }
}

/**
 * Download and cache audio file from cloud
 * Supports progress tracking for UI feedback
 */
export async function downloadAudioTrack(
  trackId: AudioTrack,
  onProgress?: (progress: AudioDownloadProgress) => void
): Promise<string> {
  try {
    const track = CLOUD_AUDIO_TRACKS[trackId];

    // Check if already cached
    const isCached = await isAudioCached(trackId);
    if (isCached) {
      console.log(`Audio track ${trackId} already cached`);
      return track.localCachePath;
    }

    console.log(`Downloading audio track ${trackId} from ${track.cloudUrl}`);

    // Download with progress tracking
    const downloadResumable = FileSystem.createDownloadResumable(
      track.cloudUrl,
      track.localCachePath,
      {},
      (downloadProgress) => {
        const progress: AudioDownloadProgress = {
          trackId,
          bytesWritten: downloadProgress.totalBytesWritten,
          totalBytes: downloadProgress.totalBytesExpectedToWrite,
          progress: downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite,
        };
        onProgress?.(progress);
      }
    );

    const result = await downloadResumable.downloadAsync();
    if (!result || !result.uri) {
      throw new Error(`Failed to download audio track ${trackId}`);
    }

    console.log(`Successfully cached audio track ${trackId}`);
    return result.uri;
  } catch (error) {
    console.error(`Failed to download audio track ${trackId}:`, error);
    throw error;
  }
}

/**
 * Clear cache for a specific audio track
 */
export async function clearAudioCache(trackId: AudioTrack): Promise<void> {
  try {
    const track = CLOUD_AUDIO_TRACKS[trackId];
    const isCached = await isAudioCached(trackId);
    if (isCached) {
      await FileSystem.deleteAsync(track.localCachePath);
      console.log(`Cleared cache for audio track ${trackId}`);
    }
  } catch (error) {
    console.error(`Failed to clear cache for ${trackId}:`, error);
  }
}

/**
 * Clear all audio cache
 */
export async function clearAllAudioCache(): Promise<void> {
  try {
    const trackIds: AudioTrack[] = ['relaxm1', 'relaxm2', 'forest', 'rain'];
    await Promise.all(trackIds.map((id) => clearAudioCache(id)));
    console.log('Cleared all audio cache');
  } catch (error) {
    console.error('Failed to clear all audio cache:', error);
  }
}

/**
 * Get total cache size for all audio
 */
export async function getTotalAudioCacheSize(): Promise<number> {
  try {
    const trackIds: AudioTrack[] = ['relaxm1', 'relaxm2', 'forest', 'rain'];
    const sizes = await Promise.all(trackIds.map((id) => getAudioCacheSize(id)));
    return sizes.reduce((sum, size) => sum + size, 0);
  } catch (error) {
    console.error('Failed to get total cache size:', error);
    return 0;
  }
}

/**
 * Cloud Audio Player Manager
 * Handles playback, looping, caching, and transitions
 */
export class CloudAudioPlayer {
  private player: ReturnType<typeof useAudioPlayer> | null = null;
  private currentTrack: AudioTrack | null = null;
  private isPlaying = false;
  private fadeTimeout: NodeJS.Timeout | null = null;
  private downloadPromise: Promise<string> | null = null;

  constructor() {
    initializeAudioMode();
  }

  /**
   * Load and play an audio track
   * Automatically downloads and caches if not available locally
   */
  async playTrack(track: AudioTrack, fadeIn = false) {
    try {
      // Stop current track if playing
      if (this.player && this.isPlaying) {
        await this.stopTrack(true); // Fade out
      }

      // Download and cache audio if needed
      console.log(`Loading audio track ${track}...`);
      const audioUri = await downloadAudioTrack(track);

      // Create new player with cached audio
      const { useAudioPlayer: createPlayer } = await import('expo-audio');
      this.player = createPlayer(audioUri);

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

      console.log(`Now playing: ${track}`);
    } catch (error) {
      console.error(`Failed to play audio track ${track}:`, error);
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
let audioPlayer: CloudAudioPlayer | null = null;

export function getCloudAudioPlayer(): CloudAudioPlayer {
  if (!audioPlayer) {
    audioPlayer = new CloudAudioPlayer();
  }
  return audioPlayer;
}

export function releaseCloudAudioPlayer() {
  if (audioPlayer) {
    audioPlayer.release();
    audioPlayer = null;
  }
}
