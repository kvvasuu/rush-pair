/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

const tintColor = "#ee003a";

export const Colors = {
  light: {
    text: "#525252",
    tint: tintColor,
    icon: "#687076",
    tabIconDefault: "#737373",
    tabIconSelected: tintColor,
  },
  dark: {
    text: "#a1a1a1",
    tint: tintColor,
    icon: "#687076",
    tabIconDefault: "#737373",
    tabIconSelected: tintColor,
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
