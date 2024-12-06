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
        console.log("Setting token:", token);
        set({ token });
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        console.log(
          "Current Authorization header:",
          api.defaults.headers.common["Authorization"]
        );
      },

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });

          const { data } = await api.post("/api/auth/login", {
            email,
            password,
          });

          console.log("Login response data:", {
            user: data.user,
            token: data.token,
          });

          set({
            user: data.user,
            token: data.token,
            isLoading: false,
          });

          api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
          console.log("Auth state after login:", {
            token: get().token,
            authHeader: api.defaults.headers.common["Authorization"],
          });
        } catch (error) {
          console.error("Login error:", error);
          set({
            error: axios.isAxiosError(error)
              ? error.response?.data?.message || "Failed to login"
              : "An error occurred",
            isLoading: false,
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          const currentState = get();
          console.log("Current state before logout:", {
            user: currentState.user,
            token: currentState.token,
            authHeader: api.defaults.headers.common["Authorization"],
          });

          if (currentState.isLoading || !currentState.user) {
            return false;
          }

          set({ isLoading: true, error: null });

          // Send empty object instead of null
          await api.post(
            "/api/auth/logout",
            {},
            {
              headers: {
                Authorization: `Bearer ${currentState.token}`,
              },
            }
          );

          // Clear state and headers after successful logout
          set({
            user: null,
            token: null,
            isLoading: false,
            error: null,
          });

          delete api.defaults.headers.common["Authorization"];

          console.log("Logout successful, cleared auth state:", {
            currentUser: get().user,
            currentToken: get().token,
            authHeader: api.defaults.headers.common["Authorization"],
          });

          return true;
        } catch (error) {
          console.error("Logout error:", error);
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

          console.log("Register response data:", {
            user: data.user,
            token: data.token,
          });

          set({
            user: data.user,
            token: data.token,
            isLoading: false,
          });

          api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
          console.log("Auth state after register:", {
            token: get().token,
            authHeader: api.defaults.headers.common["Authorization"],
          });
        } catch (error) {
          console.error("Register error:", error);
          set({
            error: axios.isAxiosError(error)
              ? error.response?.data?.message || "Failed to register"
              : "An error occurred",
            isLoading: false,
          });
          throw error;
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
            `/api/users/${get().user?.id}/profile`,
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
      partialize: (state) => {
        console.log("Persisting auth state:", {
          user: state.user,
          token: state.token,
        });
        return {
          user: state.user,
          token: state.token,
        };
      },
    }
  )
);

// Log initial state when the store is created
console.log("Initial auth state:", useAuth.getState());

export default api;
