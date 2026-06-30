# CalmSpace – Mobile App Interface Design

## Design Philosophy

**Core Principle:** "A calm emotional space inside the phone."

Users should feel calmer and more relaxed within the first 30–60 seconds after opening the app. The design prioritizes emotional safety, minimalism, and clarity over complexity.

### Design Constraints
- **Orientation:** Portrait only (9:16 aspect ratio)
- **Interaction Model:** One-handed usage
- **Visual Style:** Apple HIG-compliant, minimalist, soft, emotionally calming
- **Complexity:** Maximum simplicity—users reach AI chat within 1–2 taps

---

## Screen List

### 1. **Home Screen** (Entry Point)
The first screen users see. Sets the emotional tone for the entire app.

**Primary Content:**
- Large, centered title: "How are you feeling today?"
- Six mood selection buttons arranged vertically or in a 2×3 grid:
  - Anxiety
  - Stress
  - Overthinking
  - Sleep Problems
  - Sadness
  - Just Relax
- "Start Session" button (primary CTA)
- Small sound toggle icon (top-right corner)
- Theme switch option (top-left or settings access)

**Functionality:**
- User selects a mood
- Taps "Start Session" → navigates to Session Screen
- Sound toggle enables/disables audio playback
- Theme switch toggles between dark and light modes

**Visual Design:**
- Dark theme (default): Uses the "Dark.jpg" background image with soft blur
- Light theme: Clean white interface with subtle gradients
- Mood buttons: Soft, rounded rectangles with gentle hover/press states
- No aggressive visual elements

---

### 2. **Session Screen** (Core Feature)
The main interaction hub where users chat with AI and hear calming audio.

**Primary Content:**
- Minimalist messenger-style chat interface
- Chat messages displayed in a conversation thread
- User input field at the bottom (with send button)
- Calm animated background (pixelated version of "Dark.jpg" in dark mode)
- Audio player indicator (shows current audio track, if playing)
- Breathing exercise quick-access button (floating or top-right)

**Functionality:**
- AI responds to user messages with emotional support
- Messages limited to 10 per day for free users (unlimited for premium)
- Audio plays seamlessly in the background
- User can switch audio tracks (premium only)
- User can access relaxation tools (breathing exercise, sleep mode, grounding, quiet mode)

**Visual Design:**
- Chat bubbles: User messages on right (primary color), AI messages on left (soft muted color)
- Background: Pixelated version of "Dark.jpg" (dark mode) or clean white (light mode)
- Smooth fade-in/out transitions when switching audio tracks
- Minimal visual clutter

---

### 3. **Relaxation Tools Screen**
A dedicated screen for guided relaxation exercises.

**Primary Content:**
- Four relaxation tool buttons:
  - Breathing Exercise (4-4-6)
  - Sleep Mode (premium)
  - Grounding Exercise (premium)
  - Quiet Relaxation Mode (premium)
- Each button includes a brief description

**Functionality:**
- Tapping a tool navigates to its dedicated experience screen
- Free users can access Breathing Exercise only
- Premium users unlock Sleep Mode, Grounding Exercise, and Quiet Mode

**Visual Design:**
- Soft, rounded buttons with calming colors
- Icons or illustrations for each tool
- Minimal text, maximum clarity

---

### 4. **Breathing Exercise Screen**
Guided 4-4-6 breathing with visual feedback.

**Primary Content:**
- Centered, softly animated breathing circle
- Text prompts: "Slowly breathe in...", "Gently hold...", "Slowly breathe out..."
- Subtle background animation
- Session timer or cycle counter

**Functionality:**
- Circle expands during 4-second inhale
- Circle pauses during 4-second hold
- Circle contracts during 6-second exhale
- Calming audio continues playing
- User can exit at any time

**Visual Design:**
- Minimalist, centered layout
- Soft, flowing animations (no jarring transitions)
- Calming color scheme (primary color or soft gradient)

---

### 5. **Sleep Mode Screen** (Premium)
Dimmed, ultra-calm interface for pre-sleep relaxation.

**Primary Content:**
- Dimmed chat interface
- Slower AI response times
- Calming audio playing automatically
- Minimal visual stimulation

**Functionality:**
- AI tone becomes extremely gentle and slow
- Reduced screen brightness
- Relaxing audio auto-plays
- User can still chat, but interaction is minimal

**Visual Design:**
- Reduced brightness (system-level or app-level)
- Soft, muted colors
- No animations or visual stimulation
- Smooth, slow transitions

---

### 6. **Grounding Exercise Screen** (Premium)
Guided 5-senses grounding technique.

**Primary Content:**
- AI guides user through steps:
  1. Name 5 things you can see
  2. Name 4 things you can touch
  3. Name 3 things you can hear
  4. Name 2 things you can smell
  5. Name 1 emotion you currently feel
- Input field for user responses
- Progress indicator (step 1/5, etc.)

**Functionality:**
- AI presents each step sequentially
- User types responses
- AI validates and moves to next step
- Calming audio continues playing

**Visual Design:**
- Clean, minimal interface
- Progress bar or step counter
- Soft, supportive color scheme

---

### 7. **Quiet Relaxation Mode Screen** (Premium)
No chat—just audio and visuals.

**Primary Content:**
- Looped relaxing music or nature sounds
- Smooth, calming background animation
- Optional visual elements (animated shapes, gradients)
- No chat interface

**Functionality:**
- Audio plays continuously
- No notifications or interruptions
- User can exit at any time
- Optional: user can switch between audio categories (Music, Forest, Rain)

**Visual Design:**
- Minimalist, peaceful layout
- Smooth, looped background animation
- Soft color palette
- No text or UI clutter

---

### 8. **Settings Screen**
User preferences and account management.

**Primary Content:**
- Theme toggle (Dark/Light)
- Sound toggle (On/Off)
- Language selection (English, Spanish, German)
- Premium subscription status
- Disclaimer: "This app provides emotional support and relaxation and is not a medical service."
- About & Support links

**Functionality:**
- Users can manually switch themes
- Users can enable/disable audio
- Users can change language
- Users can view subscription status and upgrade to premium

**Visual Design:**
- Standard settings layout
- Clear, readable options
- Soft, calming color scheme

---

## Key User Flows

### Flow 1: First-Time User Opens App
1. App opens → Home Screen (dark theme, default)
2. User sees "How are you feeling today?" with mood buttons
3. User selects mood (e.g., "Anxiety")
4. User taps "Start Session"
5. Relaxing audio begins (free audio: RelaxM1)
6. Session Screen opens with AI chat
7. AI greets user with calm, supportive message
8. User feels emotionally supported within 30–60 seconds ✓

### Flow 2: User Accesses Breathing Exercise
1. User is on Session Screen
2. User taps "Breathing Exercise" button
3. Breathing Exercise Screen opens
4. Animated circle guides breathing (4-4-6 cycle)
5. Audio continues playing
6. User completes exercise and returns to Session Screen

### Flow 3: Premium User Switches Audio
1. User is on Session Screen (premium)
2. User taps "Audio" button
3. Audio selection menu appears: Music, Forest Sounds, Rain Sounds
4. User selects "Forest Sounds"
5. Current audio fades out, Forest audio fades in
6. User continues chatting with AI

### Flow 4: User Enables Sleep Mode (Premium)
1. User is on Session Screen (premium)
2. User taps "Sleep Mode" button
3. Screen dims, chat interface becomes softer
4. AI responses become slower and gentler
5. Calming audio plays
6. User feels safe and ready for sleep

---

## Color Palette

### Dark Theme (Default)
- **Background:** Deep dark blue/charcoal (#151718 or similar from theme.config.js)
- **Surface:** Slightly lighter dark (#1e2022)
- **Primary Accent:** Soft teal/cyan (#0a7ea4)
- **Text (Foreground):** Soft white (#ECEDEE)
- **Text (Muted):** Soft gray (#9BA1A6)
- **Border:** Subtle dark gray (#334155)

### Light Theme
- **Background:** Clean white (#ffffff)
- **Surface:** Very light gray (#f5f5f5)
- **Primary Accent:** Soft teal/cyan (#0a7ea4)
- **Text (Foreground):** Dark gray (#11181C)
- **Text (Muted):** Medium gray (#687076)
- **Border:** Light gray (#E5E7EB)

---

## Typography & Spacing

- **Font Family:** System font (SF Pro Display on iOS, Roboto on Android)
- **Title:** 28–32px, bold, foreground color
- **Subtitle:** 16–18px, regular, muted color
- **Body:** 14–16px, regular, foreground color
- **Small:** 12–14px, regular, muted color
- **Spacing:** 16px base unit (8px, 16px, 24px, 32px increments)

---

## Animation Guidelines

- **Breathing Circle:** Smooth, 4-second expand/contract cycles
- **Audio Fade Transitions:** 500–800ms fade-in/fade-out
- **Button Press:** Subtle scale (0.97) + opacity change
- **Screen Transitions:** Soft fade-in (200–300ms)
- **No jarring or bouncy animations**—keep everything smooth and calming

---

## Accessibility

- **Color Contrast:** WCAG AA compliant (minimum 4.5:1 for text)
- **Touch Targets:** Minimum 44×44px for buttons
- **Text Size:** Respects system font size settings
- **Dark Mode:** Automatic support via theme system
- **Haptic Feedback:** Subtle feedback on button presses (Light impact)

---

## Summary

CalmSpace's interface is designed to be a **calm, emotionally safe digital space**. Every element—from color choices to animation timing—contributes to the user's sense of relaxation and emotional support. The minimalist design ensures users can access AI chat and audio within seconds, without cognitive overload.
