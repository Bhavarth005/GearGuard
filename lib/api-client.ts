const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"
).replace(/\/$/, "");

export class ApiError extends Error {
  status?: number;
  details?: unknown;

  constructor(message: string, status?: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

export interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: HeadersInit;
  auth?: boolean;
  signal?: AbortSignal;
}

const isJson = (
  body: unknown
): body is Record<string, unknown> | unknown[] | string => {
  return typeof body === "object" || typeof body === "string";
};

const getStoredToken = () => {
  if (typeof window === "undefined") {
    return null;
  }
  return localStorage.getItem("authToken");
};

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", body, headers, auth = true, signal } = options;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${API_BASE_URL}${normalizedPath}`;

  const requestHeaders = new Headers(headers);
  const hasJsonBody =
    body !== undefined && !(body instanceof FormData) && isJson(body);

  if (hasJsonBody && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }

  if (auth) {
    const token = getStoredToken();
    if (token) {
      requestHeaders.set("Authorization", `Bearer ${token}`);
    }
  }

  try {
    const response = await fetch(url, {
      method,
      headers: requestHeaders,
      body: hasJsonBody
        ? JSON.stringify(body)
        : (body as BodyInit | null | undefined),
      signal,
    });

    const responseText = await response.text();
    const data = responseText
      ? (JSON.parse(responseText) as T)
      : (undefined as T);

    if (!response.ok) {
      const detailMessage =
        typeof data === "object" &&
        data !== null &&
        "detail" in (data as Record<string, unknown>)
          ? ((data as Record<string, unknown>).detail as string)
          : undefined;
      throw new ApiError(
        detailMessage ?? response.statusText,
        response.status,
        data
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }

    const message = error instanceof Error ? error.message : "Unexpected error";
    throw new ApiError(message);
  }
}
