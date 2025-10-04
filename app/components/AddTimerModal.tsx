import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    Easing,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  onAdd: (
    label: string,
    durationSec: number,
    options?: { autoStart?: boolean; repeat?: boolean }
  ) => void;
};

export default function AddTimerModal({ visible, onClose, onAdd }: Props) {
  const [label, setLabel] = useState("");
  const [time, setTime] = useState({ hours: 0, minutes: 0 });
  const [error, setError] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [pulseAnim] = useState(new Animated.Value(1));

  const labelInputRef = useRef<TextInput>(null);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1.0,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleAdd = () => {
    labelInputRef.current?.blur();

    if (!label.trim()) {
      setError("⚠️ Please enter a timer label!");
      return;
    }

    const now = new Date();
    const target = new Date();
    target.setHours(time.hours, time.minutes, 0, 0);

    if (target.getTime() <= now.getTime()) {
      target.setDate(target.getDate() + 1);
    }

    const durationSec = Math.floor((target.getTime() - now.getTime()) / 1000);

    setError("");
    onAdd(label, durationSec, { autoStart: true, repeat: false });
    resetFields();
    onClose();
  };

  const resetFields = () => {
    setLabel("");
    setTime({ hours: 0, minutes: 0 });
    setError("");
  };

  const handleClose = () => {
    labelInputRef.current?.blur();
    resetFields();
    onClose();
  };

  const onChangeTime = (event: any, selected?: Date) => {
    setShowPicker(false);
    if (selected) {
      setTime({ hours: selected.getHours(), minutes: selected.getMinutes() });
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <BlurView intensity={60} tint="dark" style={styles.blurBg}>
          <View style={styles.box}>
            <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
              <Ionicons name="close" size={26} color="#fff" />
            </TouchableOpacity>

            <Text style={styles.title}>⏱ Add New Timer</Text>

            {error.length > 0 && <Text style={styles.errorText}>{error}</Text>}

            <TextInput
              ref={labelInputRef}
              placeholder="Timer Label"
              placeholderTextColor="#aaa"
              style={styles.input}
              value={label}
              onChangeText={(text) => {
                if (error) setError("");
                setLabel(text);
              }}
            />

            <TouchableOpacity
              style={styles.timePickerBtn}
              onPress={() => setShowPicker(true)}
            >
              <Text style={styles.timeText}>
                {String(time.hours).padStart(2, "0")}:
                {String(time.minutes).padStart(2, "0")}
              </Text>
            </TouchableOpacity>

            {showPicker && (
              <DateTimePicker
                value={new Date()}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={onChangeTime}
              />
            )}

            <Animated.View
              style={{
                transform: [{ scale: pulseAnim }],
                alignSelf: "center",
                marginTop: 24,
              }}
            >
              <TouchableOpacity onPress={handleAdd}>
                <LinearGradient
                  colors={["#6EE7B7", "#3B82F6", "#9333EA"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.addBtn}
                >
                  <Ionicons name="time-outline" size={28} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </BlurView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  blurBg: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  box: {
    width: "85%",
    borderRadius: 20,
    padding: 22,
    backgroundColor: "rgba(30, 30, 46, 0.7)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  closeBtn: { position: "absolute", top: 14, right: 14 },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    marginBottom: 16,
  },
  errorText: {
    color: "#F87171",
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 12,
    borderRadius: 10,
    marginBottom: 14,
    color: "#fff",
  },
  timePickerBtn: {
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  timeText: { fontSize: 20, fontWeight: "600", color: "#fff" },
  addBtn: {
    padding: 18,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});
