import axios from "axios";

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || "/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

// Attach JWT token from localStorage to every outgoing request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("codementor_token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // If unauthorized on protected route, clean expired token
      if (window.location.pathname !== "/login" && window.location.pathname !== "/register") {
        localStorage.removeItem("codementor_token");
        localStorage.removeItem("codementor_user");
      }
    }
    return Promise.reject(error);
  }
);
