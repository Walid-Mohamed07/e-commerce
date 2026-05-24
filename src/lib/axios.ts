import { BASE_URL, FETCH_TIMEOUT } from "@/constants/api";
import axios from "axios";
import { getCookie, deleteCookie } from "cookies-next";

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: FETCH_TIMEOUT,
});

api.interceptors.request.use(
  async (config) => {
    const token = await getCookie("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Clear stale/expired token on 401 so subsequent calls use visitor cart
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      deleteCookie("token", { path: "/" });
    }
    return Promise.reject(error);
  }
);
