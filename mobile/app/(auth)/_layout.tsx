import i18n from "@/locales/i18n";
import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="(login)"
        options={{
          presentation: "card",
          title: i18n.t("auth.login.title"),
        }}
      />
      <Stack.Screen
        name="sign-up"
        options={{
          presentation: "card",
          title: i18n.t("auth.signup.title"),
        }}
      />
    </Stack>
  );
}
