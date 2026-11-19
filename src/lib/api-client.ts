/**
 * Master API client for Influencers.com Public Marketplace.
 * Connects to Django REST Framework backend (/api/v1/...).
 */
const resolveApiBase = (): string => {
  let base =
    (typeof import.meta !== "undefined" && (import.meta.env?.["VITE_API_BASE_URL"] as string)) ||
    "http://127.0.0.1:8000/api/v1";
  base = base.trim().replace(/\/+$/, "");
  if (!base.endsWith("/api/v1")) {
    base = `${base}/api/v1`;
  }
  return base;
};

export const API_BASE_URL = resolveApiBase();

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export interface ApiRequestOptions extends RequestInit {
  timeoutMs?: number;
}

export async function apiRequest<T = unknown>(
  endpoint: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
  const timeoutMs = options.timeoutMs ?? 5000;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      const message =
        errorBody?.detail ||
        errorBody?.message ||
        `Server responded with ${response.status} (${response.statusText})`;
      throw new ApiError(response.status, message, errorBody);
    }

    return (await response.json()) as T;
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    throw err;
  }
}
