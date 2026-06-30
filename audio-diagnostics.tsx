/**
 * AUDIO DIAGNOSTICS SCREEN
 * 
 * Purpose: Expose detailed audio diagnostics
 * Do NOT fix anything. Only diagnose.
 * 
 * Direct AudioManager.play() testing - no layers, no logic
 */

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import { ScrollView, Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
import { AudioManager } from "@/lib/_core/audio-manager";

const TEST_URL = "https://calmspace-audio.s3.us-east-1.amazonaws.com/gentle-breathing.mp3";

interface DiagnosticState {
  audioManagerInitialized: boolean;
  urlUsed: string;
  loadStarted: string | null;
  loadSuccess: boolean | null;
  playbackStarted: boolean | null;
  playbackStatus: "idle" | "loading" | "playing" | "paused" | "stopped" | "error";
  currentPosition: number;
  duration: number;
  networkError: string | null;
  decodeError: string | null;
  audioEngineError: string | null;
  currentTrack: string | null;
  isPlaying: boolean;
  lastAudioEvent: string | null;
  events: Array<{ timestamp: string; event: string }>;
}

export default function AudioDiagnosticsScreen() {
  const colors = useColors();
  const audioManager = AudioManager.getInstance();
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const updateIntervalRef = useRef<any>(null);

  const [diagnostics, setDiagnostics] = useState<DiagnosticState>({
    audioManagerInitialized: !!audioManager,
    urlUsed: TEST_URL,
    loadStarted: null,
    loadSuccess: null,
    playbackStarted: null,
    playbackStatus: "idle",
    currentPosition: 0,
    duration: 0,
    networkError: null,
    decodeError: null,
    audioEngineError: null,
    currentTrack: null,
    isPlaying: false,
    lastAudioEvent: null,
    events: [],
  });

  const addEvent = (eventName: string) => {
    const timestamp = new Date().toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      fractionalSecondDigits: 3,
    });

    setDiagnostics((prev) => ({
      ...prev,
      lastAudioEvent: eventName,
      events: [...prev.events, { timestamp, event: eventName }],
    }));
  };

  const playTestTrack = async () => {
    // Reset diagnostics
    setDiagnostics((prev) => ({
      ...prev,
      loadStarted: null,
      loadSuccess: null,
      playbackStarted: null,
      playbackStatus: "loading",
      currentPosition: 0,
      duration: 0,
      networkError: null,
      decodeError: null,
      audioEngineError: null,
      events: [],
    }));

    addEvent("play() called");

    try {
      // Record load start time
      const loadStartTime = new Date().toLocaleTimeString();
      setDiagnostics((prev) => ({
        ...prev,
        loadStarted: loadStartTime,
      }));
      addEvent(`Load started at ${loadStartTime}`);

      // Create audio element for diagnostics
      const audioElement = new Audio();
      audioElementRef.current = audioElement;

      // Track all events
      audioElement.addEventListener("loadstart", () => {
        addEvent("EVENT: loadstart");
      });

      audioElement.addEventListener("progress", () => {
        addEvent("EVENT: progress");
      });

      audioElement.addEventListener("suspend", () => {
        addEvent("EVENT: suspend");
      });

      audioElement.addEventListener("abort", () => {
        addEvent("EVENT: abort");
        setDiagnostics((prev) => ({
          ...prev,
          playbackStatus: "error",
          audioEngineError: "Audio playback aborted",
        }));
      });

      audioElement.addEventListener("error", () => {
        const error = audioElement.error;
        let errorMsg = "Unknown error";

        if (error) {
          switch (error.code) {
            case error.MEDIA_ERR_ABORTED:
              errorMsg = "MEDIA_ERR_ABORTED (1) - Playback aborted by user";
              break;
            case error.MEDIA_ERR_NETWORK:
              errorMsg = "MEDIA_ERR_NETWORK (2) - Network error";
              break;
            case error.MEDIA_ERR_DECODE:
              errorMsg = "MEDIA_ERR_DECODE (3) - Decoding error";
              break;
            case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
              errorMsg = "MEDIA_ERR_SRC_NOT_SUPPORTED (4) - Format not supported";
              break;
          }
        }

        addEvent(`EVENT: error - ${errorMsg}`);
        setDiagnostics((prev) => ({
          ...prev,
          playbackStatus: "error",
          loadSuccess: false,
          decodeError: errorMsg,
        }));
      });

      audioElement.addEventListener("emptied", () => {
        addEvent("EVENT: emptied");
      });

      audioElement.addEventListener("loadedmetadata", () => {
        addEvent("EVENT: loadedmetadata");
        setDiagnostics((prev) => ({
          ...prev,
          duration: audioElement.duration * 1000, // Convert to ms
        }));
      });

      audioElement.addEventListener("loadeddata", () => {
        addEvent("EVENT: loadeddata");
        setDiagnostics((prev) => ({
          ...prev,
          loadSuccess: true,
        }));
      });

      audioElement.addEventListener("canplay", () => {
        addEvent("EVENT: canplay");
      });

      audioElement.addEventListener("canplaythrough", () => {
        addEvent("EVENT: canplaythrough");
      });

      audioElement.addEventListener("playing", () => {
        addEvent("EVENT: playing");
        setDiagnostics((prev) => ({
          ...prev,
          playbackStatus: "playing",
          playbackStarted: true,
        }));
      });

      audioElement.addEventListener("pause", () => {
        addEvent("EVENT: pause");
        setDiagnostics((prev) => ({
          ...prev,
          playbackStatus: "paused",
        }));
      });

      audioElement.addEventListener("ended", () => {
        addEvent("EVENT: ended");
        setDiagnostics((prev) => ({
          ...prev,
          playbackStatus: "stopped",
        }));
      });

      audioElement.addEventListener("seeking", () => {
        addEvent("EVENT: seeking");
      });

      audioElement.addEventListener("seeked", () => {
        addEvent("EVENT: seeked");
      });

      audioElement.addEventListener("timeupdate", () => {
        setDiagnostics((prev) => ({
          ...prev,
          currentPosition: audioElement.currentTime * 1000, // Convert to ms
        }));
      });

      audioElement.addEventListener("durationchange", () => {
        addEvent("EVENT: durationchange");
        setDiagnostics((prev) => ({
          ...prev,
          duration: audioElement.duration * 1000,
        }));
      });

      audioElement.addEventListener("ratechange", () => {
        addEvent("EVENT: ratechange");
      });

      audioElement.addEventListener("volumechange", () => {
        addEvent("EVENT: volumechange");
      });

      // Configure audio element
      addEvent("Setting audio source");
      audioElement.src = TEST_URL;
      audioElement.crossOrigin = "anonymous";
      audioElement.preload = "auto";
      audioElement.volume = 0.5;

      addEvent("Calling play()");
      const playPromise = audioElement.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            addEvent("play() promise RESOLVED");
            setDiagnostics((prev) => ({
              ...prev,
              playbackStarted: true,
            }));
          })
          .catch((error: any) => {
            addEvent(`play() promise REJECTED: ${error.name} - ${error.message}`);
            setDiagnostics((prev) => ({
              ...prev,
              playbackStatus: "error",
              audioEngineError: `${error.name}: ${error.message}`,
              playbackStarted: false,
            }));
          });
      }

      // Start position update interval
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }

      updateIntervalRef.current = setInterval(() => {
        setDiagnostics((prev) => ({
          ...prev,
          currentTrack: audioManager.getCurrentTrack(),
          isPlaying: audioManager.getIsPlaying(),
          currentPosition: audioElement.currentTime * 1000,
          duration: audioElement.duration * 1000,
        }));
      }, 100);
    } catch (error: any) {
      addEvent(`EXCEPTION: ${error.message}`);
      setDiagnostics((prev) => ({
        ...prev,
        playbackStatus: "error",
        audioEngineError: error.message,
      }));
    }
  };

  const stopAudio = () => {
    addEvent("Stop button pressed");

    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current.src = "";
      audioElementRef.current = null;
      addEvent("Audio element stopped and cleared");
    }

    if (updateIntervalRef.current) {
      clearInterval(updateIntervalRef.current);
      updateIntervalRef.current = null;
    }

    setDiagnostics((prev) => ({
      ...prev,
      playbackStatus: "stopped",
      isPlaying: false,
    }));
  };

  useEffect(() => {
    return () => {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
      if (audioElementRef.current) {
        audioElementRef.current.pause();
      }
    };
  }, []);

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="gap-4">
          {/* Header */}
          <View className="gap-1">
            <Text className="text-2xl font-bold text-foreground">Audio Diagnostics</Text>
            <Text className="text-xs text-muted">Direct AudioManager testing - no layers</Text>
          </View>

          {/* Control Buttons */}
          <View className="gap-2">
            <TouchableOpacity
              onPress={playTestTrack}
              className="p-3 rounded-lg items-center justify-center bg-primary"
            >
              <Text className="text-base font-semibold text-background">Play Test Track</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={stopAudio}
              className="p-3 rounded-lg items-center justify-center bg-error/20 border border-error"
            >
              <Text className="text-base font-semibold text-error">Stop Audio</Text>
            </TouchableOpacity>
          </View>

          {/* Diagnostic Output Panel */}
          <View className="bg-surface border border-border rounded-lg p-3 gap-2">
            <Text className="text-lg font-bold text-foreground">Diagnostic Output</Text>

            {/* 1. AudioManager Initialized */}
            <View className="flex-row justify-between border-b border-border pb-2">
              <Text className="text-sm text-muted">1. AudioManager Initialized:</Text>
              <Text className={cn("text-sm font-semibold", diagnostics.audioManagerInitialized ? "text-success" : "text-error")}>
                {diagnostics.audioManagerInitialized ? "YES" : "NO"}
              </Text>
            </View>

            {/* 2. URL Used */}
            <View className="gap-1 border-b border-border pb-2">
              <Text className="text-sm text-muted">2. URL Used:</Text>
              <Text className="text-xs text-foreground break-words">{diagnostics.urlUsed}</Text>
            </View>

            {/* 3. Load Started */}
            <View className="flex-row justify-between border-b border-border pb-2">
              <Text className="text-sm text-muted">3. Load Started:</Text>
              <Text className="text-xs text-foreground">{diagnostics.loadStarted || "—"}</Text>
            </View>

            {/* 4. Load Success */}
            <View className="flex-row justify-between border-b border-border pb-2">
              <Text className="text-sm text-muted">4. Load Success:</Text>
              <Text
                className={cn(
                  "text-sm font-semibold",
                  diagnostics.loadSuccess === null
                    ? "text-muted"
                    : diagnostics.loadSuccess
                      ? "text-success"
                      : "text-error"
                )}
              >
                {diagnostics.loadSuccess === null ? "—" : diagnostics.loadSuccess ? "YES" : "NO"}
              </Text>
            </View>

            {/* 5. Playback Started */}
            <View className="flex-row justify-between border-b border-border pb-2">
              <Text className="text-sm text-muted">5. Playback Started:</Text>
              <Text
                className={cn(
                  "text-sm font-semibold",
                  diagnostics.playbackStarted === null
                    ? "text-muted"
                    : diagnostics.playbackStarted
                      ? "text-success"
                      : "text-error"
                )}
              >
                {diagnostics.playbackStarted === null ? "—" : diagnostics.playbackStarted ? "YES" : "NO"}
              </Text>
            </View>

            {/* 6. Playback Status */}
            <View className="flex-row justify-between border-b border-border pb-2">
              <Text className="text-sm text-muted">6. Playback Status:</Text>
              <Text
                className={cn(
                  "text-sm font-semibold",
                  diagnostics.playbackStatus === "playing"
                    ? "text-success"
                    : diagnostics.playbackStatus === "error"
                      ? "text-error"
                      : "text-muted"
                )}
              >
                {diagnostics.playbackStatus.charAt(0).toUpperCase() + diagnostics.playbackStatus.slice(1)}
              </Text>
            </View>

            {/* 7. Current Position */}
            <View className="flex-row justify-between border-b border-border pb-2">
              <Text className="text-sm text-muted">7. Current Position:</Text>
              <Text className="text-xs text-foreground">{Math.round(diagnostics.currentPosition)} ms</Text>
            </View>

            {/* 8. Duration */}
            <View className="flex-row justify-between border-b border-border pb-2">
              <Text className="text-sm text-muted">8. Duration:</Text>
              <Text className="text-xs text-foreground">
                {diagnostics.duration > 0 ? `${Math.round(diagnostics.duration)} ms` : "—"}
              </Text>
            </View>

            {/* 9. Network Error */}
            {diagnostics.networkError && (
              <View className="gap-1 border-b border-border pb-2">
                <Text className="text-sm text-error font-semibold">9. Network Error:</Text>
                <Text className="text-xs text-error bg-error/10 p-2 rounded">{diagnostics.networkError}</Text>
              </View>
            )}

            {/* 10. Decode Error */}
            {diagnostics.decodeError && (
              <View className="gap-1 border-b border-border pb-2">
                <Text className="text-sm text-error font-semibold">10. Decode Error:</Text>
                <Text className="text-xs text-error bg-error/10 p-2 rounded">{diagnostics.decodeError}</Text>
              </View>
            )}

            {/* 11. Audio Engine Error */}
            {diagnostics.audioEngineError && (
              <View className="gap-1 border-b border-border pb-2">
                <Text className="text-sm text-error font-semibold">11. Audio Engine Error:</Text>
                <Text className="text-xs text-error bg-error/10 p-2 rounded">{diagnostics.audioEngineError}</Text>
              </View>
            )}

            {/* 12. Current Track */}
            <View className="flex-row justify-between border-b border-border pb-2">
              <Text className="text-sm text-muted">12. Current Track:</Text>
              <Text className="text-xs text-foreground">{diagnostics.currentTrack || "null"}</Text>
            </View>

            {/* 13. isPlaying */}
            <View className="flex-row justify-between border-b border-border pb-2">
              <Text className="text-sm text-muted">13. isPlaying:</Text>
              <Text className={cn("text-sm font-semibold", diagnostics.isPlaying ? "text-success" : "text-muted")}>
                {diagnostics.isPlaying ? "true" : "false"}
              </Text>
            </View>

            {/* 14. Last Audio Event */}
            <View className="gap-1">
              <Text className="text-sm text-muted">14. Last Audio Event:</Text>
              <Text className="text-xs text-foreground">{diagnostics.lastAudioEvent || "—"}</Text>
            </View>
          </View>

          {/* Event Log */}
          {diagnostics.events.length > 0 && (
            <View className="bg-background border border-border rounded-lg p-3 gap-2">
              <Text className="text-lg font-bold text-foreground">Event Log ({diagnostics.events.length})</Text>
              <ScrollView className="max-h-96">
                {diagnostics.events.map((entry, idx) => (
                  <View key={idx} className="flex-row gap-2 mb-1 pb-1 border-b border-border/30">
                    <Text className="text-xs text-muted font-mono w-20">{entry.timestamp}</Text>
                    <Text className="text-xs text-foreground font-mono flex-1">{entry.event}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
