# Simple Audio Update Guide

This guide explains how to update CalmSpace audio files **without any coding knowledge**.

## Quick Start: Update Audio in 3 Steps

### Step 1: Edit the Configuration File

Open this file in any text editor:
```
config/audio-config.json
```

### Step 2: Update the Audio URL

Find the track you want to update. For example, to update "Relaxing Music":

**Before:**
```json
"relaxm1": {
  "name": "Relaxing Music",
  "s3Url": "https://calmspace-audio.s3.amazonaws.com/relaxm1.mp3",
  ...
}
```

**After (replace with your new URL):**
```json
"relaxm1": {
  "name": "Relaxing Music",
  "s3Url": "https://your-bucket.s3.amazonaws.com/relaxm1-new.mp3",
  ...
}
```

### Step 3: Save and Restart

1. Save the file
2. Restart the CalmSpace app
3. Done! The new audio will play

## Supported Audio Tracks

| Track ID | Name | Type | Free/Premium |
|----------|------|------|-------------|
| `relaxm1` | Relaxing Music | Music | Free |
| `relaxm2` | Relaxing Music (Premium) | Music | Premium |
| `forest` | Forest Sounds | Ambience | Premium |
| `rain` | Rain Sounds | Ambience | Premium |

## Storage Options

### Option 1: Amazon S3 (Recommended for MVP)

1. Create S3 bucket: `calmspace-audio`
2. Upload MP3 file
3. Copy the URL: `https://your-bucket.s3.amazonaws.com/filename.mp3`
4. Paste into `config/audio-config.json`

### Option 2: Firebase Storage (Future)

1. Upload MP3 to Firebase Storage
2. Copy the URL: `gs://your-project.appspot.com/audio/filename.mp3`
3. Paste into `config/audio-config.json`
4. Change `"audioProvider": "s3"` to `"audioProvider": "firebase"`

## Audio File Requirements

- **Format:** MP3 only
- **Bitrate:** 128-192 kbps
- **Duration:** 10-20 minutes (for seamless looping)
- **Sample Rate:** 44.1 kHz

## Example: Complete Audio Track Entry

```json
"relaxm1": {
  "name": "Relaxing Music",
  "category": "music",
  "isPremium": false,
  "s3Url": "https://calmspace-audio.s3.amazonaws.com/relaxm1.mp3",
  "firebaseUrl": "gs://calmspace.appspot.com/audio/relaxm1.mp3",
  "duration": 900000,
  "size": 7340032,
  "description": "Calming instrumental music for relaxation"
}
```

### Field Explanations

- **name:** Display name in the app
- **category:** Type of audio (music, forest, rain)
- **isPremium:** `true` for premium users only, `false` for everyone
- **s3Url:** Amazon S3 URL (used when `audioProvider` is "s3")
- **firebaseUrl:** Firebase Storage URL (used when `audioProvider` is "firebase")
- **duration:** Length in milliseconds (900000 = 15 minutes)
- **size:** File size in bytes (for download estimation)
- **description:** What the audio is for

## Switching Storage Providers

To switch from S3 to Firebase (or vice versa):

1. Open `config/audio-config.json`
2. Change this line:
   ```json
   "audioProvider": "s3"
   ```
   to:
   ```json
   "audioProvider": "firebase"
   ```
3. Save and restart the app

**That's it!** No code changes needed.

## Troubleshooting

### Audio Not Playing

- Check the URL is correct (copy from browser address bar)
- Verify the MP3 file exists at that URL
- Make sure the file is publicly accessible
- Try downloading the URL in your browser

### Audio Sounds Wrong

- Check MP3 bitrate (128-192 kbps recommended)
- Verify duration is 10-20 minutes
- Try re-encoding with a different tool

### Can't Find the Config File

- Look in the `config/` folder
- File name is exactly: `audio-config.json`
- Open with Notepad, VS Code, or any text editor

## Adding New Audio Tracks

To add a completely new audio track (e.g., "Ocean Waves"):

1. Open `config/audio-config.json`
2. Add a new entry after the last track:
   ```json
   "ocean": {
     "name": "Ocean Waves",
     "category": "ocean",
     "isPremium": true,
     "s3Url": "https://your-bucket.s3.amazonaws.com/ocean.mp3",
     "firebaseUrl": "gs://your-project.appspot.com/audio/ocean.mp3",
     "duration": 900000,
     "size": 16711680,
     "description": "Soothing ocean wave sounds"
   }
   ```
3. Save the file
4. Restart the app
5. The new track will appear in the audio selection

## Need Help?

See `AUDIO_SETUP.md` for technical details and S3/Firebase setup instructions.
