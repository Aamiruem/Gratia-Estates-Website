import { apiRequest } from "./apiClient";

export const authApi = {
  login: (email, password) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  signup: (name, email, password, setupCode) =>
    apiRequest("/auth/signup", {
      method: "POST",
      body: JSON.stringify({
        name,
        email,
        password,
        setup_code: setupCode,
      }),
    }),

  me: () => apiRequest("/auth/me"),

  async restoreSession() {
    try {
      return await apiRequest("/auth/me");
    } catch (error) {
      if (error.status !== 401) throw error;
      return apiRequest("/auth/refresh", { method: "POST" });
    }
  },

  logout: () => apiRequest("/auth/logout", { method: "POST" }),
};
