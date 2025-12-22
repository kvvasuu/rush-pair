import SimpleButton from "@/components/SimpleButton";
import useAppTheme from "@/hooks/useAppTheme";
import useFontSize from "@/hooks/useFontSize";
import i18n from "@/locales/i18n";
import { useAuthStore } from "@/stores/authStore";
import { Colors } from "@/utils/theme";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";

export default function AccountScreen() {
  const theme = useAppTheme();
  const logout = useAuthStore((state) => state.logout);
  const { sm, base, xl, xxxxl } = useFontSize();

  return (
    <View style={styles.titleContainer}>
      <SimpleButton
        style={{
          backgroundColor: "transparent",
          borderWidth: 0,
        }}
        onPress={logout}
      >
        <LinearGradient
          colors={Colors[theme].gradient}
          locations={[0, 0.87]}
          start={{ x: 0.54, y: 1.4 }}
          end={{ x: 0.6, y: 0 }}
          style={[
            {
              width: "100%",
              alignItems: "center",
              padding: 16,
            },
          ]}
        >
          <Text
            style={{
              color: theme === "light" ? Colors.light.backgroundAlt : Colors.dark.text,
              fontSize: xl,
              lineHeight: xl + 4,
              fontFamily: "MontserratBold",
            }}
          >
            {i18n.t("general.logout")}
          </Text>
        </LinearGradient>
      </SimpleButton>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
});
