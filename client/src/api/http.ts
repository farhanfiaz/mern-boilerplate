import axios from "./axios";
import { ApiResponse } from "@/types/api.types";

export const http = {
  get: async <T>(url: string): Promise<ApiResponse<T>> => {
    return axios.get(url);
  },

  post: async <T>(
    url: string,
    body?: unknown
  ): Promise<ApiResponse<T>> => {
    return axios.post(url, body);
  },

  put: async <T>(
    url: string,
    body?: unknown
  ): Promise<ApiResponse<T>> => {
    return axios.put(url, body);
  },

  delete: async <T>(
    url: string
  ): Promise<ApiResponse<T>> => {
    return axios.delete(url);
  },
};