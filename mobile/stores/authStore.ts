import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { initAxios } from "@/utils/functions";
import { socket } from "@/utils/utils";
import { useUserStore } from "./userStore";

interface AuthStore {
  isLoggedIn: boolean;
  token: string;

  login: (email: string, password: string) => void;
  autoLogin: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      token: "",

      login: async (email, password) => {
        if (!email || !password) return;

        try {
          const res = await axios.post(
            `${process.env.EXPO_PUBLIC_API_URL}/auth/login`,
            {
              email,
              password,
            },
            { timeout: 10000 }
          );

          const token = res?.data?.token;
          if (!token) return;

          await SecureStore.setItemAsync("token", token);
          set({ token });
          get().autoLogin();
        } catch (error) {
          console.log(error);
        }
      },
      autoLogin: async () => {
        let token: string | null =
          get().token || (await SecureStore.getItemAsync("token"));

        if (!token) return;

        initAxios(token);
        try {
          const res = await axios.get("/auth/verify-token", {
            timeout: 10000,
          });

          useUserStore.setState({ ...res.data.user });

          try {
            useUserStore.getState().getPairs();
          } catch (error) {
            console.log(error);
          }

          socket.connect();
          socket.emit("login", res.data.user._id);
          useUserStore.getState().bindSocketEvents();

          set({ isLoggedIn: true, token });

          // if (res.data.coinsCollected) {
          //   setTimeout(() => {
          //     const mainStore = useMainStore();
          //     mainStore.showCoinsCollectionModal = true;
          //   }, 500);
          // }
        } catch (error) {
          await SecureStore.deleteItemAsync("token");
          set({ isLoggedIn: false, token: "" });
        }
      },
      logout: async () => {
        socket.emit("logout");
        await SecureStore.deleteItemAsync("token");
        set({ isLoggedIn: false });
      },
    }),
    {
      name: "rushpair",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
