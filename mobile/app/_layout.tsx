import { useMainStore } from "@/stores/mainStore";
import { useFonts } from "expo-font";

import { Colors } from "@/utils/theme";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";

import i18n from "@/locales/i18n";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import useAppTheme from "../hooks/useAppTheme";
// import { checkForUpdate } from "@/utils/utils";
// import * as Notifications from "expo-notifications";
import useInternetWatcher from "@/hooks/useInternetWatcher";
import { useAuthStore } from "@/stores/authStore";

SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
  duration: 500,
  fade: true,
});

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldPlaySound: true,
//     shouldSetBadge: false,
//     shouldShowBanner: true,
//     shouldShowList: true,
//   }),
// });

export const unstable_settings = {
  anchor: "(app)",
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Montserrat: require("../assets/fonts/montserrat/Montserrat-Regular.ttf"),
    MontserratSemiBold: require("../assets/fonts/montserrat/Montserrat-SemiBold.ttf"),
    MontserratBold: require("../assets/fonts/montserrat/Montserrat-Bold.ttf"),
  });

  const hydrated = useAuthStore.persist.hasHydrated();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const token = useAuthStore((state) => state.token);
  const loggendIn = isLoggedIn && !!token;
  const language = useMainStore((state) => state.language);

  const [ready, setReady] = useState(false);

  const theme = useAppTheme();

  useInternetWatcher();

  useEffect(() => {
    if (!hydrated || !loaded) return;

    i18n.locale = language;

    setReady(true);
  }, [hydrated, loaded, loggendIn]);

  useEffect(() => {
    if (ready) {
      setTimeout(async () => {
        await SplashScreen?.hideAsync();

        // await checkForUpdate();
      }, 1000);
    }
  }, [ready]);

  // useEffect(() => {
  //   (async () => {
  //     const { status } = await Notifications.requestPermissionsAsync();
  //     if (status !== "granted") {
  //       console.warn("Brak uprawnień do wysyłania powiadomień");
  //     }
  //   })();

  //   async function setupNotifications() {
  //     if (Platform.OS === "android") {
  //       await Notifications.setNotificationChannelAsync("default", {
  //         name: "default",
  //         importance: Notifications.AndroidImportance.DEFAULT,
  //       });
  //     }
  //   }
  //   setupNotifications();
  // }, []);

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
          animation: "fade",
        }}
      >
        <Stack.Protected guard={loggendIn}>
          <Stack.Screen name="(app)" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Protected guard={!loggendIn}>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack.Protected>
      </Stack>
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
    </SafeAreaProvider>
  );
}
