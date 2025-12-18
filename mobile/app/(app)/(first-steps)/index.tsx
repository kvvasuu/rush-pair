import BasicTextInput from "@/components/BasicTextInput";
import DatePicker from "@/components/DatePicker";
import DismissKeyboardView from "@/components/DismissKeyboardView";
import SimpleButton from "@/components/SimpleButton";
import Stepper from "@/components/Stepper";
import useAppTheme from "@/hooks/useAppTheme";
import useFontSize from "@/hooks/useFontSize";
import i18n from "@/locales/i18n";
import { useAuthStore } from "@/stores/authStore";
import { Colors } from "@/utils/theme";
import { Gender } from "@/utils/types";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Formik } from "formik";
import { useRef, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import * as Yup from "yup";

export default function FirstStepsScreen() {
  const Schemas = [
    Yup.object().shape({
      name: Yup.string().required(i18n.t("firstSteps.enterName")),
      birthdate: Yup.string().required(i18n.t("firstSteps.enterBirthdate")),
      gender: Yup.string().required(i18n.t("firstSteps.chooseGender")),
    }),
    Yup.object().shape({
      name: Yup.string().required(i18n.t("firstSteps.enterName")),
      birthdate: Yup.string().required(i18n.t("firstSteps.enterBirthdate")),
      gender: Yup.string().required(i18n.t("firstSteps.chooseGender")),
    }),
  ];

  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const { sm, base, lg, xl, xxxxl } = useFontSize();

  const logout = useAuthStore((state) => state.logout);
  const [error, setError] = useState("");

  const [currentStep, setCurrentStep] = useState(0);

  const controllerRef = useRef<AbortController | null>(null);

  const handleSignup = async (values: { name: string; birthdate: Date; gender: Gender | "" }) => {
    controllerRef.current = new AbortController();
    console.log(values);
    setCurrentStep((prev) => prev + 1);

    /* return signup(values.email, values.password, controllerRef.current)
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
      }); */
  };

  return (
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
            {i18n.t("firstSteps.firstSteps")}
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
            {i18n.t("firstSteps.providePersonalInfo")}
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
            initialValues={{ name: "", birthdate: new Date(), gender: "" }}
            validationSchema={Schemas[currentStep]}
            onSubmit={handleSignup}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              setFieldValue,
              isSubmitting,
              isValid,
            }) => (
              <View style={styles.form}>
                <View style={styles.inputWrapper}>
                  <BasicTextInput
                    icon="person"
                    placeholder={i18n.t("general.name")}
                    textContentType="name"
                    inputMode="text"
                    value={values.name}
                    onChangeText={handleChange("name")}
                    onBlur={handleBlur("name")}
                    style={touched.name && errors.name && { borderColor: Colors[theme].red }}
                  />
                  {touched.name && errors.name && (
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
                      {errors.name}
                    </Text>
                  )}
                </View>

                <View style={styles.inputWrapper}>
                  <DatePicker
                    onConfirm={(date) => {
                      setFieldValue("birthdate", date);
                    }}
                  />
                  {/* <BasicTextInput
                    icon="calendar"
                    placeholder={i18n.t("general.birthdate")}
                    textContentType="birthdate"
                    value={values.birthdate}
                    onChangeText={handleChange("birthdate")}
                    onBlur={handleBlur("birthdate")}
                    style={touched.birthdate && errors.birthdate && { borderColor: Colors[theme].red }}
                  /> */}
                  {touched.birthdate && errors.birthdate && (
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
                      {/* {errors.birthdate} */}
                    </Text>
                  )}
                </View>

                <View style={styles.inputWrapper}>
                  <BasicTextInput
                    icon="transgender"
                    placeholder={i18n.t("general.gender")}
                    textContentType="none"
                    value={values.gender}
                    onChangeText={handleChange("gender")}
                    onBlur={handleBlur("gender")}
                    style={
                      touched.gender &&
                      errors.gender && {
                        borderColor: Colors[theme].red,
                      }
                    }
                  />
                  {touched.gender && errors.gender && (
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
                      {errors.gender}
                    </Text>
                  )}
                </View>

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
                          {i18n.t("general.next")}
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

      <View style={{ width: "80%", maxWidth: 400 }}>
        <Stepper
          activeStep={currentStep}
          variant="numbers"
          steps={[
            { key: "personal", icon: "person" },
            { key: "additional", icon: "sparkles" },
            { key: "summary", icon: "checkmark" },
          ]}
        />
      </View>

      <Pressable onPress={() => logout()} style={{ flexDirection: "row", justifyContent: "flex-end" }} hitSlop={12}>
        <Text
          style={{
            fontFamily: "MontserratBold",
            color: Colors[theme].tint,
          }}
        >
          {i18n.t("general.logout")}
        </Text>
      </Pressable>
    </DismissKeyboardView>
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
