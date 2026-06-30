# OpenAI Integration Guide for CalmSpace

## Overview

CalmSpace uses OpenAI's `gpt-4o-mini` model to provide context-aware, emotionally supportive AI responses. The system is optimized for low token usage while maintaining high-quality, calm, and therapeutic responses.

## Architecture

### Core Components

1. **OpenAI Service** (`lib/openai-service.ts`)
   - `OpenAIClient`: Manages API calls to OpenAI
   - `ChatSession`: Maintains message history and context
   - `ChatContext`: Encapsulates mood, mode, and message history

2. **OpenAI Context Provider** (`lib/openai-context.tsx`)
   - Global state management for chat
   - Daily message limit tracking
   - Persistent storage of message counts

3. **Session Screen** (`app/session.tsx`)
   - User interface for AI chat
   - Message display and input
   - Loading states and error handling

## Features

### Dynamic Token Limits

Response length adapts based on emotional state and mode:

| Mode | Tokens | Use Case |
|------|--------|----------|
| Regular Chat | 150 | Quick, focused responses |
| Anxiety/Stress | 150 | Keep very short for acute distress |
| Overthinking | 200 | Slightly longer for cognitive work |
| Sleep Mode | 250 | Longer, more soothing guidance |
| Grounding Mode | 300 | Detailed step-by-step guidance |
| Quiet Mode | 100 | Minimal, calming responses |

### Context-Aware Responses

- **Last 5-10 messages** included in API call for conversation continuity
- **Mood tracking** influences response tone and length
- **Mode-specific prompts** for sleep, grounding, and quiet modes
- **Temperature**: 0.7 (balanced creativity and consistency)

### Message Validation

- Empty/whitespace messages rejected
- Max 1000 characters per message
- Harmful content patterns detected and blocked
- Crisis patterns trigger compassionate response with professional help suggestion

### Daily Message Limit

- **Free users**: 10 messages per day
- **Premium users**: Unlimited
- Limit resets at midnight (user's local timezone)
- Persisted to AsyncStorage for offline tracking

### Fallback Responses

When API fails, system returns one of 4 pre-written compassionate responses:
- "I'm having trouble connecting right now, but I'm here for you. Take a deep breath - you're doing great."
- "Let me take a moment to listen. Whatever you're feeling is valid and okay."
- "I'm here to support you. Remember to be kind to yourself right now."
- "Your feelings matter. Take a moment to breathe and know you're not alone."

## System Prompt

The AI operates under a carefully crafted system prompt that:

1. **Establishes role**: "Compassionate emotional support companion"
2. **Sets boundaries**: No medical advice, diagnoses, or treatment claims
3. **Defines response style**: Short, warm, empathetic, non-judgmental
4. **Guides behavior**: Focus on validation, breathing, grounding, self-compassion
5. **Handles crises**: Compassionate response + professional help suggestion

### Key Guidelines in System Prompt

- Keep responses SHORT (2-3 sentences max)
- Use warm, empathetic, non-judgmental language
- NEVER provide medical advice or diagnoses
- NEVER suggest replacing professional mental health care
- Focus on validation, breathing, grounding, and self-compassion
- Use simple, accessible language
- Avoid clinical or diagnostic terminology

## Setup Instructions

### 1. Get OpenAI API Key

1. Visit https://platform.openai.com/api-keys
2. Create a new API key
3. Copy the key (you won't be able to see it again)

### 2. Configure Environment Variable

The API key is set via `webdev_request_secrets` tool:

```
EXPO_PUBLIC_OPENAI_API_KEY=sk-...your-key-here...
```

### 3. Verify Configuration

Run tests to verify the service initializes correctly:

```bash
pnpm test
```

All 90+ tests should pass, including 23 OpenAI service tests.

## Usage in Components

### Starting a Chat Session

```tsx
import { useOpenAI } from '@/lib/openai-context';

export function MyComponent() {
  const { startNewSession } = useOpenAI();

  const handleStartChat = () => {
    startNewSession('anxiety'); // Pass mood
  };

  return <button onPress={handleStartChat}>Start Chat</button>;
}
```

### Sending Messages

```tsx
const { sendMessage, isLoading, messages, messagesRemainingToday } = useOpenAI();

const handleSend = async () => {
  await sendMessage('I feel overwhelmed');
};
```

### Accessing Chat Context

```tsx
const { currentSession } = useOpenAI();

const context = currentSession?.getContext();
console.log(context.mood); // 'anxiety'
console.log(context.messageHistory); // Array of ChatMessage
```

## Cost Optimization

### Why gpt-4o-mini?

- **Cost**: ~60% cheaper than gpt-4-turbo
- **Speed**: Faster response times
- **Quality**: Excellent for emotional support tasks
- **Token efficiency**: Optimized for short, focused responses

### Token Usage Estimates

| Scenario | Avg Tokens | Cost (per 1M tokens) |
|----------|-----------|---------------------|
| Regular chat message | 80-150 | $0.15 |
| Sleep mode response | 150-250 | $0.15 |
| Grounding guidance | 200-300 | $0.15 |

**Example**: 10 free users × 10 messages/day × 100 avg tokens = 10,000 tokens/day ≈ $0.0015/day

### Cost Control Strategies

1. **Token limits**: Enforce max tokens per mode
2. **Message limits**: Free tier capped at 10/day
3. **Caching**: Consider caching common responses (future enhancement)
4. **Rate limiting**: Implement per-user rate limits (future enhancement)

## Testing

### Unit Tests

Located in `tests/openai.test.ts`:

```bash
pnpm test tests/openai.test.ts
```

Tests cover:
- ChatSession creation and message management
- Message validation (empty, length, harmful content)
- Token limit calculation for different modes
- Chat context building
- Mode-specific behavior

### Integration Testing

1. **Manual testing** via Session Screen
2. **Message limit verification** (10/day for free users)
3. **Audio playback** during chat (should continue seamlessly)
4. **Offline behavior** (fallback responses when API unavailable)

## Troubleshooting

### "OpenAI client not initialized"

**Cause**: API key not set or initialization failed

**Solution**:
1. Verify `EXPO_PUBLIC_OPENAI_API_KEY` is set
2. Check browser console for errors
3. Restart dev server: `pnpm run dev`

### "No response from OpenAI API"

**Cause**: API returned empty response

**Solution**:
1. Check API key validity at https://platform.openai.com/account/api-keys
2. Verify API account has credits
3. Check API status at https://status.openai.com

### "Message limit reached"

**Cause**: Free user exceeded 10 messages/day

**Solution**:
1. Inform user limit resets at midnight
2. Offer premium upgrade
3. Display remaining messages count

### Long response times

**Cause**: API latency or network issues

**Solution**:
1. Show loading indicator (already implemented)
2. Implement timeout (30s) for API calls (future enhancement)
3. Consider response streaming (future enhancement)

## Future Enhancements

1. **Response Streaming**: Show AI response character-by-character
2. **Conversation Caching**: Cache common responses for faster replies
3. **Voice Input/Output**: Integrate speech-to-text and text-to-speech
4. **Sentiment Analysis**: Analyze user mood from messages
5. **Response Ratings**: Let users rate AI responses for feedback
6. **Fine-tuning**: Create custom model trained on CalmSpace data
7. **Multi-language Support**: Translate responses to user's language
8. **Conversation Export**: Allow users to export chat history

## Security & Privacy

### Data Handling

- **User messages**: Sent to OpenAI API for processing
- **Message history**: Stored locally in AsyncStorage (not synced)
- **API key**: Stored in environment variables (not exposed in code)
- **No PII**: System prompt instructs AI not to request personal information

### Compliance

- **GDPR**: Users can delete message history anytime
- **HIPAA**: Not HIPAA-compliant; not suitable for medical use
- **Disclaimer**: App clearly states it's not a medical service

## References

- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference)
- [gpt-4o-mini Model Card](https://platform.openai.com/docs/models/gpt-4o-mini)
- [Token Counting](https://platform.openai.com/docs/guides/tokens)
- [Rate Limiting](https://platform.openai.com/docs/guides/rate-limits)
