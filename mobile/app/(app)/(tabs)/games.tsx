import useAppTheme from "@/hooks/useAppTheme";
import { Colors } from "@/utils/theme";
import { StyleSheet, Text, View } from "react-native";

export default function GamesScreen() {
  const theme = useAppTheme();
  return (
    <View style={styles.titleContainer}>
      <Text>Games</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
});
