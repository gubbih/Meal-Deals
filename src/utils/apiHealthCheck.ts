import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "https://api.mealdeals.com";

interface HealthCheckResponse {
  status: "healthy" | "unhealthy";
  timestamp?: string;
  error?: string;
}

export const checkAPIHealth = async (): Promise<HealthCheckResponse> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/health`, {
      timeout: 5000, // 5 second timeout
    });

    return {
      status: "healthy",
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("API Health Check Failed:", error);
    return {
      status: "unhealthy",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const checkAPIConnection = async (): Promise<boolean> => {
  const health = await checkAPIHealth();
  return health.status === "healthy";
};
