# Session Screen Architecture

## Overview

Clean separation of concerns for the Calm Session feature. UI structure and interaction placeholders are ready for future AI and speech-to-text integration.

## Components

### 1. SessionScreenArchitecture (`components/session-screen-architecture.tsx`)

Main component with three sub-components:

#### SessionHeader
- Displays session title
- Shows audio indicator (if enabled)
- Close button

#### ChatArea
- Displays message history
- Auto-scrolls to latest message
- Empty state: "Start speaking or typing to begin your session"
- Loading indicator during response generation

#### InputArea
- Text input field
- Microphone button (🎤) with listening state animation
- Send button (➤)
- Listening indicator text

### 2. Session State Hook (`hooks/use-session-state.ts`)

Manages session lifecycle:

```typescript
const {
  state,              // "idle" | "typing" | "listening" | "loading_response"
  messages,           // Array of messages
  setTyping,          // Transition to typing state
  setListening,       // Transition to listening state
  setLoadingResponse, // Transition to loading state
  setIdle,            // Transition to idle state
  addUserMessage,     // Add user message to history
  addAssistantMessage,// Add assistant message to history
  clearMessages,      // Clear message history
  isInteracting,      // Boolean: true if not idle
} = useSessionState();
```

### 3. Session Handlers (`lib/session-handlers.ts`)

Prepared integration points (currently placeholders):

- `handleTextMessage()` - Process text input
- `handleMicrophonePress()` - Handle microphone interactions
- `handleAudioPlayback()` - Play text-to-speech responses
- `initializeSession()` - Initialize session with mood context
- `endSession()` - Cleanup and end session
- `handleSessionError()` - Error handling

## Session States

| State | Description | UI Indicators |
|-------|-------------|---------------|
| `idle` | No active interaction | Normal UI |
| `typing` | User is typing | Text input focused |
| `listening` | Microphone active | Microphone button highlighted, "Listening..." text |
| `loading_response` | Waiting for AI response | Loading spinner in chat area |

## Message Structure

```typescript
interface Message {
  id: string;                    // Unique identifier
  role: "user" | "assistant";    // Message sender
  content: string;               // Message text
  timestamp: number;             // Unix timestamp
  source?: "text" | "voice";     // How message was created
}
```

## Future Integration Points

### 1. AI Response Generation
**File:** `lib/session-handlers.ts` → `handleTextMessage()`

```typescript
// TODO: Implement
const response = await getAIResponse(message);
onResponse(response);
```

**Integration:**
- Connect to OpenAI API (already available via `useOpenAI()`)
- Use mood context from `useAppContext()`
- Handle rate limiting and premium limits

### 2. Speech-to-Text
**File:** `lib/session-handlers.ts` → `handleMicrophonePress()`

```typescript
// TODO: Implement
const transcript = await startSpeechRecognition();
onTranscription(transcript);
```

**Integration:**
- Use `expo-audio` for recording
- Connect to speech-to-text API (Manus backend or external service)
- Handle permissions and error states

### 3. Text-to-Speech
**File:** `lib/session-handlers.ts` → `handleAudioPlayback()`

```typescript
// TODO: Implement
const audioUri = await generateSpeech(text);
await playAudio(audioUri);
```

**Integration:**
- Use `expo-audio` for playback
- Connect to text-to-speech API
- Respect audio toggle from settings

## Usage Example

```typescript
import { SessionScreenArchitecture } from "@/components/session-screen-architecture";
import { useSessionState } from "@/hooks/use-session-state";

export default function MySessionScreen() {
  const sessionState = useSessionState();
  
  const handleSendMessage = (message: string) => {
    sessionState.addUserMessage(message);
    sessionState.setLoadingResponse();
    
    // TODO: Call AI handler
    // handleTextMessage(message, (response) => {
    //   sessionState.addAssistantMessage(response);
    //   sessionState.setIdle();
    // });
  };
  
  const handleMicrophonePress = () => {
    sessionState.setListening();
    
    // TODO: Call microphone handler
    // handleMicrophonePress("listening", (state) => {
    //   if (state === "idle") sessionState.setIdle();
    // });
  };
  
  return (
    <SessionScreenArchitecture
      title="Calm Session"
      onClose={() => router.back()}
      onSendMessage={handleSendMessage}
      onMicrophonePress={handleMicrophonePress}
      messages={sessionState.messages}
      isLoading={sessionState.state === "loading_response"}
      sessionState={sessionState.state}
    />
  );
}
```

## Testing

All tests pass (138 passed):
- ✅ No TypeScript errors
- ✅ No compilation errors
- ✅ Architecture is compatible with existing code

## Next Steps

1. **Implement AI Response Generation**
   - Connect `handleTextMessage()` to OpenAI API
   - Use existing `useOpenAI()` hook
   - Handle premium message limits

2. **Implement Speech-to-Text**
   - Connect `handleMicrophonePress()` to speech recognition
   - Request microphone permissions
   - Handle transcription errors

3. **Implement Text-to-Speech**
   - Connect `handleAudioPlayback()` to speech synthesis
   - Respect audio toggle from settings
   - Handle playback errors

4. **Add Session Persistence**
   - Save session history to AsyncStorage
   - Allow users to review past sessions
   - Add session analytics

## Architecture Benefits

✅ **Clean Separation** - UI is independent of AI/voice logic  
✅ **Testable** - Each component can be tested independently  
✅ **Scalable** - Easy to add new features without modifying existing code  
✅ **Maintainable** - Clear integration points for future work  
✅ **Type-Safe** - Full TypeScript support with clear interfaces  
