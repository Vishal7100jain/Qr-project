import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { envConfig } from "./env.config";

// Create axios instance with default config
const axiosInstance: AxiosInstance = axios.create({
  baseURL: envConfig.MARKET_DATA_ADMIN_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
  xsrfHeaderName: "X-CSRF-TOKEN",
});

// Request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    const apiKey = envConfig.MARKET_DATA_ADMIN_API_KEY;
    const apiSecret = envConfig.MARKET_DATA_ADMIN_API_SECRET;

    config.headers["x-api-key"] = apiKey;
    config.headers["x-api-secret"] = apiSecret;

    // Handle multipart/form-data requests
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
      config.headers["Content-Type"] = "multipart/form-data";
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },

  async (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
