import axios from "axios";

const initAxios = (token: string) => {
  axios.defaults.baseURL = process.env.EXPO_PUBLIC_API_URL;
  axios.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};

export { initAxios };
