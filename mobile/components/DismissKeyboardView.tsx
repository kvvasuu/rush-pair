import React, { ReactNode } from "react";
import { TouchableWithoutFeedback, Keyboard, View } from "react-native";

/**
 * Wrapper, który zamyka klawiaturę po kliknięciu poza TextInput
 * Użycie: owinąć cały ekran / formularz
 */
export default function DismissKeyboardView({
  children,
  style,
}: {
  children: ReactNode;
  style?: object;
}) {
  return (
    <TouchableWithoutFeedback
      onPress={Keyboard.dismiss}
      accessible={false} // ignoruje accessibility focus
    >
      <View style={style}>{children}</View>
    </TouchableWithoutFeedback>
  );
}
