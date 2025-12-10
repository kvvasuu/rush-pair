import BasicTextInput from "@/components/BasicTextInput";
import DismissKeyboardView from "@/components/DismissKeyboardView";
import SimpleButton from "@/components/SimpleButton";
import TransparentHeader from "@/components/TransparentHeader";
import useAppTheme from "@/hooks/useAppTheme";
import useFontSize from "@/hooks/useFontSize";
import i18n from "@/locales/i18n";
import { useAuthStore } from "@/stores/authStore";
import { Colors } from "@/utils/theme";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Yup from "yup";

export default function LoginScreen() {
  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email(i18n.t("welcomeScreen.provideCorrectEmail"))
      .required(i18n.t("welcomeScreen.provideCorrectEmail")),
    password: Yup.string().required(i18n.t("welcomeScreen.enterPassword")),
  });

  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const { sm, base, lg, xl, xxxxl } = useFontSize();
  const router = useRouter();

  const lastRegisteredEmail = useAuthStore((state) => state.lastRegisteredEmail);
  const login = useAuthStore((state) => state.login);

  const [error, setError] = useState("");

  const controllerRef = useRef<AbortController | null>(null);

  const handleLogin = async (values: { email: string; password: string }) => {
    controllerRef.current = new AbortController();
    return login(values.email, values.password, controllerRef.current).catch((res) => {
      if (!res.success) {
        setError(res.message);
      }
    });
  };

  useEffect(() => {
    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, []);

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
            gap: error.length > 0 ? 14 : 48,
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

        {error.length > 0 && (
          <Text
            style={{
              fontFamily: "MontserratSemiBold",
              textAlign: "center",
              fontSize: lg,
              lineHeight: lg + 2,
              color: Colors[theme].red,
            }}
          >
            {error}
          </Text>
        )}

        <View style={styles.content}>
          <Formik
            initialValues={{ email: lastRegisteredEmail || "", password: "" }}
            validationSchema={LoginSchema}
            onSubmit={handleLogin}
          >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, isValid }) => (
              <View style={styles.form}>
                <View style={styles.inputWrapper}>
                  <BasicTextInput
                    icon="mail-outline"
                    placeholder="E-mail"
                    textContentType="emailAddress"
                    inputMode="email"
                    value={values.email}
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    style={touched.email && errors.email && { borderColor: Colors[theme].red }}
                  />
                  {touched.email && errors.email && (
                    <Text
                      style={[
                        styles.inputErrorMessage,
                        {
                          color: Colors[theme].red,
                          fontFamily: "MontserratSemiBold",
                          fontSize: sm,
                          lineHeight: sm,
                        },
                      ]}
                    >
                      {errors.email}
                    </Text>
                  )}
                </View>

                <View style={styles.inputWrapper}>
                  <BasicTextInput
                    icon="lock-closed"
                    placeholder={i18n.t("general.password")}
                    textContentType="password"
                    secureTextEntry
                    value={values.password}
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    style={touched.password && errors.password && { borderColor: Colors[theme].red }}
                  />
                  {touched.password && errors.password && (
                    <Text
                      style={[
                        styles.inputErrorMessage,
                        {
                          color: Colors[theme].red,
                          fontFamily: "MontserratSemiBold",
                          fontSize: sm,
                          lineHeight: sm,
                        },
                      ]}
                    >
                      {errors.password}
                    </Text>
                  )}
                </View>

                <Pressable
                  onPress={() =>
                    router.push({ pathname: "/(auth)/(login)/forgot-password", params: { email: values.email } })
                  }
                  style={{ alignSelf: "flex-end" }}
                >
                  <Text
                    style={{
                      fontFamily: "MontserratBold",
                      color: Colors[theme].tint,
                      textAlign: "right",
                    }}
                  >
                    {" " + i18n.t("welcomeScreen.forgotPassword")}
                  </Text>
                </Pressable>

                <View style={styles.buttonsContainer}>
                  <SimpleButton
                    style={{
                      backgroundColor: "transparent",
                      borderWidth: 0,
                    }}
                    onPress={() => {
                      if (isSubmitting || !isValid) return;
                      handleSubmit();
                    }}
                    disabled={!!isSubmitting}
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
                      {isSubmitting ? (
                        <ActivityIndicator
                          size={xl + 4}
                          color={theme === "light" ? Colors.light.backgroundAlt : Colors.dark.text}
                        />
                      ) : (
                        <Text
                          style={{
                            color: theme === "light" ? Colors.light.backgroundAlt : Colors.dark.text,
                            fontSize: xl,
                            lineHeight: xl + 4,
                            fontFamily: "MontserratBold",
                          }}
                        >
                          {i18n.t("welcomeScreen.login")}
                        </Text>
                      )}
                    </LinearGradient>
                  </SimpleButton>
                </View>
              </View>
            )}
          </Formik>
        </View>

        <Pressable
          onPress={() => router.replace("/(auth)/sign-up")}
          style={{ flexDirection: "row", justifyContent: "flex-end" }}
          hitSlop={12}
        >
          <Text
            style={{
              fontFamily: "Montserrat",
              color: Colors[theme].text,
            }}
          >
            {i18n.t("welcomeScreen.newToRushPair")}
          </Text>

          <Text
            style={{
              fontFamily: "MontserratBold",
              color: Colors[theme].tint,
            }}
          >
            {" " + i18n.t("welcomeScreen.createAccount")}
          </Text>
        </Pressable>
      </DismissKeyboardView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
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
  inputWrapper: {
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 4,
  },
  buttonsContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    gap: 40,
  },
  inputErrorMessage: {
    width: "100%",
    paddingLeft: 12,
  },
});
