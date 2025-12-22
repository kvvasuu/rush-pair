import { useEffect, useRef } from "react";
import * as Network from "expo-network";
import { Alert } from "react-native";

export default function useInternetWatcher() {
  const lastStatus = useRef(true); // żeby unikać wielokrotnych alertów

  useEffect(() => {
    const subscription = Network.addNetworkStateListener((state) => {
      // 1) ignoruj stan "nie wiem jeszcze"
      if (state.isInternetReachable === null) return;

      const isOnline = state.isConnected && state.isInternetReachable;

      // 2) pokaz alert tylko przy przejściu: online -> offline
      if (!isOnline && lastStatus.current === true) {
        Alert.alert(
          "Brak połączenia",
          "Wygląda na to, że nie masz połączenia z internetem."
        );
      }

      lastStatus.current = !!isOnline;
    });

    return () => subscription.remove();
  }, []);
}
