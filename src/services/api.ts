import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

// API Configuration
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BACKEND_URL || "http://localhost:3001/";
const API_TIMEOUT = 10000; // 10 seconds

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add auth token if available
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Handle FormData - remove Content-Type to let browser set it with boundary
    if (config.data instanceof FormData && config.headers) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    // Handle common error cases
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      if (typeof window !== "undefined") {
        localStorage.removeItem("authToken");
        window.location.href = "/login";
      }
    }

    console.error("API Error:", {
      status: error.response?.status,
      message: error.message,
      url: error.config?.url,
    });

    return Promise.reject(error);
  }
);

export default api;
