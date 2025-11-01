import useAuthStore from "@/store/auth.store";
import * as Sentry from '@sentry/react-native';
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "./globals.css";
import Toast from 'react-native-toast-message';

Sentry.init({
  dsn: 'https://d54c9e14c289eaadc25a968f1e249c1d@o4510271656296448.ingest.us.sentry.io/4510273287749632',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

SplashScreen.preventAutoHideAsync();

export default Sentry.wrap(function RootLayout() {
  const { isLoading, fetchAuthenticatedUser, hasHydrated } = useAuthStore()
  const [fontsLoaded, error] = useFonts({
    "QuickSand-Bold": require("../assets/fonts/Quicksand-Bold.ttf"),
    "QuickSand-Light": require("../assets/fonts/Quicksand-Light.ttf"),
    "QuickSand-Medium": require("../assets/fonts/Quicksand-Medium.ttf"),
    "QuickSand-SemiBold": require("../assets/fonts/Quicksand-SemiBold.ttf"),
    "QuickSand-Regular": require("../assets/fonts/Quicksand-Regular.ttf"),
  });

  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  useEffect(() => {
    if (hasHydrated) {
      fetchAuthenticatedUser()
    }
  }, [hasHydrated, fetchAuthenticatedUser])

  // Fallback: if hydration hasn't completed after 2 seconds, mark as hydrated
  // This prevents infinite loading if the hydration callback fails
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!hasHydrated) {
        console.log("⚠️ Hydration timeout - forcing hasHydrated to true");
        useAuthStore.setState({ hasHydrated: true });
      }
    }, 2000);

    return () => clearTimeout(timeout);
  }, [hasHydrated])

  // Only wait for fonts to load, not for auth state
  // Individual route layouts will handle auth loading/redirects
  if (!fontsLoaded) {
    return (
      <SafeAreaProvider>
        <View className="flex-1 items-center justify-center bg-white">
          <ActivityIndicator size="large" color="#fe8c00" />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar translucent backgroundColor="transparent" style="dark" />
      <Stack screenOptions={{ headerShown: false }} />
      <Toast />
    </SafeAreaProvider>
  );
});