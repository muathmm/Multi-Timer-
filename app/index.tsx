"use client";

import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useContext, useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";
import { AuthContext } from "../context/AuthContext";

export default function SplashScreen() {
  const { isLoggedIn } = useContext(AuthContext);
  const router = useRouter();
  const [animationFinished, setAnimationFinished] = useState(false);
  const [typedText, setTypedText] = useState("");

  const fullText = "Welcome to Multi Timer ⏱";
  const pulse = useSharedValue(1);


  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, index + 1));
      index++;
      if (index === fullText.length) clearInterval(interval);
    }, 80); 
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1.1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));


  useEffect(() => {
    if (animationFinished) {
      setTimeout(() => {
        router.replace(isLoggedIn ? "/tabs" : "/login");
      }, 500);
    }
  }, [animationFinished]);

  return (
    <View style={styles.container}>
    
      <View style={styles.backgroundOverlay} />

 
      <Animated.View style={[styles.iconWrapper, pulseStyle]}>
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.appIcon}
        />
      </Animated.View>

    
      <LottieView
        source={require("../assets/animations/Doctor.json")}
        autoPlay
        loop={false}
        onAnimationFinish={() => setAnimationFinished(true)}
        style={styles.lottie}
      />

 
      <Text style={styles.subtitle}>{typedText}</Text>


      <Text style={styles.footer}>© 2025 Alshamel Company</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#0F172A",

  },
  iconWrapper: {
    marginBottom: 20,
  },
  appIcon: {
    width: 120,
    height: 120,
    borderRadius: 60, // دائري
    borderWidth: 4,
    borderColor: "#FACC15",
  },
  lottie: {
    width: 220,
    height: 220,
    marginBottom: 20,
  },
  subtitle: {
    color: "#FBBF24",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: 1,
    textShadowColor: "rgba(255, 255, 255, 0.4)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    fontSize: 14,
    color: "#555",
  },
});
