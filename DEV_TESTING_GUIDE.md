# CalmSpace Developer Testing Guide

## Accessing the Developer Testing Panel

The hidden developer testing panel allows QA testers to switch between user states and test premium features without rebuilding the app.

### How to Open

**On the Home Screen:**
1. Tap the sun/moon icon (theme toggle) **5 times rapidly** within 2 seconds
2. The panel will open with a success haptic feedback
3. All changes are persisted to device storage

### Testing Capabilities

#### 1. User Mode Switching

**Force FREE Mode**
- Sets user to free tier with 10 messages/day limit
- Disables premium features and audio categories
- Resets daily message counter

**Force PREMIUM Mode**
- Sets user to premium tier with unlimited messages
- Enables all premium features and audio categories
- Sets expiration date 30 days in the future

#### 2. Message Counter Management

**Reset Daily Counter**
- Resets message count to 0
- Useful for testing the 10-message limit repeatedly
- Does not affect subscription status

#### 3. Subscription Expiration Testing

**Simulate Expired Premium**
- Sets premium subscription to expire yesterday
- Requires app restart to take effect
- Tests the automatic fallback to free plan

**Revert to Free (Expired)**
- Immediately reverts to free plan
- Simulates what happens when premium expires

#### 4. Test Log

- All actions are logged with timestamps
- Last 20 entries are displayed
- Useful for debugging and tracking test sequence
- Can be cleared with the "Clear" button

### Current User State Display

The panel shows:
- Current status (👑 PREMIUM or 🆓 FREE)
- Messages used today / daily limit
- Remaining messages
- Premium expiration date (if applicable)

### Testing Workflow Example

**Testing Premium Message Limit:**
1. Open dev panel (5 taps on sun icon)
2. Tap "Force FREE Mode"
3. Go back to home and start a chat session
4. Send 10 messages - should be blocked on the 11th
5. Open dev panel again
6. Tap "Reset Daily Counter"
7. Send more messages - should work again

**Testing Premium Upgrade:**
1. Open dev panel
2. Tap "Force PREMIUM Mode"
3. Go to chat and send unlimited messages
4. Open dev panel again
5. Tap "Simulate Expired Premium"
6. Restart app
7. Verify user is back to free tier

**Testing Audio Categories:**
1. Open dev panel
2. Tap "Force PREMIUM Mode"
3. Go to Relaxation Tools
4. Verify all audio categories are available
5. Open dev panel
6. Tap "Force FREE Mode"
7. Go to Relaxation Tools
8. Verify only RelaxM1 is available

### Important Notes

- **Persistent Storage**: All changes are saved to device storage and persist across app restarts (except subscription expiration detection, which happens on app launch)
- **No Code Changes**: No need to rebuild the app to test different user states
- **Haptic Feedback**: Success actions provide haptic feedback for confirmation
- **Test Log**: Check the test log to verify actions were executed
- **Hidden Feature**: The dev panel is completely hidden - users won't see it unless they know the 5-tap gesture

### Troubleshooting

**Dev panel won't open:**
- Make sure you tap the sun/moon icon (top-left theme toggle)
- Tap exactly 5 times within 2 seconds
- Look for haptic feedback confirmation

**Changes not taking effect:**
- Check the test log to confirm the action was executed
- For subscription expiration, restart the app
- Check device storage is not full

**Message limit not working:**
- Verify you're in FREE mode (not PREMIUM)
- Reset the daily counter and try again
- Check the current state display in the dev panel

### For Developers

The dev panel is implemented in:
- `lib/dev-testing-panel.tsx` - Panel UI and logic
- `app/(tabs)/index.tsx` - Tap gesture detection
- Tests: `tests/dev-panel.test.ts`

The 5-tap gesture is detected on the theme toggle icon and opens the modal without any visual indication until activated.
