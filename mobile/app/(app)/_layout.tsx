import { HapticTab } from "@/components/HapticTab";
import { Colors } from "@/utils/theme";
import { Tabs, usePathname, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useAppTheme from "@/hooks/useAppTheme";

export default function TabLayout() {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathName = usePathname();

  const [focusedTab, setFocusedTab] = useState<
    "index" | "games" | "pairs" | "account"
  >("index");

  useEffect(() => {
    if (pathName.includes("/pairs")) setFocusedTab("pairs");
    else if (pathName.includes("/games")) setFocusedTab("games");
    else if (pathName.includes("/account")) setFocusedTab("account");
    else if (pathName === "/") setFocusedTab("index");
  }, [pathName]);

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarStyle: { display: "none" },
          headerShown: false,
          tabBarShowLabel: false,
          sceneStyle: { backgroundColor: Colors[theme].background },
        }}
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen name="pairs" />
        <Tabs.Screen name="games" />
        <Tabs.Screen name="account" />
      </Tabs>

      <View
        style={[
          styles.tabBar,
          {
            bottom: insets.bottom,
            backgroundColor: Colors[theme].backgroundAlt,
            borderColor: Colors[theme].border,
          },
        ]}
      >
        <HapticTab
          onPress={() => {
            router.push("/");
          }}
          focused={focusedTab === "index"}
          icon="home"
        />

        <HapticTab
          onPress={() => {
            router.push("/(app)/pairs");
          }}
          focused={focusedTab === "pairs"}
          icon="chatbubbles"
        />

        <HapticTab
          onPress={() => {
            router.push("/(app)/games");
          }}
          focused={focusedTab === "games"}
          icon="game-controller"
        />

        <HapticTab
          onPress={() => {
            router.push("/(app)/account");
          }}
          focused={focusedTab === "account"}
          icon="person"
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    overflow: "hidden",
    alignSelf: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 100,
    gap: 16,
    position: "absolute",
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 0.5,
  },
});
