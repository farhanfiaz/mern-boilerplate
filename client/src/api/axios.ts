import logger from "@/utils/logger";
import axios from "axios";
import { ENDPOINTS } from "./endpoints";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const apiKey = import.meta.env.VITE_API_KEYS;
    const raw = localStorage.getItem(ENDPOINTS.SYSTEM.LOCALSTORAGEKEY);

    const token = raw ? JSON.parse(raw).token : null; if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (apiKey) {
      config.headers['x-api-key'] = apiKey;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },

  async (error) => {
    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        localStorage.removeItem("accessToken");

        window.location.href = "/login";
      }

      return Promise.reject(error.response.data);
    }
    logger.error(error.message);
    return Promise.reject({
      success: false,
      message: error.message || "Network Error",
      details: error
    });
  }
);

export default axiosInstance;