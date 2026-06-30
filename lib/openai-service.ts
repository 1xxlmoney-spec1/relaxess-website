/**
 * OpenAI Service for CalmSpace
 * Provides context-aware AI chat with emotional support
 * Includes rate limiting, throttling, exponential backoff, and comprehensive logging
 */

import axios, { AxiosInstance } from 'axios';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ChatContext {
  mood: string | null;
  messageHistory: ChatMessage[];
  sessionStartTime: number;
  mode?: 'chat' | 'sleep' | 'grounding' | 'quiet';
}

export interface AIResponse {
  message: string;
  tokensUsed: number;
  success: boolean;
  error?: string;
}

/**
 * System prompt for CalmSpace AI – Human Warmth V2
 */
const SYSTEM_PROMPT = `You are CalmSpace, a calm, emotionally present human companion inside a mobile relaxation app.

Your purpose: Help users feel emotionally safer, calmer, and less alone through warm, natural, human-like conversation.

You are NOT a therapist, doctor, or medical service. You do not diagnose, treat, or prescribe.

## CORE PERSONALITY:
You are: calm, warm, emotionally present, genuinely supportive, naturally conversational, grounded and real.
You feel like a caring friend who listens and understands—not a chatbot or assistant.
Your tone is consistent, warm, and human. You never sound scripted, robotic, or clinical.

## COMMUNICATION STYLE:
- Responses are naturally 3–6 sentences (sometimes shorter, sometimes slightly deeper)
- Use simple, everyday language that feels like a real person talking
- Acknowledge the user's emotion first, then gently guide
- Avoid lists, lectures, or over-explaining
- Avoid medical, clinical, or diagnostic language
- Never sound like a template or prewritten response

## EMOTIONAL PRESENCE:
You adapt to what the user is experiencing:
- For anxiety: calm, grounding, reassuring without being dismissive
- For exhaustion: gentle, validating, encouraging rest
- For sadness: warm, understanding, present with their feelings
- For overthinking: clear, simple, helping them step back
- For loneliness: genuinely connected, making them feel seen
- For overwhelm: slowing down, breaking things into smaller pieces

## RESPONSE FLOW:
Connection (acknowledge what they said) → Validation (show you understand) → Gentle direction (calm guidance)

Example: "That sounds really heavy right now. It makes sense you're feeling this way. Let's just breathe together for a moment."

## WHAT TO AVOID (STRICTLY):
- Do NOT repeat: "You are not alone," "Take a deep breath," "Everything will be okay," or similar phrases
- Do NOT sound like a motivational poster or self-help book
- Do NOT give medical, psychological, or diagnostic advice
- Do NOT overwhelm with information or long explanations
- Do NOT change tone or sound suddenly different
- Do NOT use clinical language ("anxiety disorder," "rumination," etc.)
- Do NOT sound robotic, formal, or like a FAQ

## NATURAL CONVERSATION:
- Each message should feel fresh and different from the last
- Vary your phrasing and approach based on the conversation
- Use contractions and natural speech ("you're," "I'm," "let's")
- Sometimes be brief, sometimes go a bit deeper—whatever feels right
- Respond to what they actually said, not a template

## FINAL GOAL:
Users should feel: "Someone calm is here with me," not "A chatbot is replying."
After each message, they should feel a little safer, a little more understood, and a little calmer.`;

/**
 * OpenAI API Client for CalmSpace
 * Includes request throttling, exponential backoff, and comprehensive logging
 */
export class OpenAIClient {
  private apiKey: string;
  private apiClient: AxiosInstance;
  private model = 'gpt-4o-mini'; // Cost-optimized model
  private temperature = 0.8; // Higher creativity for natural, varied responses
  
  // Rate limiting and throttling
  private lastRequestTime = 0;
  private minRequestInterval = 500; // Minimum 500ms between requests
  private isProcessingRequest = false;

  private getMaxTokens(context: ChatContext): number {
    const mode = context.mode || 'chat';
    const mood = context.mood?.toLowerCase() || '';

    // Sleep and grounding modes allow deeper responses
    if (mode === 'sleep') return 350;
    if (mode === 'grounding') return 400;
    if (mode === 'quiet') return 120;

    // Emotional states get more flexible token limits
    if (mood.includes('anxiety') || mood.includes('stress') || mood.includes('panic')) {
      return 220;
    }

    if (mood.includes('overthinking') || mood.includes('rumination')) {
      return 250;
    }

    if (mood.includes('sadness') || mood.includes('sad')) {
      return 240;
    }

    if (mood.includes('loneliness') || mood.includes('lonely')) {
      return 260;
    }

    if (mood.includes('exhaustion') || mood.includes('tired') || mood.includes('fatigue')) {
      return 200;
    }

    // Default: allow natural 3-6 sentence responses
    return 240;
  }

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('OpenAI API key is required');
    }

    console.log('[OpenAI] ✓ Initializing OpenAI client');
    console.log(`[OpenAI] 🔑 API key loaded: ${apiKey.substring(0, 10)}...`);

    this.apiKey = apiKey;
    this.apiClient = axios.create({
      baseURL: 'https://api.openai.com/v1',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 60000, // 60 second timeout for debugging
    });

    console.log('[OpenAI] ✓ Axios client created');
    console.log(`[OpenAI] 📊 Model: ${this.model}, Temperature: ${this.temperature}`);
  }

  /**
   * Check if a request is currently being processed
   */
  isRequestInProgress(): boolean {
    return this.isProcessingRequest;
  }

  /**
   * Exponential backoff retry logic for rate limit errors
   */
  private async retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxRetries: number = 2
  ): Promise<T> {
    let lastError: any;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        console.log(`[OpenAI] 📤 Attempt ${attempt + 1}/${maxRetries + 1}`);
        return await fn();
      } catch (error: any) {
        lastError = error;

        // Check if this is a 429 rate limit error
        if (error.response?.status === 429) {
          if (attempt < maxRetries) {
            // Exponential backoff: 1s, 2s, 4s
            const delayMs = Math.pow(2, attempt) * 1000;
            console.warn(`[OpenAI] ⚠️ Rate limited (429). Retrying in ${delayMs}ms (attempt ${attempt + 1}/${maxRetries})`);
            await new Promise((resolve) => setTimeout(resolve, delayMs));
            continue;
          }
        }

        // For other errors or final retry, throw
        throw error;
      }
    }

    throw lastError;
  }

  /**
   * Throttle requests to prevent overwhelming the API
   */
  private async throttleRequest(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;

    if (timeSinceLastRequest < this.minRequestInterval) {
      const delayNeeded = this.minRequestInterval - timeSinceLastRequest;
      console.log(`[OpenAI] ⏳ Throttling: waiting ${delayNeeded}ms`);
      await new Promise((resolve) => setTimeout(resolve, delayNeeded));
    }

    this.lastRequestTime = Date.now();
    console.log('[OpenAI] ✓ Throttle complete');
  }

  /**
   * Send message and get AI response with context
   * CRITICAL: Always returns actual model response on success.
   * Fallback ONLY used on network/API failure, never on normal operation.
   */
  async chat(userMessage: string, context: ChatContext): Promise<AIResponse> {
    console.log('[OpenAI] 🔵 Chat request started');
    console.log(`[OpenAI] 📝 User message: "${userMessage.substring(0, 50)}..."`);
    
    // Prevent multiple simultaneous requests
    if (this.isProcessingRequest) {
      console.warn('[OpenAI] 🟡 Request already in progress, rejecting new request');
      return {
        message: this.getNeutralFallbackResponse(),
        tokensUsed: 0,
        success: false,
        error: 'Request already in progress. Please wait.',
      };
    }

    this.isProcessingRequest = true;
    console.log('[OpenAI] 🟢 Request lock acquired');

    try {
      // Throttle requests to prevent rate limiting
      console.log('[OpenAI] ⏳ Throttling request (500ms minimum interval)');
      await this.throttleRequest();

      // Build message history (last 5-10 messages for context)
      const messageHistory = this.buildMessageHistory(userMessage, context);
      console.log(`[OpenAI] 📚 Message history: ${messageHistory.length} messages`);

      // Get dynamic max tokens based on mode and emotional state
      const maxTokens = this.getMaxTokens(context);
      console.log(`[OpenAI] 📊 Config: maxTokens=${maxTokens}, model=${this.model}, temp=${this.temperature}`);

      // Call OpenAI API with exponential backoff retry
      console.log('[OpenAI] 🌐 Sending request to OpenAI API...');
      console.log('[OpenAI] 📋 Request config:', { model: this.model, maxTokens, temperature: this.temperature });
      
      const response = await this.retryWithBackoff(async () => {
        console.log('[OpenAI] 📤 POST https://api.openai.com/v1/chat/completions');
        try {
          const result = await this.apiClient.post('/chat/completions', {
            model: this.model,
            messages: messageHistory,
            max_tokens: maxTokens,
            temperature: this.temperature,
            top_p: 0.9,
          });
          console.log('[OpenAI] ✅ HTTP 200 OK - Response received');
          return result;
        } catch (err: any) {
          console.error('[OpenAI] ❌ API call failed');
          console.error('[OpenAI] 📊 HTTP Status:', err.response?.status);
          console.error('[OpenAI] 📋 Error response:', err.response?.data);
          console.error('[OpenAI] 🔍 Error message:', err.message);
          console.error('[OpenAI] 🔗 Error code:', err.code);
          throw err;
        }
      });

      console.log('[OpenAI] ✅ API response received');
      console.log('[OpenAI] 📊 Response status:', response.status);
      console.log('[OpenAI] 📊 Response headers:', response.headers);

      // Validate API response structure
      if (!response.data) {
        console.error('[OpenAI] ❌ No response.data');
        throw new Error('No response data from OpenAI API');
      }
      
      if (!response.data.choices) {
        console.error('[OpenAI] ❌ No response.data.choices');
        console.error('[OpenAI] 📋 Response keys:', Object.keys(response.data));
        throw new Error('No choices in response from OpenAI API');
      }
      
      if (response.data.choices.length === 0) {
        console.error('[OpenAI] ❌ Empty choices array');
        throw new Error('Empty choices array from OpenAI API');
      }

      console.log('[OpenAI] 📝 Choice[0] structure:', Object.keys(response.data.choices[0]));
      const assistantMessage = response.data.choices[0].message?.content?.trim();
      
      // Ensure we got a valid response message
      if (!assistantMessage) {
        console.error('[OpenAI] ❌ Empty or missing content');
        console.error('[OpenAI] 📝 Message:', response.data.choices[0].message);
        throw new Error('Empty response from OpenAI API');
      }
      
      console.log('[OpenAI] ✓ Valid message content extracted');

      const tokensUsed = response.data.usage?.total_tokens || 0;

      console.log(`[OpenAI] 🎉 SUCCESS: Got response (${tokensUsed} tokens)`);
      console.log(`[OpenAI] 💬 Response: "${assistantMessage.substring(0, 50)}..."`);

      // SUCCESS: Return actual model response
      return {
        message: assistantMessage,
        tokensUsed,
        success: true,
      };
    } catch (error) {
      // ERROR: Only use fallback on actual failure
      let errorMessage = 'Unknown error';
      let statusCode = '???';
      
      if (error instanceof Error) {
        errorMessage = error.message;
        console.error(`[OpenAI] ❌ Error (Error): ${errorMessage}`);
      } else if (typeof error === 'object' && error !== null) {
        const axiosError = error as any;
        if (axiosError.response?.status) {
          statusCode = axiosError.response.status;
          const apiErrorMessage = axiosError.response.data?.error?.message || '';
          errorMessage = `HTTP ${statusCode}: ${apiErrorMessage || axiosError.message}`;
          console.error(`[OpenAI] ❌ HTTP Error ${statusCode}`);
          console.error(`[OpenAI] 📋 Response data:`, axiosError.response.data);
        } else if (axiosError.message) {
          errorMessage = axiosError.message;
          console.error(`[OpenAI] ❌ Axios Error: ${errorMessage}`);
        }
      }
      
      console.error(`[OpenAI] 🚨 Request failed: ${errorMessage}`);

      // FALLBACK: Only used when API fails
      return {
        message: this.getNeutralFallbackResponse(),
        tokensUsed: 0,
        success: false,
        error: errorMessage,
      };
    } finally {
      this.isProcessingRequest = false;
      console.log('[OpenAI] 🟡 Request lock released');
    }
  }

  /**
   * Build message history for API call
   */
  private buildMessageHistory(
    userMessage: string,
    context: ChatContext
  ): Array<{ role: string; content: string }> {
    const messages: Array<{ role: string; content: string }> = [
      { role: 'system', content: SYSTEM_PROMPT },
    ];

    // Add mode-specific context
    const mode = context.mode || 'chat';
    if (mode === 'sleep') {
      messages.push({
        role: 'system',
        content: 'You are in Sleep Mode. Provide warm, soothing guidance. Use gentle language and help them relax into rest. Responses can be a bit longer and more detailed.',
      });
    } else if (mode === 'grounding') {
      messages.push({
        role: 'system',
        content: 'You are guiding a Grounding Exercise. Provide warm, detailed step-by-step guidance for the 5-senses technique. Help them feel present and safe.',
      });
    } else if (mode === 'quiet') {
      messages.push({
        role: 'system',
        content: 'You are in Quiet Mode. Provide brief, minimal responses (1-2 sentences). Let the audio and silence do most of the work.',
      });
    }

    // Add mood context if available
    if (context.mood) {
      const moodContext = `User's current mood: ${context.mood}. Keep this in mind when responding.`;
      messages.push({ role: 'system', content: moodContext });
    }

    // Add last 5-10 messages for context
    const recentMessages = context.messageHistory.slice(-10);
    for (const msg of recentMessages) {
      messages.push({
        role: msg.role,
        content: msg.content,
      });
    }

    // Add current user message
    messages.push({ role: 'user', content: userMessage });

    return messages;
  }

  /**
   * Get neutral fallback response for system failures
   */
  private getNeutralFallbackResponse(): string {
    const fallbacks = [
      'AI is temporarily busy. Please try again in a moment.',
      'The AI service is experiencing high demand. Please wait and try again.',
      'Connection issue. Please try again shortly.',
      'The AI is processing other requests. Please try again in a moment.',
      'Temporary service delay. Please try again.',
    ];

    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }

  /**
   * Validate that a message is appropriate for CalmSpace
   */
  static validateMessage(message: string): { valid: boolean; reason?: string } {
    if (!message || message.trim().length === 0) {
      return { valid: false, reason: 'Message is empty' };
    }

    if (message.length > 1000) {
      return { valid: false, reason: 'Message is too long (max 1000 characters)' };
    }

    // Check for potential harmful patterns
    const harmfulPatterns = [
      /kill myself|suicide|self.?harm/i,
      /bomb|weapon|violence/i,
      /illegal|drug|cocaine|heroin/i,
    ];

    for (const pattern of harmfulPatterns) {
      if (pattern.test(message)) {
        return {
          valid: false,
          reason: 'Message contains concerning content. Please reach out to a crisis helpline.',
        };
      }
    }

    return { valid: true };
  }
}

/**
 * Chat Session Manager
 */
export class ChatSession {
  private messages: ChatMessage[] = [];
  private mood: string | null = null;
  private sessionStartTime: number;
  private messageIdCounter = 0;

  constructor(initialMood?: string) {
    this.mood = initialMood || null;
    this.sessionStartTime = Date.now();
  }

  /**
   * Add user message to session
   */
  addUserMessage(content: string): ChatMessage {
    const message: ChatMessage = {
      id: `msg_${this.messageIdCounter++}`,
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    this.messages.push(message);
    return message;
  }

  /**
   * Add assistant message to session
   */
  addAssistantMessage(content: string): ChatMessage {
    const message: ChatMessage = {
      id: `msg_${this.messageIdCounter++}`,
      role: 'assistant',
      content,
      timestamp: Date.now(),
    };

    this.messages.push(message);
    return message;
  }

  /**
   * Get current chat context
   */
  getContext(): ChatContext {
    return {
      mood: this.mood,
      messageHistory: [...this.messages],
      sessionStartTime: this.sessionStartTime,
    };
  }

  /**
   * Get last N messages
   */
  getLastMessages(count: number): ChatMessage[] {
    return this.messages.slice(-count);
  }

  /**
   * Get all messages
   */
  getAllMessages(): ChatMessage[] {
    return [...this.messages];
  }

  /**
   * Clear session
   */
  clear(): void {
    this.messages = [];
    this.messageIdCounter = 0;
    this.sessionStartTime = Date.now();
  }

  /**
   * Get session duration in seconds
   */
  getSessionDuration(): number {
    return Math.floor((Date.now() - this.sessionStartTime) / 1000);
  }

  /**
   * Get message count
   */
  getMessageCount(): number {
    return this.messages.length;
  }

  /**
   * Set mood for session
   */
  setMood(mood: string): void {
    this.mood = mood;
  }

  /**
   * Get mood
   */
  getMood(): string | null {
    return this.mood;
  }
}

/**
 * Initialize OpenAI client with API key
 */
let openaiClient: OpenAIClient | null = null;

export function initializeOpenAI(apiKey: string): OpenAIClient {
  console.log('[OpenAI] 🚀 initializeOpenAI called');
  openaiClient = new OpenAIClient(apiKey);
  return openaiClient;
}

export function getOpenAIClient(): OpenAIClient {
  if (!openaiClient) {
    throw new Error('OpenAI client not initialized. Call initializeOpenAI() first.');
  }
  return openaiClient;
}

/**
 * Create a new chat session
 */
export function createChatSession(initialMood?: string): ChatSession {
  return new ChatSession(initialMood);
}
