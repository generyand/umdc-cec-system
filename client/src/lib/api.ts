import axios from "axios";
import { useAuth } from "@/hooks/use-auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

// Single request interceptor
api.interceptors.request.use(
  (config) => {
    const token = useAuth.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Remove Content-Type header if FormData is being sent
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Single response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Only logout on 401 errors that aren't from the auth endpoints
    if (
      error.response?.status === 401 &&
      !error.config.url?.includes("/auth/")
    ) {
      await useAuth.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default api;
