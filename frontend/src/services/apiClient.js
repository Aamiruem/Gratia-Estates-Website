const defaultHost =
  typeof window === "undefined" ? "127.0.0.1" : window.location.hostname;
// Production builds call "/api", which the host (vercel.json) proxies to the backend.
const apiUrl = (
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? "/api"
    : `${typeof window === "undefined" ? "http:" : window.location.protocol}//${defaultHost}:8000`)
)
  .trim()
  .replace(/\/+$/, "");

export async function apiRequest(path, options = {}) {
  let response;
  try {
    response = await fetch(`${apiUrl}${path}`, {
      ...options,
      credentials: "include",
      headers: {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        Accept: "application/json",
        ...options.headers,
      },
    });
  } catch {
    const error = new Error(
      `Cannot reach the Gratia backend at ${apiUrl}. Start it from the backend folder with "uvicorn app.main:app --reload --port 8000", then try again.`,
    );
    error.status = 0;
    throw error;
  }

  if (response.status === 204) return null;

  let data = null;
  try {
    data = await response.json();
  } catch {
    if (response.ok) return null;
  }

  if (!response.ok) {
    const detail = data?.detail;
    const message = Array.isArray(detail)
      ? detail.map((item) => item.msg).join(", ")
      : typeof detail === "string"
        ? detail
        : `Request failed (${response.status}).`;
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return data;
}

export const backendUrl = apiUrl;
