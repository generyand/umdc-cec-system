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
  (response) => {
    // Check if there's a new token in the response header
    const newToken = response.headers["x-new-token"];
    if (newToken) {
      // Update the token in your auth state
      useAuth.getState().setToken(newToken);

      // Update the token in localStorage if you're using it
      localStorage.setItem("token", newToken);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If the error is due to an expired token and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Get the new token from the response header
        const newToken = error.response.headers["x-new-token"];
        if (newToken) {
          // Update the token in your auth state
          useAuth.getState().setToken(newToken);

          // Update the authorization header
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;

          // Retry the original request with the new token
          return api(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, log out the user
        useAuth.getState().logout();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
