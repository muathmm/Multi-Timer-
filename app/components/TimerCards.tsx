import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";
import { Timer, useTimers } from "../../context/TimerContext";
import NotificationService from "../src/services/NotificationService";

type Props = {
  timer: Timer;
  now: number;
  onStart: () => void;
  onPause: () => void;
  onDelete: () => void;
  onRepeat?: () => void;
  isDarkMode?: boolean;
};

export default function TimerCard({ timer, now, onStart, onPause, onDelete, onRepeat, isDarkMode }: Props) {
  const { completeTimer } = useTimers()!;
  const darkMode = isDarkMode ?? false;

  if (!timer) return null;

  let remaining = timer.remaining;
  if (timer.status === "running" && timer.endTime) {
    remaining = Math.max(0, Math.ceil((timer.endTime - now) / 1000));
  }

  const progress = timer.duration > 0 ? remaining / timer.duration : 0;

  const size = 120;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const animatedValue = useRef(new Animated.Value(progress)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress,
      duration: 500,
      useNativeDriver: false,
    }).start();

    if (remaining === 0 && timer.status === "running") {
      NotificationService.localImmediate(`${timer.label} has ended.`);
      completeTimer(timer.id); 
    }
  }, [progress, remaining, timer.status]);

  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  const strokeColor =
    remaining > timer.duration * 0.5
      ? "#4ADE80"
      : remaining > timer.duration * 0.2
      ? "#FACC15"
      : "#F87171";

  const formatTime = (s: number) => {
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${m}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const scale = useRef(new Animated.Value(1)).current;
  const handlePressIn = () => Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start();
  const handlePressOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();

  return (
    <Animated.View
      style={[
        styles.card,
        {
          backgroundColor: darkMode ? "rgba(31, 41, 55, 0.85)" : "rgba(243, 244, 246, 0.85)",
          borderWidth: 1,
          borderColor: darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
        },
        { transform: [{ scale }] },
        timer.status === "completed" && { opacity: 0.8 },
      ]}
    >
      <TouchableOpacity activeOpacity={1} onPressIn={handlePressIn} onPressOut={handlePressOut}>
        <Text style={[styles.label, { color: darkMode ? "#FCD34D" : "#2563EB" }]}>{timer.label}</Text>
        <Text style={[styles.subLabel, { color: darkMode ? "#D1D5DB" : "#374151" }]}>
          Added: {new Date(timer.createdAt).toLocaleDateString()} {new Date(timer.createdAt).toLocaleTimeString()}
        </Text>

        <View style={styles.timerWrapper}>
          <Svg width={size} height={size}>
            <Defs>
              <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor="#3B82F6" />
                <Stop offset="100%" stopColor={strokeColor} />
              </LinearGradient>
            </Defs>
            <Circle
              stroke={darkMode ? "#374151" : "#D1D5DB"}
              fill="none"
              cx={size / 2}
              cy={size / 2}
              r={radius}
              strokeWidth={strokeWidth}
            />
            <AnimatedCircle
              stroke="url(#grad)"
              fill="none"
              cx={size / 2}
              cy={size / 2}
              r={radius}
              strokeWidth={strokeWidth}
              strokeDasharray={`${circumference}, ${circumference}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </Svg>
          <View style={styles.timeOverlay}>
            <Text style={[styles.time, { color: darkMode ? "#FFF" : "#111" }]}>{formatTime(remaining)}</Text>
          </View>
        </View>

        <View style={styles.buttonsRow}>
          {timer.status === "paused" && (
            <TouchableOpacity style={[styles.iconBtn, { backgroundColor: "#22C55E" }]} onPress={onStart}>
              <MaterialIcons name="play-arrow" size={28} color="#fff" />
            </TouchableOpacity>
          )}
          {timer.status === "running" && (
            <TouchableOpacity style={[styles.iconBtn, { backgroundColor: "#F59E0B" }]} onPress={onPause}>
              <MaterialIcons name="pause" size={28} color="#fff" />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={[styles.iconBtn, { backgroundColor: "#EF4444" }]} onPress={onDelete}>
            <MaterialIcons name="delete" size={28} color="#fff" />
          </TouchableOpacity>

          
          {timer.status === "completed" && (
            <TouchableOpacity style={[styles.iconBtn, { backgroundColor: "#3B82F6" }]} onPress={onRepeat}>
              <FontAwesome5 name="redo" size={24} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const styles = StyleSheet.create({
  card: { padding: 20, borderRadius: 28, margin: 12, shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 12, elevation: 8, alignItems: "center" },
  label: { fontSize: 20, fontWeight: "700", marginBottom: 4, textAlign: "center" },
  subLabel: { fontSize: 12, marginBottom: 12, textAlign: "center" },
  timerWrapper: { justifyContent: "center", alignItems: "center", marginVertical: 16, position: "relative" },
  timeOverlay: { position: "absolute", justifyContent: "center", alignItems: "center" },
  time: { fontSize: 24, fontWeight: "700" },
  buttonsRow: { flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 16, width: "100%", gap: 12 },
  iconBtn: { width: 52, height: 52, borderRadius: 26, alignItems: "center", justifyContent: "center", elevation: 4 },
});
