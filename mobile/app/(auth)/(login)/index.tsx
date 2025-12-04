import { Link, router } from "expo-router";
import { View, Text, TextInput, Button } from "react-native";

export default function Login() {
  return (
    <View style={{ padding: 24 }}>
      <Text style={{ fontSize: 24 }}>Logowanie</Text>

      <Button
        title="Zapomniałeś hasła?"
        onPress={() => router.push("/(auth)/(login)/forgot-password")}
      />
      <Button title="Wróć" onPress={() => router.back()} />
    </View>
  );
}
