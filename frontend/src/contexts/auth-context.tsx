"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import api, { csrf } from "@/lib/api";
import type { User } from "@/types/user";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<LoginResult>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (data: ResetPasswordData) => Promise<void>;
  verifyEmail: (email: string, code: string) => Promise<void>;
  resendOtp: (email: string) => Promise<void>;
  setUser: (user: User | null) => void;
  refreshUser: () => Promise<void>;
}

interface LoginResult {
  requiresVerification?: boolean;
  email?: string;
  user?: User;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
  role: "user" | "vendor";
  businessName?: string;
  businessType?: string;
  registrationNumber?: string;
  businessAddress?: string;
}

export interface ResetPasswordData {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

/** Routes that don't require authentication */
const PUBLIC_PATHS = ["/login", "/register", "/verify-email", "/forgot-password", "/reset-password"];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const userRef = useRef<User | null>(null);

  // Keep ref in sync so event listeners always see the current user
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  // Fetch current user from session
  const fetchUser = useCallback(async () => {
    try {
      await csrf();
      const { data } = await api.get("/user");
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check session on mount
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Redirect unauthenticated users away from protected pages
  // (only runs after initial session check completes)
  useEffect(() => {
    if (!isLoading && !user && !isPublicPath(pathname)) {
      router.push("/login");
    }
  }, [isLoading, user, pathname, router]);

  // Listen for auth:unauthenticated events from the API interceptor (401s)
  // This handles session expiry: if ANY API call returns 401 while the user
  // is logged in, we clear state and redirect.
  useEffect(() => {
    const handleUnauthenticated = () => {
      if (userRef.current) {
        setUser(null);
        router.push("/login");
      }
    };
    window.addEventListener("auth:unauthenticated", handleUnauthenticated);
    return () => window.removeEventListener("auth:unauthenticated", handleUnauthenticated);
  }, [router]);

  const login = useCallback(
    async (email: string, password: string, remember = false): Promise<LoginResult> => {
      await csrf();
      try {
        const { data } = await api.post("/login", { email, password, remember });

        if (data.requiresVerification) {
          return { requiresVerification: true, email: data.email };
        }

        setUser(data.user);
        return { user: data.user };
      } catch (error: unknown) {
        if (
          error &&
          typeof error === "object" &&
          "response" in error
        ) {
          const axiosError = error as { response: { status: number; data: { message?: string; requiresVerification?: boolean; email?: string } } };
          if (axiosError.response.status === 403 && axiosError.response.data.requiresVerification) {
            return {
              requiresVerification: true,
              email: axiosError.response.data.email,
            };
          }
          throw new Error(axiosError.response.data.message || "Login failed.");
        }
        throw new Error("An unexpected error occurred.");
      }
    },
    [],
  );

  const register = useCallback(async (data: RegisterData) => {
    await csrf();
    try {
      await api.post("/register", data);
    } catch (error: unknown) {
      if (
        error &&
        typeof error === "object" &&
        "response" in error
      ) {
        const axiosError = error as { response: { data: { message?: string; errors?: Record<string, string[]> } } };
        const errors = axiosError.response.data.errors;
        if (errors) {
          const firstError = Object.values(errors)[0]?.[0];
          throw new Error(firstError || "Registration failed.");
        }
        throw new Error(axiosError.response.data.message || "Registration failed.");
      }
      throw new Error("An unexpected error occurred.");
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/logout");
    } catch {
      // Session may already be expired
    }
    setUser(null);
    router.push("/login");
  }, [router]);

  const forgotPassword = useCallback(async (email: string) => {
    await csrf();
    try {
      await api.post("/forgot-password", { email });
    } catch (error: unknown) {
      if (
        error &&
        typeof error === "object" &&
        "response" in error
      ) {
        const axiosError = error as { response: { data: { message?: string } } };
        throw new Error(axiosError.response.data.message || "Failed to send reset link.");
      }
      throw new Error("An unexpected error occurred.");
    }
  }, []);

  const resetPassword = useCallback(async (data: ResetPasswordData) => {
    await csrf();
    try {
      await api.post("/reset-password", data);
    } catch (error: unknown) {
      if (
        error &&
        typeof error === "object" &&
        "response" in error
      ) {
        const axiosError = error as { response: { data: { message?: string } } };
        throw new Error(axiosError.response.data.message || "Failed to reset password.");
      }
      throw new Error("An unexpected error occurred.");
    }
  }, []);

  const verifyEmail = useCallback(async (email: string, code: string) => {
    await csrf();
    try {
      const { data } = await api.post("/email/verify", {
        email,
        code,
        type: "email_verification",
      });
      setUser(data.user);
    } catch (error: unknown) {
      if (
        error &&
        typeof error === "object" &&
        "response" in error
      ) {
        const axiosError = error as { response: { data: { message?: string } } };
        throw new Error(axiosError.response.data.message || "Invalid verification code.");
      }
      throw new Error("An unexpected error occurred.");
    }
  }, []);

  const resendOtp = useCallback(async (email: string) => {
    await csrf();
    try {
      await api.post("/email/resend", { email });
    } catch (error: unknown) {
      if (
        error &&
        typeof error === "object" &&
        "response" in error
      ) {
        const axiosError = error as { response: { data: { message?: string } } };
        throw new Error(axiosError.response.data.message || "Failed to resend code.");
      }
      throw new Error("An unexpected error occurred.");
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        verifyEmail,
        resendOtp,
        setUser,
        refreshUser: fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
