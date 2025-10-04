import React, { useEffect, useRef } from "react";
import { Animated, Easing, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function TipModal({ visible, tip, onClose }: any) {
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (visible) {
    
      Animated.parallel([
        Animated.timing(scaleAnim, { toValue: 1, duration: 400, useNativeDriver: true, easing: Easing.out(Easing.ease) }),
        Animated.timing(opacityAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]).start();

     
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.05, duration: 800, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        ])
      ).start();
    } else {
  
      Animated.parallel([
        Animated.timing(scaleAnim, { toValue: 0.5, duration: 200, useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  if (!tip) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <Animated.View style={[styles.box, { transform: [{ scale: scaleAnim }], opacity: opacityAnim }]}>
          <Animated.Image source={tip.img} style={[styles.image, { transform: [{ scale: pulseAnim }] }]} />
          <Text style={styles.title}>
            {tip.title} {tip.emoji || "💡"}
          </Text>
          <Text style={styles.text}>{tip.full}</Text>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>✖ Close</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  box: {
    backgroundColor: "#1E293B",
    borderRadius: 20,
    padding: 20,
    width: "85%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
    borderWidth: 1,
    borderColor: "#334155",
  },
  image: {
    width: "100%",
    height: 160,
    borderRadius: 12,
    marginBottom: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#FACC15", 
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 15,
    color: "#E5E7EB",
  },
  closeBtn: {
    backgroundColor: "#6366F1", 
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  closeText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
