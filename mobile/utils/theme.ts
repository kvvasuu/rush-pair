import { Platform } from "react-native";

const tintColor = "#e94548";

export const Colors = {
  light: {
    text: "#525252",
    background: "#e2e8f0",
    backgroundAlt: "#f5f5f5",
    tint: tintColor,
    icon: "#687076",
    tabIconDefault: "#737373",
    tabIconSelected: tintColor,
    border: "#e5e5e5",
  },
  dark: {
    text: "#a1a1a1",
    background: "#171717",
    backgroundAlt: "#262626",
    tint: tintColor,
    icon: "#687076",
    tabIconDefault: "#737373",
    tabIconSelected: tintColor,
    border: "#404040",
  },
};

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
