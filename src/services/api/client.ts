import axios from "axios";

// API Configuration
const API_BASE_URL = "http://localhost:3001";
//process.env.REACT_APP_API_BASE_URL || "https://api.cheapmeals.dk";

// Request deduplication - prevent duplicate in-flight requests
const pendingRequests = new Map<string, Promise<any>>();

// Circuit breaker - prevent continuous failed requests
const failedEndpoints = new Map<
  string,
  { count: number; resetAt: number; errorShown: boolean }
>();
const MAX_FAILURES = 2; // Open circuit after 2 failures
const CIRCUIT_RESET_TIME = 60000; // 60 seconds - align with rate limit recovery

// Manual circuit breaker reset (for development/debugging)
export const resetCircuitBreaker = () => {
  failedEndpoints.clear();
  console.log("Circuit breaker manually reset");
};

// Check circuit breaker status
export const getCircuitBreakerStatus = () => {
  const status = Array.from(failedEndpoints.entries()).map(
    ([endpoint, failure]) => ({
      endpoint,
      failures: failure.count,
      resetAt: new Date(failure.resetAt).toISOString(),
      secondsUntilReset: Math.ceil((failure.resetAt - Date.now()) / 1000),
    })
  );
  return status;
};

// Create axios instance with default config
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
  withCredentials: false, // Disable cookies to avoid AWS ALB cookie warnings
});

// Token management
let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("authToken", token);
  } else {
    delete api.defaults.headers.common["Authorization"];
    localStorage.removeItem("authToken");
  }
};
export const getAuthToken = (): string | null => {
  console.log(
    "Current auth token:",
    authToken ? "set: " + authToken : "not set"
  );
  return authToken;
};

// Initialize token from localStorage
const storedToken = localStorage.getItem("authToken");
console.log(
  "Initializing auth token from storage:",
  storedToken ? "found" : "not found"
);
if (storedToken) {
  setAuthToken(storedToken);
}

// Request interceptor for circuit breaker
api.interceptors.request.use(
  (config) => {
    const endpoint = config.url || "";

    // Check circuit breaker
    const failure = failedEndpoints.get(endpoint);
    if (failure) {
      const now = Date.now();
      if (now < failure.resetAt) {
        if (failure.count >= MAX_FAILURES) {
          // Only show error message once
          if (!failure.errorShown) {
            console.error(
              `Too many failed requests to ${endpoint}. Temporarily blocked for ${CIRCUIT_RESET_TIME / 1000}s.`
            );
            failure.errorShown = true;
          }
          throw new axios.Cancel(
            `Service temporarily unavailable. Please try again in ${Math.ceil((failure.resetAt - now) / 1000)} seconds.`
          );
        }
      } else {
        // Reset after timeout
        failedEndpoints.delete(endpoint);
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling auth errors and rate limiting
api.interceptors.response.use(
  (response) => {
    // Clear circuit breaker on success
    const endpoint = response.config.url || "";
    failedEndpoints.delete(endpoint);

    return response;
  },
  (error) => {
    // Track failures for circuit breaker
    if (error.config && error.response) {
      const endpoint = error.config.url || "";
      const status = error.response.status;

      // Track failures for 5xx errors and network errors
      if (status >= 500 || !status) {
        const failure = failedEndpoints.get(endpoint) || {
          count: 0,
          resetAt: 0,
          errorShown: false,
        };
        failure.count++;
        failure.resetAt = Date.now() + CIRCUIT_RESET_TIME;
        failure.errorShown = false; // Reset for new circuit breaker period
        failedEndpoints.set(endpoint, failure);

        if (failure.count >= MAX_FAILURES) {
          console.error(
            `Circuit breaker opened for ${endpoint}. Too many failures (${failure.count}).`
          );
          error.message = `Service temporarily unavailable. Please try again in ${CIRCUIT_RESET_TIME / 1000} seconds.`;
        }
      }
    }

    // Handle 429 Too Many Requests - treat like other failures
    if (error.response?.status === 429) {
      const endpoint = error.config?.url || "";
      const retryAfter = error.response.headers["retry-after"]
        ? parseInt(error.response.headers["retry-after"]) * 1000
        : 900000; // 15 minutes default (matches backend rate limit window)

      // Open circuit breaker for rate limit duration
      const failure = failedEndpoints.get(endpoint) || {
        count: 0,
        resetAt: 0,
        errorShown: false,
      };
      failure.count = MAX_FAILURES; // Immediately open circuit
      failure.resetAt = Date.now() + retryAfter;
      failure.errorShown = false;
      failedEndpoints.set(endpoint, failure);

      console.warn(
        `Rate limit exceeded for ${endpoint}. Retry after ${Math.ceil(retryAfter / 1000)} seconds`
      );
      error.message = `Too many requests. Please wait ${Math.ceil(retryAfter / 60000)} minutes before trying again.`;
    }

    // Handle 401 Unauthorized - only redirect once
    if (error.response?.status === 401) {
      console.warn("Unauthorized. Redirecting to login...");
      setAuthToken(null);
      // Use a flag to prevent multiple redirects
      if (!window.location.pathname.includes("/auth")) {
        window.location.href = "/auth";
      }
    }

    return Promise.reject(error);
  }
);

// Helper function to deduplicate GET requests
export async function deduplicatedGet<T>(url: string): Promise<T> {
  const requestKey = `GET:${url}`;

  // If there's already a pending request for this URL, return that promise
  if (pendingRequests.has(requestKey)) {
    return pendingRequests.get(requestKey);
  }

  // Create new request
  const requestPromise = api
    .get(url)
    .then((response) => {
      pendingRequests.delete(requestKey);
      return response.data;
    })
    .catch((error) => {
      pendingRequests.delete(requestKey);
      throw error;
    });

  // Store the promise
  pendingRequests.set(requestKey, requestPromise);

  return requestPromise;
}

export default api;
