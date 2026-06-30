# Grounding Exercise (5–4–3–2–1) Screen Design

## Overview

A calm, minimal mental health app screen for the 5–4–3–2–1 grounding technique used for anxiety reduction and relaxation.

## Screen Architecture

### 1. Header Section
- **Title:** "Grounding Exercise"
- **Subtitle:** "5–4–3–2–1 technique for anxiety relief"
- Calm, supportive tone
- Positioned at top with breathing room

### 2. Progress Indicator
- **Step counter:** "Step X of 5" (e.g., "Step 1 of 5")
- **Visual progress bar:** Horizontal bar showing completion (0-100%)
- **Alternative:** Dot indicators (5 dots, filled/unfilled)
- Positioned below header

### 3. Main Step Card
Each step displays:
- **Icon:** Emoji representing the sense (👀 👂 ✋ 👃 ❤️)
- **Instruction:** Clear, action-oriented text
  - Step 1: "Name 5 things you can see"
  - Step 2: "Name 4 things you can feel"
  - Step 3: "Name 3 things you can hear"
  - Step 4: "Name 2 things you can smell"
  - Step 5: "Name 1 thing you can taste or notice about your body/breath"
- **Calming subtitle:** "Take your time. Look around slowly."
- **Centered, prominent positioning** in middle of screen

### 4. Input Area
- **Text input field** for user answers
- **Placeholder:** "e.g. chair, window, phone…"
- **Input style:** Soft, rounded corners, calm colors
- **Multiple entries:** Support comma-separated or line-by-line input
- **Visual feedback:** Subtle border highlight on focus
- **Character limit:** Reasonable but not restrictive

### 5. Navigation Buttons
- **"Back"** button (left, secondary style)
- **"Next"** button (right, primary style)
- **"Finish"** button (replaces "Next" on step 5)
- **Button styling:**
  - Large, rounded (border-radius: 24-32px)
  - Soft colors (blue, green, or pastel tones)
  - Disabled state when input is empty (optional)
  - Smooth press feedback (scale 0.97, opacity 0.8)
- **Positioning:** Bottom of screen, above safe area

### 6. Completion Screen
After step 5:
- **Message:** "You are grounded. Take a moment and notice how you feel now."
- **Message styling:** Large, calm text (text-2xl or text-3xl)
- **Buttons:**
  - "Repeat Exercise" (primary)
  - "Done" (secondary)
- **Smooth fade-in animation** for message

## Step Definitions

| Step | Icon | Instruction | Subtitle |
|------|------|-------------|----------|
| 1 | 👀 | Name 5 things you can see | Take your time. Look around slowly. |
| 2 | ✋ | Name 4 things you can feel | Notice textures, temperatures, sensations. |
| 3 | 👂 | Name 3 things you can hear | Listen carefully to sounds around you. |
| 4 | 👃 | Name 2 things you can smell | Notice scents in your environment. |
| 5 | ❤️ | Name 1 thing you can taste or notice about your body/breath | Feel your breath, heartbeat, or taste. |

## UX Behavior

1. **Wizard-style flow:** One step at a time
2. **Smooth transitions:** Fade or slide between steps
3. **State persistence:** Save user input per step
4. **Input validation:** Require at least one entry per step
5. **Navigation:** Back/Next buttons always available
6. **Progress feedback:** Visual progress bar updates on each step
7. **Completion celebration:** Smooth fade-in message on final screen

## Design Style

- **Aesthetic:** Calm, minimal, mental health app style
- **Colors:** Soft gradients or light background, pastel tones
- **Spacing:** Generous padding, breathing room, no clutter
- **Typography:** Friendly, supportive tone
- **Animations:** Smooth, subtle (no jarring effects)
- **Accessibility:** High contrast, readable text, clear buttons

## Technical Implementation

- **Framework:** React Native with Expo
- **State Management:** useState for step tracking and input
- **Animations:** react-native-reanimated for smooth transitions
- **Styling:** NativeWind (Tailwind CSS)
- **Components:** ScreenContainer, Pressable, TextInput, Animated.View

## File Structure

```
app/grounding.tsx          ← Main Grounding Exercise screen
components/
  grounding-step.tsx       ← Individual step component
  grounding-progress.tsx   ← Progress indicator component
  grounding-completion.tsx ← Completion screen component
```

## Key Features

✅ Step-by-step guided flow (5 steps)
✅ Progress tracking (visual bar + counter)
✅ Input handling (text field with examples)
✅ Navigation (Back/Next/Finish buttons)
✅ Completion screen with supportive message
✅ Smooth transitions between steps
✅ Calm, minimal design aesthetic
✅ Responsive mobile layout
✅ Accessibility considerations
