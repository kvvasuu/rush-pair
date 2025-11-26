import { Stack } from "expo-router";

export default function AuthLayoutModal() {
  return (
    <Stack
      screenOptions={{
        presentation: "modal",
        animation: "slide_from_bottom",
        headerShown: false,
      }}
    >
      <Stack.Screen name="sign-up" options={{ headerShown: false }} />
      <Stack.Screen name="(login)" options={{ headerShown: false }} />
    </Stack>
  );
}
