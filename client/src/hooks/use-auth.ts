import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import {
  User,
  ProfileUpdateData,
  PasswordUpdateData,
} from "@/types/user.types";
import api from "@/lib/api";

interface SchoolYear {
  id: number;
  year: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  status: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  currentSchoolYear: SchoolYear | null;
  isLoading: boolean;
  error: string | null;
  initialized: boolean;
  setToken: (token: string | null) => void;
  initialize: () => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<boolean>;
  register: (
    email: string,
    password: string,
    name: string,
    departmentId: number
  ) => Promise<void>;
  resetPassword: (
    email: string,
    token: string,
    newPassword: string
  ) => Promise<void>;
  updateProfile: (data: ProfileUpdateData) => Promise<void>;
  updatePassword: (data: PasswordUpdateData) => Promise<void>;
  setCurrentSchoolYear: (schoolYear: SchoolYear | null) => void;
}

const useAuth = create<AuthState>()(
  persist(
    (set, get) => {
      return {
        user: null,
        token: null,
        currentSchoolYear: null,
        isLoading: false,
        error: null,
        initialized: false,

        setToken: (token: string | null) => {
          if (token) {
            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            localStorage.setItem("token", token);
          } else {
            delete api.defaults.headers.common["Authorization"];
            localStorage.removeItem("token");
          }
          set({ token });
        },

        initialize: () => {
          const token = localStorage.getItem("token");
          if (token) {
            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            set({ token, initialized: true });
          } else {
            set({ initialized: true });
          }
        },

        login: async (email: string, password: string) => {
          try {
            set({ isLoading: true, error: null });
            const { data } = await api.post("/api/auth/login", {
              email,
              password,
            });

            if (data.token) {
              get().setToken(data.token);
            }

            set({
              user: data.user,
              currentSchoolYear: data.currentSchoolYear,
              isLoading: false,
              error: null,
            });
          } catch (error) {
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
            set({ isLoading: true, error: null });
            await api.post("/api/auth/logout", {});
            get().setToken(null);
            set({
              user: null,
              currentSchoolYear: null,
              isLoading: false,
              error: null,
            });
            return true;
          } catch (error) {
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
            get().setToken(data.token);
            set({
              user: data.user,
              isLoading: false,
            });
          } catch (error) {
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
              data
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

        setCurrentSchoolYear: (schoolYear: SchoolYear | null) => {
          set({ currentSchoolYear: schoolYear });
        },
      };
    },
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        currentSchoolYear: state.currentSchoolYear,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.initialize();
        }
      },
    }
  )
);

export { useAuth };
