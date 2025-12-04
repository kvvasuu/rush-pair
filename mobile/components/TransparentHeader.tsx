import useAppTheme from "@/hooks/useAppTheme";
import useFontSize from "@/hooks/useFontSize";
import { Colors } from "@/utils/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  title?: string;
};

export default function TransparentHeader({ title }: Props) {
  const router = useRouter();
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const { lg } = useFontSize();

  return (
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
          if (router.canGoBack()) router.back();
        }}
        style={({ pressed }) => [
          styles.backButton,
          { top: insets.top + 6, backgroundColor: Colors[theme].backgroundAlt },
          pressed && { opacity: 0.6 },
        ]}
        hitSlop={16}
      >
        <Ionicons name="arrow-back" size={20} color={Colors[theme].text} />
      </Pressable>

      {title && (
        <View
          style={[
            styles.titleContainer,
            { backgroundColor: Colors[theme].backgroundAlt },
          ]}
        >
          <Text
            style={[
              styles.title,
              {
                color: Colors[theme].text,
                fontSize: lg,
                fontFamily: "Montserrat-SemiBold",
              },
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    width: "100%",
    left: 0,
    top: 0,
    zIndex: 50,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  titleContainer: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 100,
    elevation: 1,
    shadowColor: "#000000",
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    maxWidth: "65%",
  },
  title: {
    textAlign: "center",
  },
  backButton: {
    position: "absolute",
    left: 16,
    padding: 14,
    borderRadius: 100,
    elevation: 1,
    shadowColor: "#000000",
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
});
