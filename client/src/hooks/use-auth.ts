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
  accessToken: string | null;
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
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
            accessToken: data.token,
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
        try {
          set({ isLoading: true, error: null });

          // Don't send a request body for logout
          await api.post("/api/auth/logout");

          // Clear user state
          set({ user: null, isLoading: false });

          // Optionally navigate to login
          window.location.href = "/auth/login";
        } catch (error) {
          set({
            error: axios.isAxiosError(error)
              ? error.response?.data?.message || "Failed to logout"
              : "An error occurred",
            isLoading: false,
          });
          console.error("Failed to logout", error);
          throw error;
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

          set({
            user: data.user,
            accessToken: data.token,
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

      resetPassword: async (email: string) => {
        try {
          set({ isLoading: true, error: null });

          await api.post("/api/auth/reset-password", { email });

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
                Authorization: `Bearer ${get().accessToken}`,
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
        accessToken: state.accessToken,
      }),
    }
  )
);

// Add request interceptor to add token to all requests
api.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuth.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Implement token refresh logic here if needed
        // const { data } = await api.post("/api/auth/refresh-token");
        // useAuth.setState({ accessToken: data.token });
        // originalRequest.headers.Authorization = `Bearer ${data.token}`;
        // return api(originalRequest);

        // For now, just logout on 401
        useAuth.getState().logout();
      } catch (error) {
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
