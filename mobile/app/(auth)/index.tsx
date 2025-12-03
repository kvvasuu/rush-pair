import { Colors } from "@/utils/theme";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import SimpleButton from "@/components/SimpleButton";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useFontSize from "@/hooks/useFontSize";

export default function AuthScreen() {
  const insets = useSafeAreaInsets();
  const { xl } = useFontSize();

  return (
    <LinearGradient
      colors={["#7b4397", "#e94548"]}
      locations={[0, 0.87]}
      end={{ x: 1, y: 0.05 }}
      start={{ x: 0, y: 0.95 }}
      style={styles.background}
    >
      <View
        style={[
          styles.container,
          { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 },
        ]}
      >
        <Image
          style={styles.logo}
          source={require("../../assets/images/logo.png")}
          contentFit="contain"
        />
        <View style={styles.buttonsContainer}>
          <SimpleButton
            style={{
              backgroundColor: Colors.light.yellow,
              borderColor: Colors.light.yellow,
            }}
            onPress={() => router.push("/(auth)/(modal)/sign-up")}
          >
            <Text
              style={{
                color: Colors.light.text,
                fontSize: xl,
                fontFamily: "Montserrat-Bold",
              }}
            >
              Create account
            </Text>
          </SimpleButton>
          <SimpleButton
            transparent
            style={{
              borderColor: Colors.light.backgroundAlt,
            }}
            onPress={() => router.push("/(auth)/(modal)/(login)")}
          >
            <Text
              style={{
                color: Colors.light.backgroundAlt,
                fontSize: xl,
                fontFamily: "Montserrat-Bold",
              }}
            >
              Login
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
