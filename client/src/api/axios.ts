import axios from "axios";
import { ENDPOINTS } from "./endpoints";
import logger from "@/utils/logger";

import {
  clearStoredAuth,
  getStoredAuth,
  saveStoredAuth,
} from "@/utils/auth-storage";

import {
  encrypt,
  decrypt,
} from "@/crypto/aes";

import { getSessionKey } from "@/crypto/session";
import { applyAuthHeaders } from "@/api/applyAuthHeaders";

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
  failedQueue.forEach((p) => {
    error ? p.reject(error) : p.resolve(token);
  });
  failedQueue = [];
};

const getKeySafe = () => {
  try {
    return getSessionKey();
  } catch (e) {
    logger.error("Session key not ready", e);
    throw e;
  }
};

// ---------------- REQUEST ----------------
axiosInstance.interceptors.request.use(async (config) => {
  const apiKey = import.meta.env.VITE_API_KEYS;

  const userObj = await getStoredAuth();
  logger.info("Interceptors request userObj => ", userObj);
  applyAuthHeaders(config, userObj, apiKey);

  // encrypt payload
  if (config.data) {
    const isEncrypted =
      typeof config.data === "object" &&
      config.data !== null &&
      "iv" in config.data &&
      "data" in config.data;

    if (!isEncrypted) {
      const key = getKeySafe();
      config.data = await encrypt(key, config.data);
    }
  }

  return config;
});

// ---------------- RESPONSE ----------------
axiosInstance.interceptors.response.use(
  async (response) => {
    const key = getKeySafe();

    if (response.data?.iv && response.data?.data) {
      response.data = await decrypt(key, response.data);
    }
    logger.log("Interceptor response data => ", response.data);
    return response.data;
  },

  async (error) => {
    const key = getKeySafe();

    if (error.response?.data?.iv && error.response?.data?.data) {
      error.response.data = await decrypt(
        key,
        error.response.data
      );
    }
    logger.error("Interceptor error response data => ", error.response.data?.message);
    const originalRequest = error.config;

    const isTokenExpired =
      error.response?.status === 401 &&
      (error.response?.data?.message === "Token expired..!" ||
        error.message === "Token expired..!");

    // ignore refresh endpoint
    if (
      originalRequest.url === ENDPOINTS.AUTH.REFRESH
    ) {
      logger.error("Refresh request failed: ", error);
      return Promise.reject(error);
    }

    if (isTokenExpired && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const userObj = await getStoredAuth();

      const refreshToken = userObj?.refreshToken;

      if (!refreshToken) {
        clearStoredAuth();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      return new Promise((resolve, reject) => {
        axiosInstance
          .post(ENDPOINTS.AUTH.REFRESH, {
            refreshToken,
          })
          .then(async (res: any) => {
            const newAuthData = res?.data?.data ?? res?.data;

            if (!newAuthData?.token) {
              logger.error("Invalid refresh response");
              throw new Error("Invalid refresh response");
            }

            await saveStoredAuth(newAuthData);

            processQueue(null, newAuthData.token);

            originalRequest.headers.Authorization =
              `Bearer ${newAuthData.token}`;

            resolve(axiosInstance(originalRequest));
          })
          .catch((err) => {
            logger.error(err);
            processQueue(err, null);
            clearStoredAuth();
            window.location.href = "/login";
            reject(err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;