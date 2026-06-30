import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useTranslation, useAppContext } from '@/lib/app-context';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

type QuietStage = 'intro' | 'breathing' | 'listening' | 'present' | 'complete';

const SESSION_DURATION = 300000; // 5 minutes
const STAGES: QuietStage[] = ['intro', 'breathing', 'listening', 'present', 'complete'];

export default function QuietRelaxationScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { incrementMessageCount } = useAppContext();
  const [currentStage, setCurrentStage] = useState<QuietStage>('intro');
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(SESSION_DURATION);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1000) {
          setIsPlaying(false);
          setCurrentStage('complete');
          incrementMessageCount();
          if (Platform.OS !== 'web') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, incrementMessageCount]);

  useEffect(() => {
    const newProgress = ((SESSION_DURATION - timeRemaining) / SESSION_DURATION) * 100;
    setProgress(newProgress);

    // Change stage based on time
    if (isPlaying) {
      if (timeRemaining > 225000) {
        setCurrentStage('breathing');
      } else if (timeRemaining > 150000) {
        setCurrentStage('listening');
      } else if (timeRemaining > 75000) {
        setCurrentStage('present');
      }
    }
  }, [timeRemaining, isPlaying]);

  const handleStart = () => {
    setIsPlaying(true);
    setCurrentStage('breathing');
    setTimeRemaining(SESSION_DURATION);
    setProgress(0);
    incrementMessageCount();
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleResume = () => {
    setIsPlaying(true);
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleRepeat = () => {
    setCurrentStage('intro');
    setIsPlaying(false);
    setTimeRemaining(SESSION_DURATION);
    setProgress(0);
    handleStart();
  };

  const handleDone = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getStageIcon = () => {
    switch (currentStage) {
      case 'breathing':
        return '🌬️';
      case 'listening':
        return '👂';
      case 'present':
        return '🧘';
      case 'complete':
        return '✨';
      default:
        return '🤫';
    }
  };

  const getStageText = () => {
    switch (currentStage) {
      case 'breathing':
        return t('quiet.breathe');
      case 'listening':
        return t('quiet.listen');
      case 'present':
        return t('quiet.present');
      case 'complete':
        return t('quiet.completionTitle');
      default:
        return t('quiet.instruction');
    }
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="px-6 pb-20 flex-1 justify-center">
          {/* Header */}
          <View className="mb-12 items-center">
            <Text className="text-4xl font-bold text-foreground mb-2">
              {t('quiet.title')}
            </Text>
            <Text className="text-lg text-muted text-center">
              {t('quiet.subtitle')}
            </Text>
          </View>

          {/* Progress Bar */}
          {isPlaying && (
            <View className="mb-8 h-1 bg-border rounded-full overflow-hidden">
              <View
                className="h-full bg-primary rounded-full"
                style={{ width: `${progress}%` }}
              />
            </View>
          )}

          {/* Main Content */}
          <View className="mb-12 p-8 rounded-3xl bg-surface border border-border items-center">
            {currentStage === 'intro' ? (
              <View className="gap-4 items-center">
                <Text className="text-6xl mb-4">🤫</Text>
                <Text className="text-xl font-semibold text-foreground text-center mb-4">
                  {t('quiet.instruction')}
                </Text>
                <Text className="text-sm text-muted text-center">
                  {t('quiet.description')}
                </Text>
              </View>
            ) : currentStage === 'complete' ? (
              <View className="gap-4 items-center">
                <Text className="text-6xl mb-4">✨</Text>
                <Text className="text-2xl font-bold text-foreground text-center mb-2">
                  {t('quiet.completionTitle')}
                </Text>
                <Text className="text-lg text-muted text-center">
                  {t('quiet.completionMessage')}
                </Text>
              </View>
            ) : (
              <View className="gap-4 items-center">
                <Text className="text-6xl mb-4">{getStageIcon()}</Text>
                <Text className="text-2xl font-semibold text-foreground text-center">
                  {getStageText()}
                </Text>
                {isPlaying && (
                  <Text className="text-3xl font-bold text-primary mt-4">
                    {formatTime(timeRemaining)}
                  </Text>
                )}
              </View>
            )}
          </View>

          {/* Controls */}
          <View className="gap-3">
            {!isPlaying && currentStage === 'intro' ? (
              <Pressable
                onPress={handleStart}
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.8 : 1,
                    transform: [{ scale: pressed ? 0.97 : 1 }],
                  },
                ]}
              >
                <View className="py-4 px-6 rounded-2xl bg-primary items-center">
                  <Text className="text-lg font-bold text-background">
                    {t('common.start')}
                  </Text>
                </View>
              </Pressable>
            ) : isPlaying ? (
              <Pressable
                onPress={handlePause}
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.8 : 1,
                    transform: [{ scale: pressed ? 0.97 : 1 }],
                  },
                ]}
              >
                <View className="py-4 px-6 rounded-2xl bg-primary items-center">
                  <Text className="text-lg font-bold text-background">
                    {t('common.pause')}
                  </Text>
                </View>
              </Pressable>
            ) : !isPlaying && currentStage !== 'intro' && currentStage !== 'complete' ? (
              <Pressable
                onPress={handleResume}
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.8 : 1,
                    transform: [{ scale: pressed ? 0.97 : 1 }],
                  },
                ]}
              >
                <View className="py-4 px-6 rounded-2xl bg-primary items-center">
                  <Text className="text-lg font-bold text-background">
                    {t('common.resume')}
                  </Text>
                </View>
              </Pressable>
            ) : null}

            {currentStage === 'complete' ? (
              <View className="gap-3">
                <Pressable
                  onPress={handleRepeat}
                  style={({ pressed }) => [
                    {
                      opacity: pressed ? 0.8 : 1,
                      transform: [{ scale: pressed ? 0.97 : 1 }],
                    },
                  ]}
                >
                  <View className="py-4 px-6 rounded-2xl bg-primary items-center">
                    <Text className="text-lg font-bold text-background">
                      {t('quiet.repeatSession')}
                    </Text>
                  </View>
                </Pressable>
                <Pressable
                  onPress={handleDone}
                  style={({ pressed }) => [
                    {
                      opacity: pressed ? 0.8 : 1,
                      transform: [{ scale: pressed ? 0.97 : 1 }],
                    },
                  ]}
                >
                  <View className="py-4 px-6 rounded-2xl bg-surface border border-primary items-center">
                    <Text className="text-lg font-bold text-primary">
                      {t('quiet.done')}
                    </Text>
                  </View>
                </Pressable>
              </View>
            ) : null}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
