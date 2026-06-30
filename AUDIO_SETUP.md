# CalmSpace Cloud Audio Setup Guide

This document explains how to configure and update audio files for CalmSpace without rebuilding the app.

## Architecture Overview

CalmSpace uses a **cloud-based audio streaming system** with local caching:

1. **Audio files stored in S3** (user-owned bucket)
2. **App downloads on first use** (automatic)
3. **Local caching** for offline playback
4. **Seamless looping** with fade transitions
5. **No app rebuild** required to update audio

## Audio Tracks Configuration

All audio tracks are defined in `lib/cloud-audio-service.ts`:

```typescript
export const CLOUD_AUDIO_TRACKS: Record<AudioTrack, CloudAudioTrack> = {
  relaxm1: {
    id: 'relaxm1',
    name: 'Relaxing Music',
    category: 'music',
    cloudUrl: 'https://calmspace-audio.s3.amazonaws.com/relaxm1.mp3',
    localCachePath: `${FileSystem.cacheDirectory}calmspace_relaxm1.mp3`,
    duration: 15 * 60 * 1000, // 15 minutes
    isPremium: false,
    size: 7 * 1024 * 1024, // ~7MB
  },
  // ... more tracks
};
```

## How to Update Audio Files

### Step 1: Prepare Your Audio Files

- Format: **MP3**
- Bitrate: 128-192 kbps (recommended for mobile)
- Duration: 10-20 minutes (for seamless looping)
- Sample rate: 44.1 kHz

### Step 2: Upload to S3

1. Create an S3 bucket (e.g., `calmspace-audio`)
2. Upload MP3 files with these names:
   - `relaxm1.mp3` (free tier)
   - `relaxm2.mp3` (premium)
   - `forest.mp3` (premium)
   - `rain.mp3` (premium)

3. Make files **publicly readable** (or use signed URLs)

### Step 3: Update Cloud URLs

Edit `lib/cloud-audio-service.ts` and update the `cloudUrl` for each track:

```typescript
relaxm1: {
  // ...
  cloudUrl: 'https://your-bucket.s3.amazonaws.com/relaxm1.mp3',
  // ...
}
```

### Step 4: Update File Sizes (Optional)

Update the `size` field to match your new files (for download estimation):

```typescript
relaxm1: {
  // ...
  size: 7 * 1024 * 1024, // Update this value
  // ...
}
```

### Step 5: Deploy

- **No app rebuild required**
- Changes take effect on next app launch
- Users' cached audio remains until cleared

## Audio Categories

CalmSpace supports these audio categories for future expansion:

| Category | Tracks | Premium | Purpose |
|----------|--------|---------|---------|
| `music` | RelaxM1, RelaxM2 | M1: Free, M2: Premium | Calming instrumental music |
| `forest` | Forest | Premium | Forest ambience |
| `rain` | Rain | Premium | Rain sounds |

## Adding New Audio Tracks

To add a new audio track:

1. Add to `AudioTrack` type in `cloud-audio-service.ts`:
   ```typescript
   export type AudioTrack = 'relaxm1' | 'relaxm2' | 'forest' | 'rain' | 'ocean'; // Add 'ocean'
   ```

2. Add to `CLOUD_AUDIO_TRACKS`:
   ```typescript
   ocean: {
     id: 'ocean',
     name: 'Ocean Waves',
     category: 'ocean', // New category
     cloudUrl: 'https://your-bucket.s3.amazonaws.com/ocean.mp3',
     localCachePath: `${FileSystem.cacheDirectory}calmspace_ocean.mp3`,
     duration: 15 * 60 * 1000,
     isPremium: true,
     size: 16 * 1024 * 1024,
   }
   ```

3. Update UI components to include new track in audio selection

4. Deploy without rebuilding app

## Audio Playback Features

### Seamless Looping

Audio automatically loops when it reaches the end. The system handles:
- Gapless playback
- Smooth transitions between loops
- No silence or clicks

### Fade In/Out Transitions

When switching tracks or starting playback:
- **Fade in**: 500ms smooth volume increase
- **Fade out**: 500ms smooth volume decrease
- Prevents jarring audio transitions

### Offline Caching

- First play: Downloads from cloud (~5-30 seconds depending on file size)
- Subsequent plays: Uses cached copy (instant)
- Cache persists across app sessions
- Users can clear cache in settings

## Cost Optimization

### S3 Storage Costs

For 4 tracks (~50MB total):
- **Storage**: ~$1.15/month (S3 Standard)
- **Data transfer**: ~$0.09/GB (varies by region)

### Bandwidth Optimization

- Users download only when needed
- Cached locally for repeat plays
- Typical user: 1-2 downloads per session
- Monthly cost: $5-15 for 1000 active users

### Free Tier Optimization

- Only `relaxm1` (7MB) preloads for free users
- Premium users download additional tracks on demand
- Reduces bandwidth for free tier

## Troubleshooting

### Audio Not Playing

1. Check S3 URL is accessible
2. Verify MP3 file is valid
3. Check device has internet (first download)
4. Check cache directory has space

### Slow Download

1. Reduce MP3 bitrate (128 kbps is sufficient)
2. Use CDN instead of S3 for faster distribution
3. Show download progress UI to users

### Cache Issues

Clear cache in settings → Audio Cache → Clear

## Security Considerations

- **Public S3 bucket**: Audio is publicly accessible (acceptable for music)
- **Signed URLs**: For sensitive content, use AWS signed URLs
- **CORS**: Configure S3 CORS if using from web player
- **Encryption**: S3 supports server-side encryption at rest

## Future Enhancements

1. **CDN Integration**: Use CloudFront for faster global distribution
2. **Adaptive Bitrate**: Serve different quality based on connection
3. **Offline Packs**: Allow users to pre-download all tracks
4. **Analytics**: Track which audio is most popular
5. **User Uploads**: Allow users to upload custom audio

## Support

For issues or questions about audio setup:
1. Check `lib/cloud-audio-service.ts` for implementation details
2. Review `lib/app-context.tsx` for audio state management
3. Check device logs for download errors
