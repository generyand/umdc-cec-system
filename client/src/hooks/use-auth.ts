import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "focal-person";
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<boolean | undefined>;
  register: (email: string, password: string, name: string) => Promise<void>;
  resetPassword: (
    email: string,
    token: string,
    newPassword: string
  ) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });

          const { data } = await api.post("/api/auth/login", {
            email,
            password,
          });

          // Update axios default authorization header
          api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

          set({
            user: data.user,
            token: data.token,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: axios.isAxiosError(error)
              ? error.response?.data?.message || "Failed to login"
              : "An error occurred",
            isLoading: false,
          });
        }
      },

      logout: async () => {
        const currentState = get();

        // Prevent recursive state updates and duplicate logouts
        if (currentState.isLoading || !currentState.user) {
          return false;
        }

        try {
          set({ isLoading: true, error: null });

          // Clear state first to prevent interceptor issues
          set({
            user: null,
            token: null,
            isLoading: false,
            error: null,
          });

          // Clear auth header
          delete api.defaults.headers.common["Authorization"];

          // Call logout endpoint last
          await api.post("/api/auth/logout");

          return true;
        } catch (error) {
          console.error("Logout error:", error);
          // Don't restore state on error, just update error message
          set({
            error: axios.isAxiosError(error)
              ? error.response?.data?.message || "Failed to logout"
              : "An error occurred",
            isLoading: false,
          });

          return false;
        }
      },

      register: async (email: string, password: string, name: string) => {
        try {
          set({ isLoading: true, error: null });

          const { data } = await api.post("/api/auth/register", {
            email,
            password,
            name,
          });

          // Update axios default authorization header
          // api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

          // set({
          //   user: data.user,
          //   token: data.token,
          //   isLoading: false,
          // });
        } catch (error) {
          set({
            error: axios.isAxiosError(error)
              ? error.response?.data?.message || "Failed to register"
              : "An error occurred",
            isLoading: false,
          });
        }
      },

      resetPassword: async (
        email: string,
        token: string,
        newPassword: string
      ) => {
        try {
          set({ isLoading: true, error: null });

          await api.post("/api/auth/reset-password", {
            email,
            token,
            newPassword,
          });

          set({ isLoading: false });
        } catch (error) {
          set({
            error: axios.isAxiosError(error)
              ? error.response?.data?.message || "Failed to reset password"
              : "An error occurred",
            isLoading: false,
          });
        }
      },

      updateProfile: async (data: Partial<User>) => {
        try {
          set({ isLoading: true, error: null });

          const { data: updatedUser } = await api.patch(
            "/api/auth/profile",
            data,
            {
              headers: {
                Authorization: `Bearer ${get().token}`,
              },
            }
          );

          set({
            user: updatedUser,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: axios.isAxiosError(error)
              ? error.response?.data?.message || "Failed to update profile"
              : "An error occurred",
            isLoading: false,
          });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);

// Add request interceptor to add token to all requests
api.interceptors.request.use(
  (config) => {
    const { token } = useAuth.getState();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add refresh token functionality to response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/logout") &&
      !originalRequest.url?.includes("/refresh-token")
    ) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const { data } = await api.post("/api/auth/refresh-token");
        const { token } = data;

        // Update auth store with new token
        useAuth.setState({ token });

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, logout
        await useAuth.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
