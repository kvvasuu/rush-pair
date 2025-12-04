import * as Haptics from "expo-haptics";
import { ReactNode } from "react";
import { Platform, Pressable, StyleSheet, ViewProps } from "react-native";
import { Colors } from "@/utils/theme";
import useAppTheme from "@/hooks/useAppTheme";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

type Props = {
  children: ReactNode;
  onPress: () => void;
  disabled?: boolean;
  transparent?: boolean;
};

export default function SimpleButton({
  children,
  onPress,
  style,
  disabled,
  transparent,
}: Props & ViewProps) {
  const theme = useAppTheme();

  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Pressable
      onPressIn={() => {
        scale.value = withSpring(0.98);
        opacity.value = withTiming(0.9, { duration: 150 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
        opacity.value = withTiming(1, { duration: 150 });
      }}
      onPress={() => {
        if (Platform.OS === "ios") {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        onPress?.();
      }}
      disabled={disabled}
      style={[
        transparent
          ? {}
          : {
              shadowColor: "#000",
              shadowOffset: { width: 1, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 2,
            },
        { opacity: disabled ? 0.6 : 1 },
      ]}
    >
      <Animated.View
        style={[
          styles.button,
          {
            // borderColor: Colors[theme].backgroundAlt,
            elevation: disabled || transparent ? 0 : 2,
          },
          style,
          animatedStyle,
        ]}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: 100,
    gap: 16,
    borderWidth: 2,
  },
});
