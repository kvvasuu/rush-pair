import i18n from "@/locales/i18n";
import { initAxios } from "@/utils/functions";
import { socket } from "@/utils/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useUserStore } from "./userStore";

interface AuthStore {
  isLoggedIn: boolean;
  token: string;
  lastRegisteredEmail: string;

  login: (
    email: string,
    password: string,
    abortController?: AbortController
  ) => Promise<{ success: boolean; message: string }>;
  signup: (
    email: string,
    password: string,
    abortController?: AbortController
  ) => Promise<{ success: boolean; message: string }>;
  autoLogin: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      token: "",
      lastRegisteredEmail: "",

      login: async (email, password, abortController) => {
        if (!email || !password)
          return Promise.reject({
            success: false,
            message: i18n.t("general.somethingWentWrong"),
          });

        try {
          const res = await axios.post(
            `${process.env.EXPO_PUBLIC_API_URL}/auth/login`,
            {
              email,
              password,
            },
            { timeout: 10000, signal: abortController?.signal }
          );

          const token: string = res?.data?.token;
          if (!token)
            return Promise.reject({
              success: false,
              message: i18n.t("general.somethingWentWrong"),
            });

          await SecureStore.setItemAsync("token", token);
          set({ token: token, lastRegisteredEmail: "" });
          get().autoLogin();
          return Promise.resolve({ success: true, message: "" });
        } catch (error) {
          if (axios.isAxiosError(error) && !axios.isCancel(error)) {
            const msg = error.response?.data?.msg;
            return Promise.reject({
              success: false,
              message: msg ? i18n.t("serverMessages." + msg) : i18n.t("general." + "somethingWentWrong"),
              status: error.response?.status,
            });
          }
          return Promise.reject({
            success: false,
            message: i18n.t("general.somethingWentWrong"),
          });
        }
      },
      signup: async (email, password, abortController) => {
        if (!email || !password)
          return Promise.reject({
            success: false,
            message: i18n.t("general.somethingWentWrong"),
          });

        try {
          await axios.post(
            `${process.env.EXPO_PUBLIC_API_URL}/auth/register`,
            {
              email,
              password,
            },
            { timeout: 10000, signal: abortController?.signal }
          );

          return Promise.resolve({ success: true, message: "" });
        } catch (error) {
          if (axios.isAxiosError(error) && !axios.isCancel(error)) {
            const msg = error.response?.data?.msg;
            return Promise.reject({
              success: false,
              message: msg ? i18n.t("serverMessages." + msg) : i18n.t("general." + "somethingWentWrong"),
              status: error.response?.status,
            });
          }
          return Promise.reject({
            success: false,
            message: i18n.t("general.somethingWentWrong"),
          });
        }
      },
      autoLogin: async () => {
        let token: string | null = get().token || (await SecureStore.getItemAsync("token"));

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
