/**
 * App-wide state management for Relaxess
 * Manages: theme, language, audio state, user session, premium status
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language, DEFAULT_LANGUAGE } from './i18n';

export type Theme = 'light' | 'dark';

export interface UserSession {
  selectedMood: string | null;
  messagesUsedToday: number;
  isPremium: boolean;
  premiumExpiresAt: string | null; // ISO date string or null
  lastMessageReset: string; // ISO date string
}

export interface AppContextType {
  // Theme
  theme: Theme;
  setTheme: (theme: Theme) => Promise<void>;

  // Language
  language: Language;
  setLanguage: (language: Language) => Promise<void>;

  // Audio
  audioEnabled: boolean;
  setAudioEnabled: (enabled: boolean) => Promise<void>;

  // Session
  session: UserSession;
  setSelectedMood: (mood: string) => void;
  incrementMessageCount: () => void;
  resetMessageCount: () => void;
  setPremium: (isPremium: boolean, expiresAt?: string) => Promise<void>;

  // Loading state
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  THEME: '@relaxess_theme',
  LANGUAGE: '@relaxess_language',
  AUDIO_ENABLED: '@relaxess_audio_enabled',
  MESSAGES_USED_TODAY: '@relaxess_messages_used_today',
  LAST_MESSAGE_RESET: '@relaxess_last_message_reset',
  IS_PREMIUM: '@relaxess_is_premium',
  PREMIUM_EXPIRES_AT: '@relaxess_premium_expires_at',
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE);
  const [audioEnabled, setAudioEnabledState] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSessionState] = useState<UserSession>({
    selectedMood: null,
    messagesUsedToday: 0,
    isPremium: false,
    premiumExpiresAt: null,
    lastMessageReset: new Date().toISOString(),
  });

  // Load persisted state on mount
  useEffect(() => {
    const loadState = async () => {
      try {
        const [
          savedTheme,
          savedLanguage,
          savedAudioEnabled,
          savedMessagesUsed,
          savedLastReset,
          savedIsPremium,
          savedPremiumExpiresAt,
        ] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.THEME),
          AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE),
          AsyncStorage.getItem(STORAGE_KEYS.AUDIO_ENABLED),
          AsyncStorage.getItem(STORAGE_KEYS.MESSAGES_USED_TODAY),
          AsyncStorage.getItem(STORAGE_KEYS.LAST_MESSAGE_RESET),
          AsyncStorage.getItem(STORAGE_KEYS.IS_PREMIUM),
          AsyncStorage.getItem(STORAGE_KEYS.PREMIUM_EXPIRES_AT),
        ]);

        if (savedTheme) setThemeState(savedTheme as Theme);
        if (savedLanguage) setLanguageState(savedLanguage as Language);
        if (savedAudioEnabled !== null) setAudioEnabledState(savedAudioEnabled === 'true');

        // Check if message count should be reset (new day)
        const lastReset = savedLastReset ? new Date(savedLastReset) : new Date();
        const today = new Date();
        const isNewDay =
          lastReset.getDate() !== today.getDate() ||
          lastReset.getMonth() !== today.getMonth() ||
          lastReset.getFullYear() !== today.getFullYear();

        const messagesUsed = isNewDay ? 0 : parseInt(savedMessagesUsed || '0', 10);

        // Check if premium subscription has expired
        let isPremium = savedIsPremium === 'true';
        let premiumExpiresAt = savedPremiumExpiresAt;
        
        if (isPremium && premiumExpiresAt) {
          const expirationDate = new Date(premiumExpiresAt);
          if (expirationDate < today) {
            // Premium has expired - revert to free plan
            isPremium = false;
            premiumExpiresAt = null;
            await AsyncStorage.setItem(STORAGE_KEYS.IS_PREMIUM, 'false');
            await AsyncStorage.removeItem(STORAGE_KEYS.PREMIUM_EXPIRES_AT);
          }
        }

        setSessionState((prev) => ({
          ...prev,
          messagesUsedToday: messagesUsed,
          isPremium,
          premiumExpiresAt,
          lastMessageReset: isNewDay ? today.toISOString() : lastReset.toISOString(),
        }));

        if (isNewDay) {
          await AsyncStorage.setItem(STORAGE_KEYS.LAST_MESSAGE_RESET, today.toISOString());
        }
      } catch (error) {
        console.error('Failed to load app state:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadState();
  }, []);

  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    await AsyncStorage.setItem(STORAGE_KEYS.THEME, newTheme);
  };

  const setLanguage = async (newLanguage: Language) => {
    setLanguageState(newLanguage);
    await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, newLanguage);
  };

  const setAudioEnabled = async (enabled: boolean) => {
    setAudioEnabledState(enabled);
    await AsyncStorage.setItem(STORAGE_KEYS.AUDIO_ENABLED, enabled.toString());
  };

  const setSelectedMood = (mood: string) => {
    setSessionState((prev) => ({
      ...prev,
      selectedMood: mood,
    }));
  };

  const incrementMessageCount = () => {
    setSessionState((prev) => {
      const newCount = prev.messagesUsedToday + 1;
      AsyncStorage.setItem(STORAGE_KEYS.MESSAGES_USED_TODAY, newCount.toString());
      return {
        ...prev,
        messagesUsedToday: newCount,
      };
    });
  };

  const resetMessageCount = async () => {
    const today = new Date().toISOString();
    setSessionState((prev) => ({
      ...prev,
      messagesUsedToday: 0,
      lastMessageReset: today,
    }));
    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.MESSAGES_USED_TODAY, '0'),
      AsyncStorage.setItem(STORAGE_KEYS.LAST_MESSAGE_RESET, today),
    ]);
  };

  const setPremium = async (isPremium: boolean, expiresAt?: string) => {
    setSessionState((prev) => ({
      ...prev,
      isPremium,
      premiumExpiresAt: expiresAt || null,
    }));
    await AsyncStorage.setItem(STORAGE_KEYS.IS_PREMIUM, isPremium.toString());
    if (expiresAt) {
      await AsyncStorage.setItem(STORAGE_KEYS.PREMIUM_EXPIRES_AT, expiresAt);
    } else {
      await AsyncStorage.removeItem(STORAGE_KEYS.PREMIUM_EXPIRES_AT);
    }
  };

  const value: AppContextType = {
    theme,
    setTheme,
    language,
    setLanguage,
    audioEnabled,
    setAudioEnabled,
    session,
    setSelectedMood,
    incrementMessageCount,
    resetMessageCount,
    setPremium,
    isLoading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}

export function useTranslation() {
  const { language } = useAppContext();
  const translations = require('./i18n').translations;
  
  return {
    t: (key: string): string => {
      const keys = key.split('.');
      let value: any = translations[language];
      
      for (const k of keys) {
        value = value?.[k];
      }
      
      return value || key;
    },
    language,
  };
}
