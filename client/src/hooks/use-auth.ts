import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import {
  User,
  ProfileUpdateData,
  PasswordUpdateData,
} from "@/types/user.types";
import api from "@/lib/api";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  setToken: (token: string) => void;

  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<void>;
  resetPassword: (
    email: string,
    token: string,
    newPassword: string
  ) => Promise<void>;
  updateProfile: (data: ProfileUpdateData) => Promise<void>;
  updatePassword: (data: PasswordUpdateData) => Promise<void>;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      setToken: (token: string) => {
        set({ token });
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      },

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

          // Call logout endpoint last
          await api.post("/api/auth/logout");

          // Clear auth header
          delete api.defaults.headers.common["Authorization"];

          // Clear state first to prevent interceptor issues
          set({
            user: null,
            token: null,
            isLoading: false,
            error: null,
          });

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
          api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

          console.log(api.defaults.headers.common["Authorization"]);

          console.log("User data:", data.user);

          set({
            user: data.user,
            // token: data.token,
            isLoading: false,
          });
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

      updateProfile: async (data: ProfileUpdateData) => {
        try {
          set({ isLoading: true, error: null });

          const { data: updatedUser } = await api.patch(
            "/api/auth/profile", // should be /api/users/profile
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

      updatePassword: async (data: PasswordUpdateData) => {
        try {
          set({ isLoading: true, error: null });

          await api.post("/api/auth/update-password", data);

          set({ isLoading: false });
        } catch (error) {
          set({
            error: axios.isAxiosError(error)
              ? error.response?.data?.message || "Failed to update password"
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

// Simplified response interceptor - just handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If unauthorized, logout user
    if (error.response?.status === 401) {
      useAuth.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default api;
