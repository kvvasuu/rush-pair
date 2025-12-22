import BasicTextInput from "@/components/BasicTextInput";
import DismissKeyboardView from "@/components/DismissKeyboardView";
import SimpleButton from "@/components/SimpleButton";
import TransparentHeader from "@/components/TransparentHeader";
import useAppTheme from "@/hooks/useAppTheme";
import useFontSize from "@/hooks/useFontSize";
import i18n from "@/locales/i18n";
import { Colors } from "@/utils/theme";
import axios from "axios";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useSearchParams } from "expo-router/build/hooks";
import { Formik } from "formik";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from "yup";

export default function ForgotPassword() {
  const ForgotPasswordSchema = Yup.object().shape({
    email: Yup.string()
      .email(i18n.t("welcomeScreen.provideCorrectEmail"))
      .required(i18n.t("welcomeScreen.provideCorrectEmail")),
  });

  const theme = useAppTheme();
  const { sm, base, lg, xl, xxxxl } = useFontSize();
  const router = useRouter();

  const [error, setError] = useState("");

  const searchParams = useSearchParams();
  const passedEmail = searchParams.get("email") || "";

  const controllerRef = useRef<AbortController | null>(null);

  const handleSubmit = async (values: { email: string }) => {
    controllerRef.current = new AbortController();
    try {
      await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/auth/request-reset-password`,
        {
          email: values.email,
        },
        { timeout: 10000, signal: controllerRef.current?.signal }
      );

      router.replace("/(auth)/(login)/forgot-password-success");

      return Promise.resolve();
    } catch (error) {
      if (axios.isAxiosError(error) && !axios.isCancel(error)) {
        const msg = error.response?.data?.msg;

        setError(msg ? i18n.t("serverMessages." + msg) : i18n.t("general." + "somethingWentWrong"));
        return Promise.reject();
      }
    }
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
      <SafeAreaView edges={["top", "bottom"]} style={{ flex: 1, backgroundColor: Colors[theme].background }}>
        <DismissKeyboardView
          style={[
            styles.container,
            {
              paddingTop: 64,
              paddingBottom: 8,
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
                {i18n.t("welcomeScreen.resetPassword")}
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
                {i18n.t("welcomeScreen.lostPassword")}
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
              initialValues={{ email: passedEmail }}
              validationSchema={ForgotPasswordSchema}
              onSubmit={handleSubmit}
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

                  <Text
                    style={{
                      fontFamily: "MontserratSemiBold",
                      fontSize: base,
                      color: Colors[theme].text,
                      textAlign: "center",
                    }}
                  >
                    {i18n.t("welcomeScreen.resetPasswordLink")}
                  </Text>

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
                            {i18n.t("welcomeScreen.resetPassword")}
                          </Text>
                        )}
                      </LinearGradient>
                    </SimpleButton>
                  </View>
                </View>
              )}
            </Formik>
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
