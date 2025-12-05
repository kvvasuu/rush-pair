import useAppTheme from "@/hooks/useAppTheme";
import { Colors } from "@/utils/theme";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useFontSize from "@/hooks/useFontSize";
import BasicTextInput from "@/components/BasicTextInput";
import { useState } from "react";
import SimpleButton from "@/components/SimpleButton";
import i18n from "@/locales/i18n";
import TransparentHeader from "@/components/TransparentHeader";
import { LinearGradient } from "expo-linear-gradient";
import DismissKeyboardView from "@/components/DismissKeyboardView";
import { Image } from "expo-image";

export default function LoginScreen() {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const { sm, base, xl, xxxxl } = useFontSize();
  const router = useRouter();

  const [login, setLogin] = useState("");
  const [pass, setPass] = useState("");
  const [conf, setConf] = useState("");

  return (
    <>
      <TransparentHeader />
      <DismissKeyboardView
        style={[
          styles.container,
          {
            paddingTop: insets.top + 64,
            paddingBottom: insets.bottom + 8,
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
                fontFamily: "Montserrat-Bold",
                fontSize: xxxxl,
                textAlign: "center",
                lineHeight: xxxxl + 4,
                color: Colors[theme].text,
              }}
            >
              {i18n.t("welcomeScreen.login")}
            </Text>
            <Text
              style={{
                fontFamily: "Montserrat",
                textAlign: "center",
                fontSize: base,
                lineHeight: base + 8,
                color: Colors[theme].text,
              }}
            >
              {i18n.t("welcomeScreen.welcomeBack")}
            </Text>
          </View>
        </View>
        <View style={styles.content}>
          <View style={styles.form}>
            <BasicTextInput
              icon="mail-outline"
              placeholder="E-mail"
              textContentType="emailAddress"
              inputMode="email"
              value={login}
              onChangeText={setLogin}
            />
            <BasicTextInput
              icon="lock-closed"
              placeholder={i18n.t("general.password")}
              textContentType="password"
              secureTextEntry
              value={pass}
              onChangeText={setPass}
            />
          </View>

          <View style={styles.buttonsContainer}>
            <SimpleButton
              style={{
                backgroundColor: "transparent",
                borderWidth: 0,
              }}
              onPress={() => router.push("/(app)")}
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
                    color:
                      theme === "light"
                        ? Colors.light.backgroundAlt
                        : Colors.dark.text,
                    fontSize: xl,
                    lineHeight: xl + 4,
                    fontFamily: "Montserrat-Bold",
                  }}
                >
                  {i18n.t("welcomeScreen.login")}
                </Text>
              </LinearGradient>
            </SimpleButton>
          </View>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
          <Text
            style={{
              fontFamily: "Montserrat",
              color: Colors[theme].text,
            }}
          >
            {i18n.t("welcomeScreen.newToRushPair")}
          </Text>
          <Pressable onPress={() => router.replace("/(auth)/sign-up")}>
            <Text
              style={{
                fontFamily: "Montserrat-Bold",
                color: Colors[theme].tint,
              }}
            >
              {" " + i18n.t("welcomeScreen.createAccount")}
            </Text>
          </Pressable>
        </View>
      </DismissKeyboardView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    gap: 48,
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
    gap: 24,
  },
  form: {
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 10,
  },
  buttonsContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: 40,
  },
});
