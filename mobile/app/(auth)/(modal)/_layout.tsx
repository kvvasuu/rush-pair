import { Stack } from "expo-router";

export const unstable_settings = {
  anchor: "(modal)",
};

export default function AuthLayoutModal() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        presentation: "transparentModal",
      }}
    >
      <Stack.Screen name="sign-up" />
      <Stack.Screen name="(login)" />
    </Stack>
  );
}
