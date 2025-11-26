import { router } from "expo-router";
import { View, Text, Button, TextInput } from "react-native";

export default function ForgotPassword() {
  return (
    <View style={{ padding: 24 }}>
      <Text style={{ fontSize: 24 }}>Reset hasła</Text>

      <TextInput placeholder="Email" style={{ marginTop: 16 }} />

      <Button title="Wyślij link resetujący" onPress={() => {}} />

      <Button title="Wróć" onPress={() => router.back()} />
    </View>
  );
}
