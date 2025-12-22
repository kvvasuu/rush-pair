import useAppTheme from "@/hooks/useAppTheme";
import useFontSize from "@/hooks/useFontSize";
import { Colors } from "@/utils/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { PlatformPressable } from "@react-navigation/elements";
import React, { createContext, useContext, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

type SelectItem = { value: string; label: string };

const SelectContext = createContext<{
  selectedItem: SelectItem;
  onSelect: (value: SelectItem) => void;
}>({
  selectedItem: { value: "", label: "" },
  onSelect: () => {},
});

type Props = {
  onConfirm: (value: string) => void;
  placeholder?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  style?: ViewStyle;
  title?: string;
  children: React.ReactNode;
};

export default function Select({ onConfirm, placeholder, children, icon, title, style }: Props) {
  const theme = useAppTheme();
  const { lg } = useFontSize();

  const [showSelect, setShowSelect] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SelectItem>({ value: "", label: "" });

  return (
    <>
      <PlatformPressable
        style={[styles.wrapper, { borderColor: Colors[theme].border }, style]}
        hitSlop={2}
        onPress={() => {
          setShowSelect((prev) => !prev);
        }}
      >
        {icon && <Ionicons name={icon} size={26} color={Colors[theme].icon} style={styles.icon} />}
        <View
          style={[
            styles.selectedItem,
            {
              backgroundColor: Colors[theme].backgroundAlt,
              paddingLeft: 52,
            },
          ]}
        >
          <Text
            style={{
              color: selectedItem.value ? Colors[theme].text : Colors[theme].icon,
              fontFamily: "Montserrat",
              fontSize: lg,
              lineHeight: lg + 4,
            }}
          >
            {selectedItem.label || placeholder}
          </Text>
        </View>
      </PlatformPressable>

      {showSelect && (
        <Modal transparent animationType="slide" style={{ flex: 1, ...StyleSheet.absoluteFillObject }}>
          <SafeAreaProvider>
            <SafeAreaView edges={["top", "bottom"]} style={{ flex: 1, backgroundColor: Colors[theme].background }}>
              <View
                style={[
                  styles.header,
                  {
                    paddingTop: 10,
                  },
                ]}
              >
                <Pressable
                  onPress={() => {
                    setShowSelect(false);
                  }}
                  style={({ pressed }) => [
                    styles.headerButton,
                    {
                      backgroundColor: Colors[theme].backgroundAlt,
                    },
                    pressed && { opacity: 0.6 },
                  ]}
                  hitSlop={12}
                >
                  <Ionicons name="close" size={20} color={Colors[theme].text} />
                </Pressable>

                {title && (
                  <Text
                    style={{
                      color: Colors[theme].text,
                      fontSize: lg,
                      fontFamily: "MontserratSemiBold",
                      textAlign: "center",
                    }}
                    numberOfLines={1}
                  >
                    {title}
                  </Text>
                )}

                <Pressable
                  onPress={() => {
                    onConfirm(selectedItem.value);
                    setShowSelect(false);
                  }}
                  style={({ pressed }) => [
                    styles.headerButton,
                    {
                      backgroundColor: Colors[theme].tint,
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
                  paddingTop: 32,
                  paddingBottom: 8,
                  gap: 16,
                }}
              >
                <SelectContext value={{ selectedItem: selectedItem, onSelect: setSelectedItem }}>
                  <View
                    style={{
                      width: "100%",
                      padding: 12,
                      backgroundColor: Colors[theme].backgroundAlt,
                      borderRadius: 16,
                    }}
                  >
                    {React.Children.map(children, (child, index) => {
                      if (!React.isValidElement(child)) return child;

                      const isLast = index === React.Children.count(children) - 1;

                      return (
                        <View key={index}>
                          {child}
                          {!isLast && (
                            <View
                              style={{
                                height: StyleSheet.hairlineWidth,
                                backgroundColor: Colors[theme].border,
                                marginVertical: 6,
                              }}
                            />
                          )}
                        </View>
                      );
                    })}
                  </View>
                </SelectContext>
              </View>
            </SafeAreaView>
          </SafeAreaProvider>
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
  selectedItem: {
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  headerButton: {
    padding: 14,
    borderRadius: 100,
    elevation: 1,
    shadowColor: "#000000",
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
});

type ItemProps = {
  label: string;
  value: string;
  icon?: keyof typeof Ionicons.glyphMap;
};

Select.Item = ({ label, value, icon }: ItemProps) => {
  const ctx = useContext(SelectContext);
  const theme = useAppTheme();
  const { base } = useFontSize();
  const selected = value === ctx.selectedItem.value;

  if (!ctx) return null;

  return (
    <Pressable style={itemStyles.wrapper} onPress={() => ctx.onSelect({ value, label })}>
      <View style={itemStyles.label}>
        {/* {icon && <Ionicons name={icon} size={26} color={Colors[theme].icon} />} */}

        <Text
          style={[
            { fontSize: base, lineHeight: base + 4, color: Colors[theme].text },
            selected ? { fontFamily: "MontserratSemiBold" } : { fontFamily: "Montserrat" },
          ]}
        >
          {label}
        </Text>
      </View>
      {selected && (
        <Ionicons
          name="checkmark-sharp"
          size={24}
          color={Colors[theme].tint}
          style={{ position: "absolute", right: 0 }}
        />
      )}
    </Pressable>
  );
};

const itemStyles = StyleSheet.create({
  wrapper: {
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
});
