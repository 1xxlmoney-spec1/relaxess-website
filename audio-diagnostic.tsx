/**
 * TEMPORARY Audio Diagnostic Screen
 * 
 * Direct AudioManager testing - bypasses all layers
 * Purpose: Verify S3 audio file loading and playback
 */

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import { ScrollView, Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
import { AudioManager } from "@/lib/_core/audio-manager";

interface DiagnosticReport {
  timestamp: string;
  action: string;
  fileLoaded: boolean;
  playbackStarted: boolean;
  loadingError: string | null;
  networkError: string | null;
  decodingError: string | null;
  audioElementState: string;
  audioManagerState: {
    currentTrack: string | null;
    isPlaying: boolean;
  };
}

export default function AudioDiagnosticScreen() {
  const colors = useColors();
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<DiagnosticReport | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const audioManager = AudioManager.getInstance();
  const webAudioRef = useRef<HTMLAudioElement | null>(null);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, `[${timestamp}] ${message}`]);
  };

  const playGentleBreathingTest = async () => {
    setIsLoading(true);
    setLogs([]);
    addLog("Starting Gentle Breathing Test...");

    const testUrl = "https://calmspace-audio.s3.us-east-1.amazonaws.com/gentle-breathing.mp3";
    const report: DiagnosticReport = {
      timestamp: new Date().toISOString(),
      action: "play",
      fileLoaded: false,
      playbackStarted: false,
      loadingError: null,
      networkError: null,
      decodingError: null,
      audioElementState: "initial",
      audioManagerState: {
        currentTrack: null,
        isPlaying: false,
      },
    };

    try {
      addLog(`Testing URL: ${testUrl}`);
      addLog("Creating audio element...");

      // Create test audio element
      const audioElement = new Audio();
      webAudioRef.current = audioElement;

      // Track events
      audioElement.addEventListener("loadstart", () => {
        addLog("✓ Event: loadstart");
        report.audioElementState = "loadstart";
      });

      audioElement.addEventListener("progress", () => {
        addLog("✓ Event: progress (data loading)");
      });

      audioElement.addEventListener("canplay", () => {
        addLog("✓ Event: canplay");
        report.fileLoaded = true;
        report.audioElementState = "canplay";
      });

      audioElement.addEventListener("play", () => {
        addLog("✓ Event: play (playback started)");
        report.playbackStarted = true;
        report.audioElementState = "playing";
      });

      audioElement.addEventListener("playing", () => {
        addLog("✓ Event: playing");
      });

      audioElement.addEventListener("error", (e) => {
        const error = audioElement.error;
        let errorMsg = "Unknown error";
        if (error) {
          switch (error.code) {
            case error.MEDIA_ERR_ABORTED:
              errorMsg = "MEDIA_ERR_ABORTED - Playback aborted";
              report.decodingError = errorMsg;
              break;
            case error.MEDIA_ERR_NETWORK:
              errorMsg = "MEDIA_ERR_NETWORK - Network error";
              report.networkError = errorMsg;
              break;
            case error.MEDIA_ERR_DECODE:
              errorMsg = "MEDIA_ERR_DECODE - Decoding error";
              report.decodingError = errorMsg;
              break;
            case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
              errorMsg = "MEDIA_ERR_SRC_NOT_SUPPORTED - Format not supported";
              report.decodingError = errorMsg;
              break;
          }
        }
        addLog(`✗ Event: error - ${errorMsg}`);
        report.audioElementState = "error";
      });

      audioElement.addEventListener("abort", () => {
        addLog("✗ Event: abort");
        report.audioElementState = "aborted";
      });

      audioElement.addEventListener("suspend", () => {
        addLog("⚠ Event: suspend");
      });

      // Set source and attempt playback
      addLog("Setting audio source...");
      audioElement.src = testUrl;
      audioElement.crossOrigin = "anonymous";
      audioElement.loop = false;
      audioElement.volume = 0.5;

      addLog("Calling play()...");
      const playPromise = audioElement.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            addLog("✓ play() promise resolved - playback started");
            report.playbackStarted = true;
          })
          .catch((error) => {
            addLog(`✗ play() promise rejected: ${error.message}`);
            report.decodingError = error.message;
          });
      }

      // Wait 2 seconds to capture state
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Capture final state
      report.audioManagerState = {
        currentTrack: audioManager.getCurrentTrack(),
        isPlaying: audioManager.getIsPlaying(),
      };

      addLog(`Audio element readyState: ${audioElement.readyState}`);
      addLog(`Audio element networkState: ${audioElement.networkState}`);
      addLog(`Audio element paused: ${audioElement.paused}`);
      addLog(`Audio element duration: ${audioElement.duration}`);
      addLog(`Audio element currentTime: ${audioElement.currentTime}`);

      setReport(report);
      addLog("Test complete!");
    } catch (error: any) {
      addLog(`✗ Exception: ${error.message}`);
      report.loadingError = error.message;
      setReport(report);
    } finally {
      setIsLoading(false);
    }
  };

  const stopPlayback = () => {
    if (webAudioRef.current) {
      webAudioRef.current.pause();
      webAudioRef.current.src = "";
      webAudioRef.current = null;
      addLog("Playback stopped");
    }
  };

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="gap-4">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-2xl font-bold text-foreground">Audio Diagnostic</Text>
            <Text className="text-sm text-muted">
              Direct AudioManager testing - bypasses all layers
            </Text>
          </View>

          {/* Test Button */}
          <TouchableOpacity
            onPress={playGentleBreathingTest}
            disabled={isLoading}
            className={cn(
              "p-4 rounded-lg items-center justify-center",
              isLoading ? "bg-muted/50" : "bg-primary"
            )}
          >
            {isLoading ? (
              <View className="flex-row items-center gap-2">
                <ActivityIndicator color={colors.background} />
                <Text className="text-base font-semibold text-background">Testing...</Text>
              </View>
            ) : (
              <Text className="text-base font-semibold text-background">
                Play Gentle Breathing Test
              </Text>
            )}
          </TouchableOpacity>

          {/* Stop Button */}
          {report && (
            <TouchableOpacity
              onPress={stopPlayback}
              className="p-4 rounded-lg items-center justify-center bg-error/20 border border-error"
            >
              <Text className="text-base font-semibold text-error">Stop Playback</Text>
            </TouchableOpacity>
          )}

          {/* Report */}
          {report && (
            <View className="bg-surface border border-border rounded-lg p-4 gap-3">
              <Text className="text-lg font-bold text-foreground">Test Report</Text>

              <View className="gap-2">
                <View className="flex-row justify-between">
                  <Text className="text-sm text-muted">File Loaded:</Text>
                  <Text
                    className={cn(
                      "text-sm font-semibold",
                      report.fileLoaded ? "text-success" : "text-error"
                    )}
                  >
                    {report.fileLoaded ? "✓ YES" : "✗ NO"}
                  </Text>
                </View>

                <View className="flex-row justify-between">
                  <Text className="text-sm text-muted">Playback Started:</Text>
                  <Text
                    className={cn(
                      "text-sm font-semibold",
                      report.playbackStarted ? "text-success" : "text-error"
                    )}
                  >
                    {report.playbackStarted ? "✓ YES" : "✗ NO"}
                  </Text>
                </View>

                {report.loadingError && (
                  <View className="gap-1">
                    <Text className="text-sm text-error font-semibold">Loading Error:</Text>
                    <Text className="text-xs text-error bg-error/10 p-2 rounded">
                      {report.loadingError}
                    </Text>
                  </View>
                )}

                {report.networkError && (
                  <View className="gap-1">
                    <Text className="text-sm text-error font-semibold">Network Error:</Text>
                    <Text className="text-xs text-error bg-error/10 p-2 rounded">
                      {report.networkError}
                    </Text>
                  </View>
                )}

                {report.decodingError && (
                  <View className="gap-1">
                    <Text className="text-sm text-error font-semibold">Decoding Error:</Text>
                    <Text className="text-xs text-error bg-error/10 p-2 rounded">
                      {report.decodingError}
                    </Text>
                  </View>
                )}

                <View className="gap-1 mt-2">
                  <Text className="text-sm text-muted font-semibold">Audio Element State:</Text>
                  <Text className="text-xs text-foreground bg-background p-2 rounded">
                    {report.audioElementState}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Logs */}
          {logs.length > 0 && (
            <View className="bg-background border border-border rounded-lg p-3 gap-2">
              <Text className="text-sm font-bold text-foreground">Diagnostic Logs</Text>
              <ScrollView className="max-h-64">
                {logs.map((log, idx) => (
                  <Text key={idx} className="text-xs text-muted font-mono mb-1">
                    {log}
                  </Text>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
