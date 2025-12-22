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
import { useRef, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from "yup";

export default function SignupScreen() {
  const SignupSchema = Yup.object().shape({
    email: Yup.string()
      .email(i18n.t("welcomeScreen.provideCorrectEmail"))
      .required(i18n.t("welcomeScreen.provideCorrectEmail")),
    password: Yup.string()
      .required(i18n.t("welcomeScreen.enterPassword"))
      .min(6, i18n.t("welcomeScreen.passwordMustBeLong")),
    passwordConfirm: Yup.string()
      .required(i18n.t("welcomeScreen.enterPassword"))
      .oneOf([Yup.ref("password")], i18n.t("welcomeScreen.passwordsNotTheSame")),
  });

  const theme = useAppTheme();
  const { sm, base, lg, xl, xxxxl } = useFontSize();
  const router = useRouter();

  const signup = useAuthStore((state) => state.signup);
  const [error, setError] = useState("");

  const controllerRef = useRef<AbortController | null>(null);

  const handleSignup = async (values: { email: string; password: string }) => {
    controllerRef.current = new AbortController();
    return signup(values.email, values.password, controllerRef.current)
      .then((res) => {
        if (res.success) {
          useAuthStore.setState({ lastRegisteredEmail: values.email });
          router.replace("/(auth)/sign-up-success");
        }
      })
      .catch((res) => {
        if (!res.success) {
          console.log(res);
          setError(res.message);
        }
      });
  };

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
              source={require("../../assets/images/logo_sygnet.png")}
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
                {i18n.t("welcomeScreen.createAccount")}
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
                {i18n.t("welcomeScreen.startConversations")}
              </Text>
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
            </View>
          </View>
          <View style={styles.content}>
            <View style={styles.form}>
              <Formik
                initialValues={{ email: "", password: "", passwordConfirm: "" }}
                validationSchema={SignupSchema}
                onSubmit={handleSignup}
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

                    <View style={styles.inputWrapper}>
                      <BasicTextInput
                        icon="lock-closed"
                        placeholder={i18n.t("general.confirmPassword")}
                        textContentType="password"
                        secureTextEntry
                        value={values.passwordConfirm}
                        onChangeText={handleChange("passwordConfirm")}
                        onBlur={handleBlur("passwordConfirm")}
                        style={
                          touched.passwordConfirm &&
                          errors.passwordConfirm && {
                            borderColor: Colors[theme].red,
                          }
                        }
                      />
                      {touched.passwordConfirm && errors.passwordConfirm && (
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
                          {errors.passwordConfirm}
                        </Text>
                      )}
                    </View>

                    <Pressable onPress={() => router.replace("/(auth)")}>
                      <Text
                        style={{
                          fontFamily: "Montserrat",
                          fontSize: sm,
                          lineHeight: sm + 4,
                          color: Colors[theme].text,
                          textAlign: "center",
                        }}
                      >
                        {i18n.t("welcomeScreen.iAgree")}

                        <Text
                          style={{
                            fontFamily: "MontserratBold",
                            fontSize: sm,
                            lineHeight: sm + 4,
                            color: Colors[theme].tint,
                          }}
                        >
                          {" " + i18n.t("welcomeScreen.terms")}
                        </Text>
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
                              {i18n.t("welcomeScreen.createAccount")}
                            </Text>
                          )}
                        </LinearGradient>
                      </SimpleButton>
                    </View>
                  </View>
                )}
              </Formik>
            </View>
          </View>

          <Pressable
            onPress={() => router.replace("/(auth)/(login)")}
            style={{ flexDirection: "row", justifyContent: "flex-end" }}
            hitSlop={12}
          >
            <Text
              style={{
                fontFamily: "Montserrat",
                color: Colors[theme].text,
              }}
            >
              {i18n.t("welcomeScreen.alreadyHaveAccount")}
            </Text>

            <Text
              style={{
                fontFamily: "MontserratBold",
                color: Colors[theme].tint,
              }}
            >
              {" " + i18n.t("welcomeScreen.login")}
            </Text>
          </Pressable>
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
    gap: 40,
  },
  inputErrorMessage: {
    width: "100%",
    paddingLeft: 12,
  },
});
