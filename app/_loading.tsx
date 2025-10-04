
"use client";

import { useEffect, useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { AuthContext } from "@/context/AuthContext";


export default function SplashScreen() {
  const router = useRouter();
  const { isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoggedIn) {
        router.replace("/tabs");
      } else {
        router.replace("/login"); 
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [isLoggedIn]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 24, fontWeight: "bold" },
});
