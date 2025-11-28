import * as Haptics from "expo-haptics";
import { ReactNode } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
  ViewProps,
} from "react-native";
import { Colors } from "@/utils/theme";
import useAppTheme from "@/hooks/useAppTheme";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import Ionicons from "@expo/vector-icons/Ionicons";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  icon?: ReactNode;
  disabled?: boolean;
};

export default function SimpleButton({
  value,
  onChangeText,
  icon,
  disabled,
  style,
}: Props & ViewProps) {
  const theme = useAppTheme();

  return (
    <View>
      <Ionicons />
      <TextInput
        numberOfLines={1}
        maxLength={40}
        onChangeText={(text) => onChangeText(text)}
        value={value}
        style={styles.textInput}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
  },
  textInput: {
    width: "100%",
    height: "100%",
  },
  icon: {},
});
