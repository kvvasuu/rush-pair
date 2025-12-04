import * as Haptics from "expo-haptics";
import { ReactNode, useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  TextInputProps,
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
import useFontSize from "@/hooks/useFontSize";
import { PlatformPressable } from "@react-navigation/elements";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  icon?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
};

export default function BasicTextInput({
  value,
  onChangeText,
  icon,
  disabled,
  ...props
}: Props & TextInputProps) {
  const theme = useAppTheme();
  const { lg } = useFontSize();

  const isPassword = props.secureTextEntry;

  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={[styles.wrapper, { borderColor: Colors[theme].border }]}>
      {icon && (
        <Ionicons
          name={icon}
          size={26}
          color={Colors[theme].icon}
          style={styles.icon}
        />
      )}

      <TextInput
        editable={!disabled}
        numberOfLines={1}
        maxLength={40}
        placeholderTextColor={Colors[theme].icon}
        onChangeText={(text) => onChangeText(text)}
        value={value}
        style={[
          styles.textInput,
          {
            backgroundColor: Colors[theme].backgroundAlt,
            color: Colors[theme].text,
            paddingLeft: icon ? 52 : 16,
            fontFamily: "Montserrat",
            fontSize: lg,
            lineHeight: lg + 4,
          },
        ]}
        {...props}
        secureTextEntry={isPassword && !showPassword}
      />

      {isPassword && (
        <PlatformPressable
          hitSlop={6}
          style={styles.passwordIcon}
          onPressIn={() => {
            if (Platform.OS === "ios") {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
            setShowPassword((prev) => !prev);
          }}
        >
          <Ionicons
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            size={26}
            color={Colors[theme].icon}
          />
        </PlatformPressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    width: "100%",
    height: 60,
    borderRadius: 14,
    borderWidth: 2,
    overflow: "hidden",
  },
  textInput: {
    width: "100%",
    height: "100%",
    padding: 16,
    paddingVertical: 0,
  },
  icon: {
    position: "absolute",
    top: 14,
    left: 14,
    zIndex: 10,
  },
  passwordIcon: {
    position: "absolute",
    top: 14,
    right: 14,
    zIndex: 10,
  },
});
