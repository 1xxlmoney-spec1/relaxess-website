/**
 * useSessionState - Session state management hook
 * 
 * Manages session lifecycle and interaction states.
 * Prepared for future AI response generation and speech-to-text integration.
 * 
 * States:
 * - idle: No active interaction
 * - typing: User is typing a message
 * - listening: Microphone is active (speech-to-text ready)
 * - loading_response: Waiting for AI response
 */

import { useState, useCallback } from "react";

export type SessionState = "idle" | "typing" | "listening" | "loading_response";

export interface UseSessionStateReturn {
  state: SessionState;
  messages: Array<{ id: string; role: "user" | "assistant"; content: string; timestamp: number }>;
  
  // State transitions
  setTyping: () => void;
  setListening: () => void;
  setLoadingResponse: () => void;
  setIdle: () => void;
  
  // Message management
  addUserMessage: (content: string) => void;
  addAssistantMessage: (content: string) => void;
  clearMessages: () => void;
  
  // Utility
  isInteracting: boolean;
}

export function useSessionState(): UseSessionStateReturn {
  const [state, setState] = useState<SessionState>("idle");
  const [messages, setMessages] = useState<Array<{
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: number;
  }>>([]);

  // State transitions
  const setTyping = useCallback(() => setState("typing"), []);
  const setListening = useCallback(() => setState("listening"), []);
  const setLoadingResponse = useCallback(() => setState("loading_response"), []);
  const setIdle = useCallback(() => setState("idle"), []);

  // Message management
  const addUserMessage = useCallback((content: string) => {
    const message = {
      id: `user-${Date.now()}`,
      role: "user" as const,
      content,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, message]);
  }, []);

  const addAssistantMessage = useCallback((content: string) => {
    const message = {
      id: `assistant-${Date.now()}`,
      role: "assistant" as const,
      content,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, message]);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const isInteracting = state !== "idle";

  return {
    state,
    messages,
    setTyping,
    setListening,
    setLoadingResponse,
    setIdle,
    addUserMessage,
    addAssistantMessage,
    clearMessages,
    isInteracting,
  };
}
