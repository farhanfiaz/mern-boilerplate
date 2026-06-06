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

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.request.use(
  async (config) => {
    const apiKey = import.meta.env.VITE_API_KEYS;
    const raw = localStorage.getItem(ENDPOINTS.SYSTEM.LOCALSTORAGEKEY);
    const userObj = raw ? JSON.parse(raw) : null;

    const token = userObj?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (apiKey) {
      config.headers['x-api-key'] = apiKey;
    }

    const tenantId = userObj?.user?.tenantId;
    if (tenantId) {
      config.headers['tenant-id'] = tenantId;
    }

    const userId = userObj?.user?.userId;
    if (userId) {
      config.headers['user-id'] = userId;
    }

    const key = getSessionKey();

    if (config.data) {
      // Prevent double encryption of payload when request is retried
      const isAlreadyEncrypted =
        typeof config.data === "object" &&
        config.data !== null &&
        "iv" in config.data &&
        "data" in config.data &&
        typeof (config.data as any).iv === "string" &&
        typeof (config.data as any).data === "string";

      if (!isAlreadyEncrypted) {
        const encrypted = await encrypt(key, config.data);
        config.data = encrypted; // replace payload
      }
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

    const originalRequest = error.config;
    const isTokenExpired = error.response?.status === 401 && (
      error.response?.data?.message === "Token expired..!" ||
      error.message === "Token expired..!"
    );

    if (isTokenExpired && !originalRequest._retry && originalRequest.url !== ENDPOINTS.AUTH.REFRESH) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const raw = localStorage.getItem(ENDPOINTS.SYSTEM.LOCALSTORAGEKEY);
      const userObj = raw ? JSON.parse(raw) : null;
      const refreshToken = userObj?.refreshToken;

      if (refreshToken) {
        return new Promise((resolve, reject) => {
          axiosInstance.post(ENDPOINTS.AUTH.REFRESH, { refreshToken })
            .then((res: any) => {
              if (res.success && res.data) {
                const newAuthData = res.data;
                localStorage.setItem(ENDPOINTS.SYSTEM.LOCALSTORAGEKEY, JSON.stringify(newAuthData));

                originalRequest.headers.Authorization = `Bearer ${newAuthData.token}`;
                originalRequest.headers['user-id'] = newAuthData.user.userId;
                if (newAuthData.user.tenantId) {
                  originalRequest.headers['tenant-id'] = newAuthData.user.tenantId;
                }

                processQueue(null, newAuthData.token);
                resolve(axiosInstance(originalRequest));
              } else {
                processQueue(new Error("Refresh failed"), null);
                localStorage.removeItem(ENDPOINTS.SYSTEM.LOCALSTORAGEKEY);
                window.location.href = "/login";
                reject(new Error("Refresh failed"));
              }
            })
            .catch((err) => {
              processQueue(err, null);
              localStorage.removeItem(ENDPOINTS.SYSTEM.LOCALSTORAGEKEY);
              window.location.href = "/login";
              reject(err);
            })
            .finally(() => {
              isRefreshing = false;
            });
        });
      }
    }

    return Promise.reject(error.response?.data || error);
  }
);

export default axiosInstance;