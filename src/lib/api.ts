const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001/api"

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
  }
}

export const GOOGLE_LOGIN_URL = `${BASE_URL}/auth/google`

async function request<T>(path: string, init?: RequestInit, retry = true): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: "include",
    headers: {
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...(init?.headers ?? {}),
    },
    ...init,
  })

  if (res.status === 401 && retry && !path.startsWith("/auth/")) {
    const refreshed = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    })
    if (refreshed.ok) return request<T>(path, init, false)
    throw new ApiError(401, "Unauthorized")
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new ApiError(res.status, body?.message ?? res.statusText)
  }

  if (res.status === 204) return undefined as T
  const text = await res.text()
  return (text ? JSON.parse(text) : undefined) as T
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "POST",
      body: body === undefined ? undefined : JSON.stringify(body),
    }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "PATCH",
      body: body === undefined ? undefined : JSON.stringify(body),
    }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
}
