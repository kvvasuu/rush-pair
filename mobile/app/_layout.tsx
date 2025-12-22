import i18n from "@/locales/i18n";
import { useMainStore } from "@/stores/mainStore";
import { Colors } from "@/utils/theme";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import useAppTheme from "../hooks/useAppTheme";
// import { checkForUpdate } from "@/utils/utils";
// import * as Notifications from "expo-notifications";
import useInternetWatcher from "@/hooks/useInternetWatcher";
import { useAuthStore } from "@/stores/authStore";
import { useUserStore } from "@/stores/userStore";
import { socket } from "@/utils/utils";
import { AppState } from "react-native";
import { KeyboardProvider } from "react-native-keyboard-controller";

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
  const authStatus = useAuthStore((state) => state.authStatus);
  const verifyToken = useAuthStore((state) => state.verifyToken);
  const token = useAuthStore((state) => state.token);
  const language = useMainStore((state) => state.language);

  const [ready, setReady] = useState(false);

  const theme = useAppTheme();

  useInternetWatcher();

  useEffect(() => {
    if (!hydrated || !loaded) return;

    verifyToken(true);
  }, [hydrated, loaded, token]);

  useEffect(() => {
    i18n.locale = language;
  }, [language]);

  useEffect(() => {
    const connectSocket = () => {
      socket.connect();
      socket.emit("login", useUserStore.getState()._id);
      useUserStore.getState().bindSocketEvents();
    };

    const disconnectSocket = () => {
      socket.emit("logout");
      useUserStore.getState().removeSocketEvents();
      socket.disconnect();
    };

    const onAppActive = async () => {
      const now = Date.now();
      const last = useAuthStore.getState().lastVerifiedAt;

      if (last && now - last < 5 * 60 * 1000) {
        connectSocket();
        return;
      }

      try {
        await verifyToken();
        useAuthStore.setState({ lastVerifiedAt: now });
        connectSocket();
      } catch {
        useAuthStore.getState().logout();
        disconnectSocket();
      }
    };

    if (authStatus === "authenticated") {
      onAppActive();
    }

    if (authStatus === "unauthenticated") {
      disconnectSocket();
    }

    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active" && authStatus === "authenticated") {
        onAppActive();
      }

      if (state === "background") {
        disconnectSocket();
      }
    });

    if (authStatus !== "unknown") {
      setReady(true);
    }

    return () => {
      sub.remove();
      disconnectSocket();
    };
  }, [authStatus]);

  useEffect(() => {
    if (ready) {
      setTimeout(async () => {
        await SplashScreen?.hideAsync();

        // await checkForUpdate();
      }, 1000);
    }
  }, [ready]);

  if (!ready) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <KeyboardProvider>
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
          <Stack.Protected guard={authStatus === "authenticated"}>
            <Stack.Screen name="(app)" options={{ headerShown: false }} />
          </Stack.Protected>
          <Stack.Protected guard={authStatus === "unauthenticated"}>
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          </Stack.Protected>
        </Stack>
        <StatusBar style={theme === "dark" ? "light" : "dark"} />
      </KeyboardProvider>
    </SafeAreaProvider>
  );
}
