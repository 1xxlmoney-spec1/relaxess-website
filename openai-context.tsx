/**
 * OpenAI Context Provider
 * Manages chat state, message history, and API interactions
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { useAppContext } from './app-context';
import {
  OpenAIClient,
  ChatSession,
  ChatMessage,
  AIResponse,
  initializeOpenAI,
  createChatSession,
} from './openai-service';

export interface OpenAIContextType {
  // Chat state
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;

  // Session management
  currentSession: ChatSession | null;
  messageCount: number;
  dailyMessageLimit: number;
  messagesRemainingToday: number;

  // Actions
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
  startNewSession: (mood: string) => void;
  setDailyMessageLimit: (limit: number) => void;
}

const OpenAIContext = createContext<OpenAIContextType | undefined>(undefined);

const STORAGE_KEYS = {
  MESSAGES_TODAY: '@relaxess_messages_today',
  LAST_MESSAGE_DATE: '@relaxess_last_message_date',
  DAILY_LIMIT: '@relaxess_daily_limit',
};

export function OpenAIProvider({ children }: { children: React.ReactNode }) {
  const { session: appSession } = useAppContext();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [messageCount, setMessageCount] = useState(0);
  const [dailyMessageLimit, setDailyMessageLimitState] = useState(10);
  const [messagesRemainingToday, setMessagesRemainingToday] = useState(10);
  const [openaiClient, setOpenaiClient] = useState<OpenAIClient | null>(null);

  // Initialize OpenAI client and load state
  useEffect(() => {
    const initializeProvider = async () => {
      try {
        // Get API key from environment (try multiple sources for Expo compatibility)
        
        const apiKey = 
          process.env.EXPO_PUBLIC_OPENAI_API_KEY ||
          Constants.expoConfig?.extra?.EXPO_PUBLIC_OPENAI_API_KEY ||
          Constants.easConfig?.extra?.EXPO_PUBLIC_OPENAI_API_KEY;
        
        if (!apiKey) {
          console.error('❌ OpenAI API key not configured. Please set EXPO_PUBLIC_OPENAI_API_KEY environment variable.');
          setError('OpenAI API key not configured. Please contact support.');
          return;
        }
        

        // Initialize OpenAI client
        const client = initializeOpenAI(apiKey);
        setOpenaiClient(client);

        // Load daily message count
        const today = new Date().toDateString();
        const lastMessageDate = await AsyncStorage.getItem(STORAGE_KEYS.LAST_MESSAGE_DATE);
        const savedDailyLimit = await AsyncStorage.getItem(STORAGE_KEYS.DAILY_LIMIT);

        if (savedDailyLimit) {
          const limit = parseInt(savedDailyLimit, 10);
          setDailyMessageLimitState(limit);
        }

        if (lastMessageDate === today) {
          // Same day - load saved count
          const savedCount = await AsyncStorage.getItem(STORAGE_KEYS.MESSAGES_TODAY);
          const count = savedCount ? parseInt(savedCount, 10) : 0;
          setMessageCount(count);
          setMessagesRemainingToday(Math.max(0, dailyMessageLimit - count));
        } else {
          // New day - reset count
          await AsyncStorage.setItem(STORAGE_KEYS.LAST_MESSAGE_DATE, today);
          await AsyncStorage.setItem(STORAGE_KEYS.MESSAGES_TODAY, '0');
          setMessageCount(0);
          setMessagesRemainingToday(dailyMessageLimit);
        }

        // Create initial session
        const session = createChatSession();
        setCurrentSession(session);
      } catch (err) {
        console.error('Failed to initialize OpenAI provider:', err);
        setError('Failed to initialize chat service');
      }
    };

    initializeProvider();
  }, []);

  // Update messages remaining when limit changes
  useEffect(() => {
    setMessagesRemainingToday(Math.max(0, dailyMessageLimit - messageCount));
  }, [dailyMessageLimit, messageCount]);

  // Update daily message limit based on premium status
  useEffect(() => {
    if (appSession.isPremium) {
      // Premium users have unlimited messages
      setDailyMessageLimitState(999);
    } else {
      // Free users have 10 messages per day
      setDailyMessageLimitState(10);
    }
  }, [appSession.isPremium]);

  /**
   * Send message and get AI response
   */
  const sendMessage = useCallback(
    async (content: string) => {
      if (!openaiClient || !currentSession) {
        setError('Chat service not initialized');
        return;
      }

      // Check message limit (only for free users)
      if (!appSession.isPremium && messageCount >= dailyMessageLimit) {
        setError('Daily message limit reached. Try again tomorrow.');
        return;
      }

      // Validate message
      const validation = OpenAIClient.validateMessage(content);
      if (!validation.valid) {
        setError(validation.reason || 'Invalid message');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Add user message to session
        const userMessage = currentSession.addUserMessage(content);
        setMessages((prev) => [...prev, userMessage]);
        // Get AI response
        const context = currentSession.getContext();
        const response: AIResponse = await openaiClient.chat(content, context);
        // CRITICAL: Separate system states from AI responses
        // ONLY add to chat if API was successful
        // Error messages are NEVER added to chat history
        if (!response.success) {
          // API failed - show error in UI only, NOT in chat
          // Use single neutral error message for all failures
          setError('AI is temporarily unavailable. Please try again.');
          // Do NOT add any message to chat history
          // Do NOT add fallback message
          // User sees error in UI only, not in chat
        } else {
          // API succeeded - add ONLY real model response to chat
          const assistantMessage = currentSession.addAssistantMessage(response.message);
          setMessages((prev) => [...prev, assistantMessage]);
          // Clear any previous errors on success
          setError(null);
          // Increment message count (only on success)
          const newCount = messageCount + 1;
          setMessageCount(newCount);
          // Save to storage (only on success)
          const today = new Date().toDateString();
          await AsyncStorage.setItem(STORAGE_KEYS.MESSAGES_TODAY, newCount.toString());
          await AsyncStorage.setItem(STORAGE_KEYS.LAST_MESSAGE_DATE, today);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        console.error('Failed to send message:', errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [openaiClient, currentSession, messageCount, dailyMessageLimit, appSession.isPremium]
  );

  /**
   * Clear chat history
   */
  const clearChat = useCallback(() => {
    if (currentSession) {
      currentSession.clear();
    }
    setMessages([]);
    setError(null);
  }, [currentSession]);

  /**
   * Start new session with mood
   */
  const startNewSession = useCallback((mood: string) => {
    const session = createChatSession(mood);
    setCurrentSession(session);
    setMessages([]);
    setError(null);
  }, []);

  /**
   * Set daily message limit
   */
  const setDailyMessageLimit = useCallback((limit: number) => {
    setDailyMessageLimitState(limit);
    AsyncStorage.setItem(STORAGE_KEYS.DAILY_LIMIT, limit.toString()).catch((err) => {
      console.error('Failed to save daily limit:', err);
    });
  }, []);

  const value: OpenAIContextType = {
    messages,
    isLoading,
    error,
    currentSession,
    messageCount,
    dailyMessageLimit,
    messagesRemainingToday,
    sendMessage,
    clearChat,
    startNewSession,
    setDailyMessageLimit,
  };

  return <OpenAIContext.Provider value={value}>{children}</OpenAIContext.Provider>;
}

export function useOpenAI() {
  const context = useContext(OpenAIContext);
  if (!context) {
    throw new Error('useOpenAI must be used within OpenAIProvider');
  }
  return context;
}
