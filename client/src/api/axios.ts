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

    const tenantId = raw ? JSON.parse(raw).tenantId : null;
    if (tenantId) {
      config.headers['tenant-id'] = tenantId;
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

    if (response.data?.iv && response.data?.data) {
      response.data = await decrypt(key, response.data);
    }

    return response.data;
  },

  async (error) => {
    const key = getSessionKey();

    if (error.response?.data?.iv && error.response?.data?.data) {
      error.response.data = await decrypt(key, error.response.data);
    }

    return Promise.reject(error.response?.data || error);
  }
);

export default axiosInstance;