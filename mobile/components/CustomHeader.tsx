import useAppTheme from "@/hooks/useAppTheme";
import { Colors } from "@/utils/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  title: string;
};

export default function CustomHeader({ title }: Props) {
  const router = useRouter();
  const theme = useAppTheme();

  return (
    <SafeAreaView edges={["top"]}>
      <View
        style={[
          styles.container,
          {
            paddingTop: 10,
            backgroundColor: Colors[theme].backgroundAlt,
            borderBottomColor: Colors[theme].border,
          },
        ]}
      >
        <Pressable
          onPress={() => {
            if (router.canGoBack()) router.back();
          }}
          style={({ pressed }) => [styles.backButton, { top: 6 }, pressed && { opacity: 0.6 }]}
          hitSlop={16}
        >
          <Ionicons name="chevron-back" size={32} color={Colors[theme].icon} />
        </Pressable>

        <Text style={[styles.title, { color: Colors[theme].text }]} numberOfLines={1}>
          {title}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
    borderBottomWidth: 0.5,
    position: "relative",
  },
  title: {
    fontSize: 18,
    fontWeight: 600,
    textAlign: "center",
  },
  backButton: {
    position: "absolute",
    left: 12,
    zIndex: 2,
  },
});
