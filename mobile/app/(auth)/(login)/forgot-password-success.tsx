import DismissKeyboardView from "@/components/DismissKeyboardView";
import SimpleButton from "@/components/SimpleButton";
import TransparentHeader from "@/components/TransparentHeader";
import useAppTheme from "@/hooks/useAppTheme";
import useFontSize from "@/hooks/useFontSize";
import i18n from "@/locales/i18n";
import { Colors } from "@/utils/theme";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ForgotPasswordSuccess() {
  const theme = useAppTheme();
  const { lg, xl, xxxxl } = useFontSize();
  const router = useRouter();

  return (
    <>
      <TransparentHeader backButton={false} />
      <SafeAreaView edges={["top", "bottom"]} style={{ flex: 1, backgroundColor: Colors[theme].background }}>
        <DismissKeyboardView
          style={[
            styles.container,
            {
              paddingTop: 64,
              paddingBottom: 8,
              backgroundColor: Colors[theme].background,
            },
          ]}
        >
          <View style={styles.header}>
            <Image
              source={require("../../../assets/images/logo_sygnet.png")}
              style={styles.logo}
              contentFit="contain"
            ></Image>
            <View style={{ gap: 8 }}>
              <Text
                style={{
                  fontFamily: "MontserratBold",
                  fontSize: xxxxl,
                  textAlign: "center",
                  lineHeight: xxxxl + 4,
                  color: Colors[theme].text,
                }}
              >
                {i18n.t("welcomeScreen.resetPasswordSuccess")}
              </Text>
            </View>
          </View>
          <View style={styles.content}>
            <Ionicons name="mail-unread-outline" size={72} color={Colors[theme].text} />
            <Text
              style={{
                fontFamily: "MontserratSemiBold",
                textAlign: "center",
                fontSize: lg,
                lineHeight: lg + 8,
                color: Colors[theme].text,
              }}
            >
              {i18n.t("welcomeScreen.resetPasswordLinkSent")}
            </Text>
            <View style={styles.buttonsContainer}>
              <SimpleButton
                style={{
                  backgroundColor: "transparent",
                  borderWidth: 0,
                }}
                onPress={() => {
                  router.replace("/(auth)/(login)");
                }}
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
                    {i18n.t("general.back")}
                  </Text>
                </LinearGradient>
              </SimpleButton>
            </View>
          </View>
        </DismissKeyboardView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    gap: 40,
    padding: 24,
    backgroundColor: Colors.light.background,
  },
  header: { width: "100%", paddingHorizontal: 24, gap: 20 },
  logo: {
    aspectRatio: "auto",
    height: 64,
  },
  content: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    gap: 48,
  },
  buttonsContainer: {
    width: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 32,
  },
});
