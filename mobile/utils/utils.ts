import * as Updates from "expo-updates";
import { Alert } from "react-native";
import i18n from "@/locales/i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";

// Tłumaczenia dodać !!!
async function checkForUpdate() {
  try {
    const update = await Updates.checkForUpdateAsync();

    if (update.isAvailable) {
      Alert.alert(
        i18n.t("Nowa wersja dostępna"),
        i18n.t("Czy chcesz ją teraz zainstalować?"),
        [
          { text: i18n.t("Nie teraz") },
          {
            text: i18n.t("Tak"),
            onPress: async () => {
              try {
                await Notifications.scheduleNotificationAsync({
                  content: {
                    title: "RushPair",
                    body: i18n.t("Aplikacja została zaktualizowana"),
                  },
                  trigger: null,
                });

                await Updates.fetchUpdateAsync();
                await AsyncStorage.clear();

                await Updates.reloadAsync();
              } catch (err) {
                console.error("Błąd przy aktualizacji:", err);
              }
            },
          },
        ]
      );
    }
  } catch (e) {
    console.log("Błąd aktualizacji", e);
  }
}
export { checkForUpdate };
