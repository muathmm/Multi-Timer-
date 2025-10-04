"use client";

import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useContext, useRef, useState } from "react";
import { Animated, Dimensions, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AuthContext } from "../context/AuthContext";

const { width, height } = Dimensions.get("window");

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const radius = 130; 

  const logoX = useRef(new Animated.Value(width / 2 - 90)).current;
  const logoY = useRef(new Animated.Value(height / 2 - 90)).current;

  const moveLogoRandomly = () => {
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * radius;
    const centerX = width / 2 - 90;
    const centerY = height / 2 - 90;

    const newX = centerX + distance * Math.cos(angle);
    const newY = centerY + distance * Math.sin(angle);

    Animated.spring(logoX, { toValue: newX, useNativeDriver: false, bounciness: 12 }).start();
    Animated.spring(logoY, { toValue: newY, useNativeDriver: false, bounciness: 12 }).start();
  };

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      login();
      setStatusMessage("Login Successful ✅");
      setTimeout(() => router.replace("/tabs"), 1000);
    }, 1500);
  };

  return (
    <LinearGradient
      colors={['#1E3A8A', '#2563EB', '#3B82F6']}
      start={[0, 0]}
      end={[1, 1]}
      style={styles.container}
    >
     
      <LottieView
        source={require("../assets/animations/logo-animation.json")}
        autoPlay
        loop
        style={[ { width: width * 1.2, height: height * 1.2 }]}
      />

      <Text style={styles.title}>Multi Timer ⏱</Text>
      <Text style={styles.subtitle}>Track your time efficiently</Text>

      <Pressable style={StyleSheet.absoluteFill} onPress={moveLogoRandomly}>
        <Animated.View
          style={[styles.logoContainer, { transform: [{ translateX: logoX }, { translateY: logoY }] }]}
        >
          <LottieView
            source={require("../assets/animations/Doctor and health symbols.json")}
            autoPlay
            loop
            style={styles.logo}
          />
        </Animated.View>
      </Pressable>

      {/* Login Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.googleButton} onPress={handleLogin} disabled={loading}>
          <Text style={styles.googleButtonText}>
            {loading ? "Signing In..." : "Sign in with Google"}
          </Text>
        </TouchableOpacity>

        {statusMessage ? <Text style={styles.status}>{statusMessage}</Text> : null}
        <Text style={styles.copyright}>© 2025 Alshamel Company</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  title: {
    position: "absolute",
    top: 60,
    fontSize: 36,
    fontWeight: "bold",
    color: "#FFF",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
  },
  subtitle: {
    position: "absolute",
    top: 110,
    fontSize: 18,
    color: "#E0E7FF",
    fontWeight: "500",
  },
  logoContainer: {
    width: 180,
    height: 180,
 

  },
  logo: {
    width: 180,
    height: 180,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 60,
    width: "100%",
    alignItems: "center",
  },
  googleButton: {
    backgroundColor: "#4285F4",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 28,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  googleButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  status: {
    fontSize: 14,
    color: "#FFF",
    marginTop: 10,
  },
  copyright: {
    color: "#E0E7FF",
    fontSize: 12,
    marginTop: 14,
  },
  backgroundLottie: {
    position: "absolute",
    top: '50%',
    left: '50%',
    width: width,
    height: height,
    marginLeft: -width/2,
    marginTop: -height/2,
  },
});
