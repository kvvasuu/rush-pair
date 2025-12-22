import axios from "axios";

let authInterceptorId: number | null = null;

export const initAxios = (token: string) => {
  axios.defaults.baseURL = process.env.EXPO_PUBLIC_API_URL;

  if (authInterceptorId !== null) return;

  authInterceptorId = axios.interceptors.request.use(
    async (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
};
