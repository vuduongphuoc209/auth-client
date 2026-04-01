"use client";

import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { requestRefreshToken } from "./UserRequest";

type FailedQueueItem = {
  resolve: (value?: unknown) => void;
  reject: (error: unknown) => void;
};

export class ApiClient {
  baseURL: string;
  axiosInstance: AxiosInstance;
  isRefreshing: boolean;
  failedQueue: FailedQueueItem[];

  constructor(baseURL?: string) {
    this.baseURL = baseURL || process.env.NEXT_PUBLIC_API_URL || "";
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      withCredentials: true,
    });

    this.isRefreshing = false;
    this.failedQueue = [];

    this.setupInterceptors();
  }

  setupInterceptors() {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => config,
      (error: unknown) => Promise.reject(error),
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: any) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            })
              .then(() => this.axiosInstance(originalRequest))
              .catch((err) => Promise.reject(err));
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            await this.refreshToken();
            this.processQueue(null);
            return this.axiosInstance(originalRequest);
          } catch (refreshError) {
            this.processQueue(refreshError);
            this.handleAuthFailure();
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      },
    );
  }

  async refreshToken() {
    try {
      await requestRefreshToken();
      console.log("Token refreshed successfully");
    } catch (error) {
      console.error("Failed to refresh token:", error);
      throw error;
    }
  }

  processQueue(error: unknown) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });

    this.failedQueue = [];
  }

  handleAuthFailure() {
    // avoid redirect loop when already on login page
    if (window.location.pathname === "/sign-in") return;

    this.logout().finally(() => {
      window.location.replace("/sign-in");
    });
  }

  isLoggedIn() {
    return Cookies.get("logged") === "1";
  }

  async logout() {
    try {
      await this.axiosInstance.get("/api/user/logout");
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  checkAuthStatus() {
    return this.isLoggedIn();
  }

  get(url: string, config?: AxiosRequestConfig) {
    return this.axiosInstance.get(url, config);
  }

  post(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return this.axiosInstance.post(url, data, config);
  }

  put(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return this.axiosInstance.put(url, data, config);
  }

  delete(url: string, config?: AxiosRequestConfig) {
    return this.axiosInstance.delete(url, config);
  }

  patch(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return this.axiosInstance.patch(url, data, config);
  }
}

// Export instance
export const apiClient = new ApiClient();
