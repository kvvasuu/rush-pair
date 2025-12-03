import useAppTheme from "@/hooks/useAppTheme";
import { Colors } from "@/utils/theme";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useFontSize from "@/hooks/useFontSize";
import BasicTextInput from "@/components/BasicTextInput";
import { useState } from "react";
import SimpleButton from "@/components/SimpleButton";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function AuthScreen() {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const { xxxxl } = useFontSize();
  const router = useRouter();

  const [login, setLogin] = useState("");

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: insets.bottom,
          paddingTop: insets.top,
          backgroundColor: Colors[theme].background,
        },
      ]}
    >
      <View style={[styles.header, { paddingTop: 64 }]}>
        <Text
          style={[
            {
              fontSize: xxxxl,
              color: Colors[theme].text,
              fontFamily: "Montserrat-Bold",
            },
          ]}
        >
          Create Account
        </Text>
        <View style={{ position: "absolute", right: 0, top: 0 }}>
          <SimpleButton
            onPress={() => {
              router.back();
            }}
            transparent
            style={{
              borderColor: "transparent",
              paddingHorizontal: 0,
              paddingVertical: 0,
              margin: 0,
            }}
          >
            <Ionicons name="close" size={52} color={Colors[theme].icon} />
          </SimpleButton>
        </View>
      </View>

      <View style={styles.content}>
        <BasicTextInput value={login} onChangeText={setLogin}></BasicTextInput>
        <Text>{login}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 80,
    padding: 24,
  },
  header: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    position: "relative",
  },
  logo: {
    width: "100%",
    height: 40,
  },
  content: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  inputsContainer: {
    width: "100%",
    gap: 20,
  },
});
