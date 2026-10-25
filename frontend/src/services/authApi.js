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

  // Step 2 of owner sign-in: the 6-digit code sent by email.
  verifyCode: (challengeId, code) =>
    apiRequest("/auth/login/verify", {
      method: "POST",
      body: JSON.stringify({ challenge_id: challengeId, code }),
    }),

  resendCode: (challengeId) =>
    apiRequest("/auth/login/resend", {
      method: "POST",
      body: JSON.stringify({ challenge_id: challengeId }),
    }),

  forgotPassword: (email) =>
    apiRequest("/auth/password/forgot", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  resetPassword: (challengeId, code, newPassword) =>
    apiRequest("/auth/password/reset", {
      method: "POST",
      body: JSON.stringify({ challenge_id: challengeId, code, new_password: newPassword }),
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
