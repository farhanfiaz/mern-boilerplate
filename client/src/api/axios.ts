import logger from "@/utils/logger";
import axios from "axios";
import { ENDPOINTS } from "./endpoints";
import { getSessionKey } from "@/crypto/session";
import { decrypt, encrypt } from "@/crypto/aes";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const apiKey = import.meta.env.VITE_API_KEYS;
    const raw = localStorage.getItem(ENDPOINTS.SYSTEM.LOCALSTORAGEKEY);

    const token = raw ? JSON.parse(raw).token : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (apiKey) {
      config.headers['x-api-key'] = apiKey;
    }

    const key = getSessionKey();

    if (config.data) {
      const encrypted = await encrypt(key, config.data);

      config.data = encrypted; // replace payload
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  async (response) => {
    const key = getSessionKey();

    if (response.data?.data && response.data?.iv) {
      const decrypted = await decrypt(key, response.data);
      response.data = decrypted;
    }
    return response.data;
  },

  async (error) => {
    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        localStorage.removeItem(ENDPOINTS.SYSTEM.LOCALSTORAGEKEY);

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