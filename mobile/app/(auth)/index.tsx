import SimpleButton from "@/components/SimpleButton";
import useAppTheme from "@/hooks/useAppTheme";
import useFontSize from "@/hooks/useFontSize";
import i18n from "@/locales/i18n";
import { Colors } from "@/utils/theme";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AuthScreen() {
  const insets = useSafeAreaInsets();
  const { xl } = useFontSize();
  const theme = useAppTheme();

  return (
    <LinearGradient
      colors={Colors[theme].gradient}
      locations={[0, 0.87]}
      start={{ x: 0.5, y: 1 }}
      end={{ x: 1, y: 0 }}
      style={styles.background}
    >
      <View style={[styles.container, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }]}>
        <Image style={styles.logo} source={require("../../assets/images/logo.png")} contentFit="contain" />
        <View style={styles.buttonsContainer}>
          <SimpleButton
            style={{
              backgroundColor: Colors.light.yellow,
              borderColor: Colors.light.yellow,
              padding: 16,
            }}
            onPress={() => router.push("/(auth)/sign-up")}
          >
            <Text
              style={{
                color: Colors.light.text,
                fontSize: xl,
                lineHeight: xl + 4,
                fontFamily: "MontserratBold",
              }}
            >
              {i18n.t("welcomeScreen.createAccount")}
            </Text>
          </SimpleButton>
          <SimpleButton
            transparent
            style={{
              borderColor: Colors.light.backgroundAlt,
              padding: 16,
            }}
            onPress={() => router.push("/(auth)/(login)")}
          >
            <Text
              style={{
                color: Colors.light.backgroundAlt,
                fontSize: xl,
                lineHeight: xl + 4,
                fontFamily: "MontserratBold",
              }}
            >
              {i18n.t("welcomeScreen.login")}
            </Text>
          </SimpleButton>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    height: "100%",
    width: "100%",
  },
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 80,
    padding: 24,
  },
  logo: {
    width: "100%",
    height: 200,
  },
  buttonsContainer: {
    width: "100%",
    gap: 20,
    justifyContent: "flex-end",
  },
});
