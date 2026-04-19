// Frontend/src/api/axios.ts
import axios from "axios";

const api = axios.create({
  // This ensures it uses Render in production and localhost during development
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://ai-enterprise-workflow-suite.onrender.com/api",
});

// 🔐 Attach real JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  // Guard: reject anything that isn't a 3-part JWT (xxx.yyy.zzz)
  if (token && token !== "undefined" && token.split('.').length === 3) {
    config.headers.Authorization = `Bearer ${token}`;
  } else if (token) {
    // Stale / malformed token — purge it immediately
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  return config;
});

// ⚠️ Auto-logout on 401 / 403 — clears bad token and redirects to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Hard reload sends user back to login screen
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default api;