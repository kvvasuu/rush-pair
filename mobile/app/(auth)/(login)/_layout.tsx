import { Stack } from "expo-router";

export default function LoginLayoutModal() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
      <Stack.Screen name="forgot-password-success" options={{ headerShown: false }} />
    </Stack>
  );
}
