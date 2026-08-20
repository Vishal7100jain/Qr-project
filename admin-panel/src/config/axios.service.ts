import axios, { AxiosRequestConfig } from "axios";
import axiosInstance from "./axios.config";

interface ApiResponse<T> {
  data: T;
  status: "success" | "error";
  message: string;
}

interface ApiError {
  message: string;
  status?: number;
  data?: any;
}

// Helper function to handle API errors
const handleApiError = (error: any): ApiError => {
  if (axios.isAxiosError(error)) {
    return {
      message: error.response?.data?.message || error.message,
      status: error.response?.status,
      data: error.response?.data,
    };
  }
  return {
    message: error?.message || "An unknown error occurred",
  };
};

const apiService = {
  // GET request
  get: async <T, D>(
    url: string,
    params?: D,
    config: AxiosRequestConfig = {}
  ): Promise<ApiResponse<T>> => {
    try {
      const response = await axiosInstance.get<T>(url, { ...config, params });
      return response as unknown as ApiResponse<T>;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // POST request
  post: async <T, D>(
    url: string,
    data: D,
    config: AxiosRequestConfig = {}
  ): Promise<ApiResponse<T>> => {
    try {
      const response = await axiosInstance.post<T>(url, data, config);
      return response as unknown as ApiResponse<T>;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // PUT request
  put: async <T, D>(
    url: string,
    data: D,
    config: AxiosRequestConfig = {}
  ): Promise<ApiResponse<T>> => {
    try {
      const response = await axiosInstance.put<T>(url, data, config);
      return response as unknown as ApiResponse<T>;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // PATCH request
  patch: async <T>(
    url: string,
    data: T,
    config: AxiosRequestConfig = {}
  ): Promise<ApiResponse<T>> => {
    try {
      const response = await axiosInstance.patch<T>(url, data, config);
      return response as unknown as ApiResponse<T>;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // DELETE request
  delete: async <T>(
    url: string,
    config: AxiosRequestConfig = {}
  ): Promise<ApiResponse<T>> => {
    try {
      const response = await axiosInstance.delete<T>(url, config);
      return response as unknown as ApiResponse<T>;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

export default apiService;
