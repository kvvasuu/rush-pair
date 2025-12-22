import { useUserStore } from "@/stores/userStore";
import { Stack } from "expo-router";
import "react-native-reanimated";

export default function AppLayout() {
  const firstVisit = useUserStore((state) => state.firstVisit);

  return (
    <Stack
      screenOptions={{
        animation: "fade",
        headerShown: false,
      }}
    >
      <Stack.Protected guard={firstVisit}>
        <Stack.Screen name="(first-steps)" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={!firstVisit}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}
