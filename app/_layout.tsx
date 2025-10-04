import { Slot } from "expo-router";
import { ReactNode } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "../context/AuthContext";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <SafeAreaProvider style={{ flex: 1 }}>
    
        <Slot />
      </SafeAreaProvider>
    </AuthProvider>
  );
}
