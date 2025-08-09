import { create } from "zustand";

interface User {
  sessionId: string;
  userId: string;
  username: string;
  password: string;
  name: string;
  role: string;
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };
  updatedAt: {
    _seconds: number;
    _nanoseconds: number;
  };
  hwid: string;
  lastLogin: {
    _seconds: number;
    _nanoseconds: number;
  };
  lastLogout: {
    _seconds: number;
    _nanoseconds: number;
  };
}

interface AuthState {
  // User data
  user: User | null;
  isAuthenticated: boolean;

  // Loading states
  isLoading: boolean;
  isLoggingIn: boolean;
  isLoggingOut: boolean;

  // Error states
  error: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setLoggingIn: (loggingIn: boolean) => void;
  setLoggingOut: (loggingOut: boolean) => void;
  setError: (error: string | null) => void;

  // Login action
  login: (username: string, password: string) => Promise<void>;

  // Logout action
  logout: () => Promise<void>;

  // Clear auth state
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isLoggingIn: false,
  isLoggingOut: false,
  error: null,

  // Setters
  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      error: null,
    }),

  setLoading: (isLoading) => set({ isLoading }),

  setLoggingIn: (isLoggingIn) => set({ isLoggingIn }),

  setLoggingOut: (isLoggingOut) => set({ isLoggingOut }),

  setError: (error) => set({ error }),

  // Login action
  login: async (username: string, password: string) => {
    try {
      set({ isLoggingIn: true, error: null });

      const response = await window.electron.login({ username, password });

      if (response?.sessionId && response?.userId) {
        // Create a minimal user object from the response
        const user: User = {
          sessionId: response.sessionId,
          userId: response.userId,
          username: username,
          password: "", // Don't store password
          name: "", // Will be empty as not returned by current API
          role: "", // Will be empty as not returned by current API
          createdAt: { _seconds: 0, _nanoseconds: 0 },
          updatedAt: { _seconds: 0, _nanoseconds: 0 },
          hwid: "", // Will be empty as not returned by current API
          lastLogin: { _seconds: 0, _nanoseconds: 0 },
          lastLogout: { _seconds: 0, _nanoseconds: 0 },
        };

        set({
          user,
          isAuthenticated: true,
          isLoggingIn: false,
          error: null,
        });
      } else {
        throw new Error("Invalid login response");
      }
    } catch (error) {
      set({
        isLoggingIn: false,
        error: error instanceof Error ? error.message : "Login failed",
      });
      throw error;
    }
  },

  // Logout action
  logout: async () => {
    try {
      const { user } = get();
      set({ isLoggingOut: true, error: null });

      if (user) {
        await window.electron.logout({
          sessionId: user.sessionId,
          userId: user.userId,
        });
      }

      set({
        user: null,
        isAuthenticated: false,
        isLoggingOut: false,
        error: null,
      });
    } catch (error) {
      set({
        isLoggingOut: false,
        error: error instanceof Error ? error.message : "Logout failed",
      });
      throw error;
    }
  },

  // Clear auth state
  clearAuth: () =>
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isLoggingIn: false,
      isLoggingOut: false,
      error: null,
    }),
}));
