
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React, { useEffect, useState } from "react";
import { Appearance, useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { TimerProvider } from "../../context/TimerContext";

export default function TabsLayout() {
  const systemColorScheme = useColorScheme(); 
  const [theme, setTheme] = useState<"light" | "dark">(systemColorScheme || "light");


  useEffect(() => {
    const listener = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(colorScheme === "dark" ? "dark" : "light");
    });

    return () => listener.remove();
  }, []);

  const isDark = theme === "dark";

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: isDark ? "#0F172A" : "#F8FAFC" }}>
      <TimerProvider>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: isDark ? "#1E293B" : "#FFF",
              borderTopColor: isDark ? "#111" : "#E5E7EB",
            },
            tabBarActiveTintColor: isDark ? "#FACC15" : "#3B82F6",
            tabBarInactiveTintColor: isDark ? "#9CA3AF" : "#6B7280",
          }}
        >
          <Tabs.Screen
            name="index" 
            options={{
              title: "Timer",
              tabBarIcon: ({ color, size }) => <Ionicons name="timer" color={color} size={size} />,
            }}
          />
   
        </Tabs>
      </TimerProvider>
    </GestureHandlerRootView>
  );
}
