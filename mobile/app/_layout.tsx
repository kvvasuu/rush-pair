import { useMainStore } from "@/stores/mainStore";
import { Colors } from "@/utils/theme";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import useAppTheme from "../hooks/useAppTheme";
import i18n from "@/locales/i18n";
import { checkForUpdate } from "@/utils/utils";
import * as Notifications from "expo-notifications";
import { Alert, Platform } from "react-native";
import useInternetWatcher from "@/hooks/useInternetWatcher";
import AsyncStorage from "@react-native-async-storage/async-storage";

SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
  duration: 500,
  fade: true,
});

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const hydrated = useMainStore.persist.hasHydrated();

  const language = useMainStore((state) => state.language);
  const loading = useMainStore((state) => state.loading);
  const error = useMainStore((state) => state.error);

  const [ready, setReady] = useState(false);

  const theme = useAppTheme();

  useInternetWatcher();

  useEffect(() => {
    if (!hydrated || loading) return;

    i18n.locale = language;

    // const load = async () => {
    //   try {
    //     if (
    //       !lastUpdated ||
    //       Date.now() - lastUpdated > 1000 * 60 * 60 * 6 ||
    //       products.length <= 0
    //     ) {
    //       await fetchProducts();
    //     }
    //   } finally {
    //     setReady(true);
    //   }
    // };

    // load();
  }, [hydrated]);

  useEffect(() => {
    if (ready) {
      setTimeout(async () => {
        await SplashScreen?.hideAsync();

        await checkForUpdate();
      }, 1000);
    }
  }, [ready]);

  useEffect(() => {
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        console.warn("Brak uprawnień do wysyłania powiadomień");
      }
    })();

    async function setupNotifications() {
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.DEFAULT,
        });
      }
    }
    setupNotifications();
  }, []);

  if (!ready) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <Stack
        key={i18n.locale}
        screenOptions={{
          contentStyle: {
            flex: 1,
            backgroundColor: Colors[theme].background,
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* <Stack.Screen
          name="product/[id]"
          options={{
            presentation: "card",
            title: "Product",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="view3d"
          options={{
            presentation: "card",
            headerShown: false,
          }}
        /> */}
        <Stack.Screen
          name="(account)"
          options={{ presentation: "card", headerShown: false }}
        />
      </Stack>
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
    </SafeAreaProvider>
  );
}
