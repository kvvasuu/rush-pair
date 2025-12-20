import useAppTheme from "@/hooks/useAppTheme";
import useFontSize from "@/hooks/useFontSize";
import i18n from "@/locales/i18n";
import { Colors } from "@/utils/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker, { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { PlatformPressable } from "@react-navigation/elements";
import * as Haptics from "expo-haptics";
import { useState } from "react";
import { Modal, Platform, Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  onConfirm: (date: Date) => void;
  disabled?: boolean;
  style?: ViewStyle;
};

export default function DatePicker({ onConfirm, disabled, style, ...props }: Props) {
  const theme = useAppTheme();
  const { base, lg } = useFontSize();
  const insets = useSafeAreaInsets();

  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const today = new Date();

  return (
    <>
      <PlatformPressable
        style={[styles.wrapper, { borderColor: Colors[theme].border }, style]}
        hitSlop={2}
        onPressIn={() => {
          if (Platform.OS === "ios") {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
        }}
        onPress={() => {
          if (Platform.OS === "ios") {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setShowPicker((prev) => !prev);
          } else {
            DateTimePickerAndroid.open({
              mode: "date",
              value: date,
              maximumDate: new Date(new Date(new Date()).setFullYear(today.getFullYear() - 16)),
              minimumDate: new Date(1950, 1, 1),
              onChange: (_event, date) => date && setDate(date),
              design: "material",
            });
          }
        }}
      >
        <Ionicons name="calendar" size={26} color={Colors[theme].icon} style={styles.icon} />
        <View
          style={[
            styles.dateDisplay,
            {
              backgroundColor: Colors[theme].backgroundAlt,
              paddingLeft: 52,
            },
          ]}
        >
          <Text
            style={{
              color: date.getDay() === new Date().getDay() ? Colors[theme].icon : Colors[theme].text,
              fontFamily: "Montserrat",
              fontSize: lg,
              lineHeight: lg + 4,
            }}
          >
            {date.toLocaleDateString("pl-PL", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </Text>
        </View>
      </PlatformPressable>

      {showPicker && (
        <Modal transparent animationType="slide" style={{ flex: 1, ...StyleSheet.absoluteFillObject }}>
          <View
            style={[
              styles.header,
              {
                paddingTop: insets.top + 10,
              },
            ]}
          >
            <Pressable
              onPress={() => {
                setShowPicker(false);
              }}
              style={({ pressed }) => [
                styles.headerButton,
                {
                  top: insets.top + 6,
                  backgroundColor: Colors[theme].backgroundAlt,
                  left: 16,
                },
                pressed && { opacity: 0.6 },
              ]}
              hitSlop={12}
            >
              <Ionicons name="close" size={20} color={Colors[theme].text} />
            </Pressable>

            <Pressable
              onPress={() => {
                onConfirm(date);
                setShowPicker(false);
              }}
              style={({ pressed }) => [
                styles.headerButton,
                {
                  top: insets.top + 6,
                  backgroundColor: Colors[theme].tint,
                  right: 16,
                },
                pressed && { opacity: 0.6 },
              ]}
              hitSlop={12}
            >
              <Ionicons name="checkmark-sharp" size={20} color={Colors[theme].text} />
            </Pressable>
          </View>

          <View
            style={{
              flex: 1,
              alignItems: "center",
              padding: 24,
              backgroundColor: Colors[theme].background,
              paddingTop: insets.top + 32,
              paddingBottom: insets.bottom + 8,
              gap: 16,
            }}
          >
            <View
              style={{ width: "100%", padding: 16, backgroundColor: Colors[theme].backgroundAlt, borderRadius: 32 }}
            >
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={"date"}
                display="spinner"
                maximumDate={new Date(new Date(new Date()).setFullYear(today.getFullYear() - 16))}
                minimumDate={new Date(1950, 1, 1)}
                locale={i18n.locale}
                accentColor={Colors[theme].tint}
                onChange={(_event, date) => date && setDate(date)}
              />
            </View>

            <Text
              style={{
                fontFamily: "Montserrat",
                textAlign: "center",
                fontSize: base,
                lineHeight: base + 8,
                color: Colors[theme].icon,
              }}
            >
              {i18n.t("firstSteps.atLeast16")}
            </Text>
          </View>
        </Modal>
      )}
    </>
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
  dateDisplay: {
    height: "100%",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  icon: {
    position: "absolute",
    top: 14,
    left: 14,
    zIndex: 10,
  },
  header: {
    width: "100%",
    left: 0,
    top: 0,
    zIndex: 50,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  headerButton: {
    position: "absolute",
    padding: 14,
    borderRadius: 100,
    elevation: 1,
    shadowColor: "#000000",
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
});
