import axios, { AxiosError } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

/** Fetch CSRF cookie before state-changing requests */
export async function csrf(): Promise<void> {
  await axios.get(`${API_BASE_URL}/sanctum/csrf-cookie`, {
    withCredentials: true,
  });
}

// ── Response interceptor: dispatch auth event on 401 ──
// Instead of hard-redirecting, we dispatch a custom event so the AuthContext
// can decide whether to redirect (only if the user WAS authenticated).
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("auth:unauthenticated"));
      }
    }
    return Promise.reject(error);
  },
);

// ── Helper: extract error message from Laravel validation/error responses ──
export function extractApiError(error: unknown): string {
  if (error instanceof AxiosError && error.response?.data) {
    const data = error.response.data as {
      message?: string;
      errors?: Record<string, string[]>;
    };
    if (data.errors) {
      const firstError = Object.values(data.errors)[0]?.[0];
      if (firstError) return firstError;
    }
    if (data.message) return data.message;
  }
  if (error instanceof Error) return error.message;
  return "An unexpected error occurred.";
}

// ── Types for standard API responses ──
export interface ApiResponse<T> {
  message?: string;
  data: T;
}

export interface ApiPaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
}

export default api;
