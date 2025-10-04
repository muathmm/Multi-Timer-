import * as Notifications from "expo-notifications";
import React, { useEffect } from "react";
import { Platform } from "react-native";
import 'react-native-get-random-values';
import { SafeAreaView } from "react-native-safe-area-context";
import { TimerProvider } from "../../context/TimerContext";
import TimersScreen from "../screens/timer";
import NotificationService from "../src/services/NotificationService";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function TimerScreen() {
  useEffect(() => {
    (async () => {
      await NotificationService.requestPermissionsAsync();
      if (Platform.OS === "android") {
        NotificationService.createAndroidChannel?.();
      }
    })();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TimerProvider>
        <TimersScreen />
      </TimerProvider>
    </SafeAreaView>
  );
}
