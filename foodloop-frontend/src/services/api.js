import axios from "axios";
import { handleMockRequest } from "./mockBackend";

const isNetlifyHost =
  typeof window !== "undefined" &&
  (window.location.hostname.endsWith("netlify.app") ||
    window.location.hostname.includes("deploy-preview") ||
    window.location.hostname.includes("localhost-demo"));

const defaultBaseURL = process.env.REACT_APP_API_URL || "/api";

const api = axios.create({
  baseURL: defaultBaseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const storedUser = localStorage.getItem("foodloopUser");

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      } catch {
        // ignore JSON parse error
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// If on Netlify (and no explicit remote backend URL is provided), route directly to mock engine
if (
  isNetlifyHost &&
  (!process.env.REACT_APP_API_URL || process.env.REACT_APP_API_URL === "/api")
) {
  api.defaults.adapter = async (config) => {
    return handleMockRequest(config);
  };
} else {
  // If response returns HTML (e.g. Netlify/SPA redirected /api/* to index.html)
  api.interceptors.response.use(
    (response) => {
      if (
        typeof response.data === "string" &&
        response.data.trim().startsWith("<!DOCTYPE html")
      ) {
        return handleMockRequest(response.config);
      }
      return response;
    },
    async (error) => {
      // Seamless fallback when backend is offline or network fails
      const shouldFallback =
        !error.response ||
        error.code === "ERR_NETWORK" ||
        error.code === "ECONNABORTED" ||
        [404, 502, 503, 504].includes(error.response?.status) ||
        (error.response &&
          typeof error.response.data === "string" &&
          error.response.data.trim().startsWith("<!DOCTYPE html"));

      if (shouldFallback && error.config) {
        try {
          return await handleMockRequest(error.config);
        } catch (mockError) {
          return Promise.reject(mockError);
        }
      }
      return Promise.reject(error);
    }
  );
}

export default api;
