import { useMainStore } from "@/stores/mainStore";
import { useColorScheme } from "react-native";

export default function useAppTheme() {
  const theme = useMainStore((state) => state.theme);
  const systemTheme = useColorScheme(); // 'light' lub 'dark'

  return theme === "system" ? systemTheme ?? "light" : theme;
}
