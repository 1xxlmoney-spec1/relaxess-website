/**
 * Developer Testing Panel
 * Hidden admin-only panel for QA testing of user states
 * Access: Tap the sun icon 5 times rapidly on the home screen
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  Platform,
} from 'react-native';
import { useAppContext } from './app-context';
import { useOpenAI } from './openai-context';
import { useColors } from '@/hooks/use-colors';
import { cn } from '@/lib/utils';
import * as Haptics from 'expo-haptics';

export interface DevTestingPanelProps {
  visible: boolean;
  onClose: () => void;
}

export function DevTestingPanel({ visible, onClose }: DevTestingPanelProps) {
  const { session, setPremium, resetMessageCount } = useAppContext();
  const { messageCount, dailyMessageLimit, messagesRemainingToday } = useOpenAI();
  const colors = useColors();
  const [testLog, setTestLog] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setTestLog((prev) => [`[${timestamp}] ${message}`, ...prev.slice(0, 19)]);
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleSetFreeMode = async () => {
    try {
      await setPremium(false);
      addLog('✓ Switched to FREE mode (10 messages/day)');
    } catch (error) {
      addLog('✗ Failed to set free mode');
    }
  };

  const handleSetPremiumMode = async () => {
    try {
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days
      await setPremium(true, expiresAt);
      addLog('✓ Switched to PREMIUM mode (unlimited messages, 30 days)');
    } catch (error) {
      addLog('✗ Failed to set premium mode');
    }
  };

  const handleResetMessageCounter = async () => {
    try {
      await resetMessageCount();
      addLog('✓ Message counter reset to 0');
    } catch (error) {
      addLog('✗ Failed to reset message counter');
    }
  };

  const handleSimulateExpiration = async () => {
    try {
      // Set expiration to yesterday
      const expiresAt = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      await setPremium(true, expiresAt);
      addLog('✓ Premium set to expire yesterday (will revert to free on app restart)');
    } catch (error) {
      addLog('✗ Failed to simulate expiration');
    }
  };

  const handleSimulateExpiredPremium = async () => {
    try {
      // Set premium to false with expired date
      await setPremium(false);
      addLog('✓ Reverted to FREE mode (simulating expired premium)');
    } catch (error) {
      addLog('✗ Failed to simulate expired premium');
    }
  };

  const handleClearTestLog = () => {
    setTestLog([]);
    addLog('✓ Test log cleared');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          paddingTop: 50,
        }}
      >
        {/* Header */}
        <View
          style={{
            paddingHorizontal: 16,
            paddingBottom: 16,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: 'bold',
              color: colors.foreground,
              marginBottom: 8,
            }}
          >
            🧪 Developer Testing Panel
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: colors.muted,
            }}
          >
            QA Testing Mode - User State Simulator
          </Text>
        </View>

        <ScrollView
          style={{ flex: 1, padding: 16 }}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {/* Current State Display */}
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 12,
              padding: 16,
              marginBottom: 20,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: '600',
                color: colors.foreground,
                marginBottom: 12,
              }}
            >
              Current User State
            </Text>
            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 12, color: colors.muted }}>
                Status: {session.isPremium ? '👑 PREMIUM' : '🆓 FREE'}
              </Text>
              <Text style={{ fontSize: 12, color: colors.muted }}>
                Messages Today: {messageCount} / {dailyMessageLimit}
              </Text>
              <Text style={{ fontSize: 12, color: colors.muted }}>
                Remaining: {messagesRemainingToday}
              </Text>
              {session.premiumExpiresAt && (
                <Text style={{ fontSize: 12, color: colors.muted }}>
                  Expires: {new Date(session.premiumExpiresAt).toLocaleDateString()}
                </Text>
              )}
            </View>
          </View>

          {/* User Mode Controls */}
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '600',
                color: colors.foreground,
                marginBottom: 12,
              }}
            >
              User Mode
            </Text>
            <TouchableOpacity
              onPress={handleSetFreeMode}
              style={{
                backgroundColor: colors.warning,
                borderRadius: 8,
                padding: 12,
                marginBottom: 8,
              }}
            >
              <Text
                style={{
                  color: colors.background,
                  fontWeight: '600',
                  textAlign: 'center',
                }}
              >
                Force FREE Mode (10 msg/day)
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSetPremiumMode}
              style={{
                backgroundColor: colors.success,
                borderRadius: 8,
                padding: 12,
              }}
            >
              <Text
                style={{
                  color: colors.background,
                  fontWeight: '600',
                  textAlign: 'center',
                }}
              >
                Force PREMIUM Mode (Unlimited)
              </Text>
            </TouchableOpacity>
          </View>

          {/* Message Counter Controls */}
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '600',
                color: colors.foreground,
                marginBottom: 12,
              }}
            >
              Message Counter
            </Text>
            <TouchableOpacity
              onPress={handleResetMessageCounter}
              style={{
                backgroundColor: colors.primary,
                borderRadius: 8,
                padding: 12,
              }}
            >
              <Text
                style={{
                  color: colors.background,
                  fontWeight: '600',
                  textAlign: 'center',
                }}
              >
                Reset Daily Counter to 0
              </Text>
            </TouchableOpacity>
          </View>

          {/* Subscription Expiration Simulation */}
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '600',
                color: colors.foreground,
                marginBottom: 12,
              }}
            >
              Subscription Simulation
            </Text>
            <TouchableOpacity
              onPress={handleSimulateExpiration}
              style={{
                backgroundColor: colors.error,
                borderRadius: 8,
                padding: 12,
                marginBottom: 8,
              }}
            >
              <Text
                style={{
                  color: colors.background,
                  fontWeight: '600',
                  textAlign: 'center',
                }}
              >
                Simulate Expired Premium
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSimulateExpiredPremium}
              style={{
                backgroundColor: colors.error,
                borderRadius: 8,
                padding: 12,
              }}
            >
              <Text
                style={{
                  color: colors.background,
                  fontWeight: '600',
                  textAlign: 'center',
                }}
              >
                Revert to Free (Expired)
              </Text>
            </TouchableOpacity>
          </View>

          {/* Test Log */}
          <View style={{ marginBottom: 20 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 12,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: colors.foreground,
                }}
              >
                Test Log
              </Text>
              <TouchableOpacity onPress={handleClearTestLog}>
                <Text
                  style={{
                    fontSize: 12,
                    color: colors.primary,
                    fontWeight: '600',
                  }}
                >
                  Clear
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                backgroundColor: colors.surface,
                borderRadius: 8,
                padding: 12,
                borderWidth: 1,
                borderColor: colors.border,
                maxHeight: 200,
              }}
            >
              {testLog.length === 0 ? (
                <Text style={{ color: colors.muted, fontSize: 12 }}>
                  No test actions yet...
                </Text>
              ) : (
                testLog.map((log, index) => (
                  <Text
                    key={index}
                    style={{
                      color: colors.muted,
                      fontSize: 11,
                      fontFamily: 'monospace',
                      marginBottom: index < testLog.length - 1 ? 4 : 0,
                    }}
                  >
                    {log}
                  </Text>
                ))
              )}
            </View>
          </View>

          {/* Info */}
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 8,
              padding: 12,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                color: colors.muted,
                lineHeight: 18,
              }}
            >
              This panel is for QA testing only. All changes are persisted to device storage. Changes take effect immediately except for subscription expiration, which requires app restart.
            </Text>
          </View>
        </ScrollView>

        {/* Close Button */}
        <TouchableOpacity
          onPress={onClose}
          style={{
            backgroundColor: colors.primary,
            marginHorizontal: 16,
            marginBottom: 20,
            borderRadius: 8,
            padding: 14,
          }}
        >
          <Text
            style={{
              color: colors.background,
              fontWeight: '600',
              textAlign: 'center',
              fontSize: 16,
            }}
          >
            Close Testing Panel
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}
