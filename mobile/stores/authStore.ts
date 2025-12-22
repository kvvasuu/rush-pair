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
  authStatus: "unknown" | "authenticated" | "unauthenticated";
  token: string | null;
  lastRegisteredEmail: string;
  lastVerifiedAt: number | null;

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
  verifyToken: (init?: boolean) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      authStatus: "unknown",
      token: null,
      lastRegisteredEmail: "",
      lastVerifiedAt: null,

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
      verifyToken: async (init = false) => {
        const token = get().token ?? (await SecureStore.getItemAsync("token"));
        if (!token) {
          set({ authStatus: "unauthenticated" });
          return;
        }
        if (init) initAxios(token);

        try {
          const res = await axios.get("/auth/verify-token");

          useUserStore.setState(res.data.user);

          set({ authStatus: "authenticated", token });
        } catch {
          await SecureStore.deleteItemAsync("token");
          set({ authStatus: "unauthenticated", token: null });
        }
      },
      logout: async () => {
        socket.emit("logout");
        await SecureStore.deleteItemAsync("token");
        set({ authStatus: "unauthenticated", token: null });
      },
    }),
    {
      name: "rushpair-auth",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        token: state.token,
        lastRegisteredEmail: state.lastRegisteredEmail,
        lastVerifiedAt: state.lastVerifiedAt,
      }),
    }
  )
);
