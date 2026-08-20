import { HandleLogoutServerAction } from "@/action/admin/adminAuth.Action";
import { ServerCookieKeys } from "@/constants/keys";
import { getServerCookie } from "@/utils/serverSideCookie";
import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { envConfig } from "./env.config";

// Create axios instance with default config
const axiosInstance: AxiosInstance = axios.create({
  baseURL: envConfig.apiUrl,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
  xsrfHeaderName: "X-CSRF-TOKEN", // Add this
});

// Request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    const apiKey = envConfig.apiKey;
    const apiSecret = envConfig.apiSecret;

    config.headers["x-api-key"] = apiKey;
    config.headers["x-api-secret"] = apiSecret;

    // Handle multipart/form-data requests
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
      config.headers["Content-Type"] = "multipart/form-data";
    }

    const token = await getServerCookie(ServerCookieKeys.token);
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
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
    const originalRequest = error.config;
    // Handle errors globally
    if (error.response) {
      // that falls out of the range of 2xx
      switch (error?.response?.status) {
        case 401:
          // handle something
          console.log("Unauthorized");
          break;
        case 403:
        case 406:
          // Handle forbidden access
          await HandleLogoutServerAction();
          break;
        case 404:
          // Handle not found errors
          break;
        case 500:
          // Handle server errors
          break;
        default:
          break;
      }
    } else if (error.request) {
      return Promise.reject({
        message: "Oops! No response received.",
      });
    } else {
      return Promise.reject({
        message: `Request setup error : ${error?.message}`,
      });
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
