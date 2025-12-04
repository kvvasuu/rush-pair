import { Platform } from "react-native";

const tintColor = "#e94548";

export const Colors = {
  light: {
    text: "#222424",
    background: "#e2e8f0",
    backgroundAlt: "#f5f5f5",
    tint: tintColor,
    icon: "#687076",
    tabIconDefault: "#737373",
    tabIconSelected: tintColor,
    border: "#e5e5e5",
    yellow: "#fcc800",
    gradient: ["#7b4397", "#e94548"],
  },
  dark: {
    text: "#b5b5b5",
    background: "#171717",
    backgroundAlt: "#1e1e1e",
    tint: tintColor,
    icon: "#687076",
    tabIconDefault: "#737373",
    tabIconSelected: tintColor,
    border: "#404040",
    yellow: "#efb100",
    gradient: ["#552e69", "#b03335"],
  },
} as const;

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
});
