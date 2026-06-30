/**
 * Audio Configuration Loader
 * Loads audio URLs from config file
 * Supports S3 and Firebase Storage (modular)
 * Easy non-technical updates without code changes
 */

import audioConfig from '@/config/audio-config.json';
import type { AudioTrack } from './cloud-audio-service';

export type AudioProvider = 's3' | 'firebase';

export interface AudioTrackConfig {
  name: string;
  category: 'music' | 'forest' | 'rain';
  isPremium: boolean;
  url: string; // Selected based on provider
  duration: number;
  size: number;
  description: string;
}

export interface AudioConfiguration {
  provider: AudioProvider;
  tracks: Record<AudioTrack, AudioTrackConfig>;
}

/**
 * Load audio configuration from config file
 * Automatically selects URLs based on configured provider
 */
export function loadAudioConfiguration(): AudioConfiguration {
  const provider = (audioConfig.audioProvider || 's3') as AudioProvider;
  
  const tracks: Record<AudioTrack, AudioTrackConfig> = {} as Record<AudioTrack, AudioTrackConfig>;
  
  // Map each track from config
  const trackIds: AudioTrack[] = ['relaxm1', 'relaxm2', 'forest', 'rain'];
  
  for (const trackId of trackIds) {
    const trackConfig = audioConfig.tracks[trackId as keyof typeof audioConfig.tracks];
    
    if (!trackConfig) {
      console.warn(`Audio track ${trackId} not found in config`);
      continue;
    }
    
    // Select URL based on provider
    const url = provider === 'firebase' ? trackConfig.firebaseUrl : trackConfig.s3Url;
    
    const category = trackConfig.category as 'music' | 'forest' | 'rain';
    
    tracks[trackId] = {
      name: trackConfig.name,
      category,
      isPremium: trackConfig.isPremium,
      url,
      duration: trackConfig.duration,
      size: trackConfig.size,
      description: trackConfig.description,
    };
  }
  
  return {
    provider,
    tracks,
  };
}

/**
 * Get URL for a specific audio track
 */
export function getAudioTrackUrl(trackId: AudioTrack): string {
  const config = loadAudioConfiguration();
  const track = config.tracks[trackId];
  
  if (!track) {
    throw new Error(`Audio track ${trackId} not found in configuration`);
  }
  
  return track.url;
}

/**
 * Get all audio tracks
 */
export function getAllAudioTracks(): Record<AudioTrack, AudioTrackConfig> {
  const config = loadAudioConfiguration();
  return config.tracks;
}

/**
 * Get current audio provider
 */
export function getCurrentAudioProvider(): AudioProvider {
  return (audioConfig.audioProvider || 's3') as AudioProvider;
}

/**
 * Validate audio configuration
 */
export function validateAudioConfiguration(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  const trackIds: AudioTrack[] = ['relaxm1', 'relaxm2', 'forest', 'rain'];
  
  for (const trackId of trackIds) {
    const trackConfig = audioConfig.tracks[trackId as keyof typeof audioConfig.tracks];
    
    if (!trackConfig) {
      errors.push(`Missing track: ${trackId}`);
      continue;
    }
    
    if (!trackConfig.s3Url && !trackConfig.firebaseUrl) {
      errors.push(`Track ${trackId}: No S3 or Firebase URL configured`);
    }
    
    if (!trackConfig.name) {
      errors.push(`Track ${trackId}: Missing name`);
    }
    
    if (!trackConfig.category) {
      errors.push(`Track ${trackId}: Missing category`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Log audio configuration for debugging
 */
export function logAudioConfiguration(): void {
  const config = loadAudioConfiguration();
  const validation = validateAudioConfiguration();
  
  console.log('=== Audio Configuration ===');
  console.log(`Provider: ${config.provider}`);
  console.log(`Valid: ${validation.valid}`);
  
  if (validation.errors.length > 0) {
    console.warn('Configuration errors:');
    validation.errors.forEach((error) => console.warn(`  - ${error}`));
  }
  
  console.log('Tracks:');
  Object.entries(config.tracks).forEach(([id, track]) => {
    console.log(`  ${id}: ${track.name} (${track.category}) - ${track.isPremium ? 'Premium' : 'Free'}`);
    console.log(`    URL: ${track.url}`);
    console.log(`    Size: ${(track.size / 1024 / 1024).toFixed(1)}MB`);
  });
}
