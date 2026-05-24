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
  profilePicture?: File;
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
      const body = new FormData();
      body.append("username", payload.username);
      body.append("email", payload.email);
      body.append("password", payload.password);
      if (payload.role) body.append("role", payload.role);
      if (payload.profilePicture) body.append("profilePicture", payload.profilePicture);
      const response = await api.post<AuthResponse>("/auth/signup", body);
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
   * Decodes JWT to extract user ID, then GET /user/:id
   */
  getProfile: async (): Promise<UserProfile> => {
    try {
      const token = getCookie("token");
      if (!token) throw new Error("No token found");

      // Decode JWT payload (base64url) — no library needed, just reading claims
      const payloadB64 = String(token).split(".")[1];
      const payload = JSON.parse(
        atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/")),
      );
      const userId: string = payload.sub;

      const response = await api.get<any>(`/user/${userId}`);
      const u = response.data;
      return {
        id: u._id ?? u.id ?? userId,
        username: u.username,
        email: u.email,
        role: u.role?.name ?? u.role,
        profilePicture: u.profilePicture,
        createdAt: u.createdAt,
      };
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
