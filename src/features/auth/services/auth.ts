import { api } from "@/lib/axios";
import { setCookie, getCookie, deleteCookie } from "cookies-next";

// Types
export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  username: string;
  email: string;
  password: string;
  role?: string;
  profilePicture?: string;
}

export interface AuthResponse {
  token: string;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  role?: string;
  profilePicture?: string;
  createdAt?: string;
}

// Auth Service Functions
export const authService = {
  /**
   * Login user
   * POST /auth/login
   */
  login: async (payload: LoginPayload): Promise<string> => {
    try {
      const response = await api.post<AuthResponse>("/auth/login", payload);
      const token = response.data.token;

      // Store token in cookies
      setCookie("token", token, {
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });

      return token;
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  },

  /**
   * Sign up user
   * POST /auth/signup
   */
  signup: async (payload: SignupPayload): Promise<string> => {
    try {
      const response = await api.post<AuthResponse>("/auth/signup", payload);
      const token = response.data.token;

      // Store token in cookies
      setCookie("token", token, {
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });

      return token;
    } catch (error) {
      console.error("Error during signup:", error);
      throw error;
    }
  },

  /**
   * Get authenticated user profile
   * GET /auth/profile
   */
  getProfile: async (): Promise<UserProfile> => {
    try {
      const response = await api.get<UserProfile>("/auth/profile");
      return response.data;
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
  },

  /**
   * Logout user (client-side only)
   */
  logout: async (): Promise<void> => {
    try {
      deleteCookie("token", { path: "/" });
    } catch (error) {
      console.error("Error during logout:", error);
      throw error;
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    if (typeof window === "undefined") return false;
    const token = getCookie("token");
    return !!token;
  },

  /**
   * Get current token
   */
  getToken: (): string | null => {
    if (typeof window === "undefined") return null;
    const token = getCookie("token");
    return token ? String(token) : null;
  },
};

export default authService;
