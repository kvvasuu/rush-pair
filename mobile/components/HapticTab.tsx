import useAppTheme from "@/hooks/useAppTheme";
import { Colors } from "@/utils/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import type { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { PlatformPressable } from "@react-navigation/elements";
import * as Haptics from "expo-haptics";
import { ReactNode } from "react";
import { Platform, StyleSheet } from "react-native";

type OwnProps = {
  focused?: boolean;
  icon: string;
  children?: ReactNode;
};

type Props = OwnProps & Partial<BottomTabBarButtonProps>;

export function HapticTab({
  focused = false,
  icon,
  children,
  onPressIn,
  style,
  ...rest
}: Props) {
  const theme = useAppTheme();

  return (
    <PlatformPressable
      hitSlop={6}
      {...rest}
      style={[styles.hapticTab, style]}
      onPressIn={(ev) => {
        if (Platform.OS === "ios") {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        onPressIn?.(ev);
      }}
    >
      {children ?? (
        <Ionicons
          name={
            (focused
              ? icon
              : `${icon}-outline`) as keyof typeof Ionicons.glyphMap
          }
          size={28}
          color={focused ? Colors[theme].tabIconSelected : Colors[theme].text}
        />
      )}
    </PlatformPressable>
  );
}

const styles = StyleSheet.create({
  hapticTab: {
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 100,
  },
});
