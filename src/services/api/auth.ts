import axios from "axios";
import { api, setAuthToken, getAuthToken } from "./client";
import { User } from "../../models/User";

export const signIn = async (
  email: string,
  password: string
): Promise<{ user: User; token: string }> => {
  try {
    const response = await api.post("/api/auth/login", { email, password });
    const { user, token } = response.data.data; // Backend returns {success, data: {user, token}}
    setAuthToken(token);
    return { user, token };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
    throw error;
  }
};

export const signUp = async (
  email: string,
  password: string,
  displayName?: string
): Promise<{ user: User; token: string }> => {
  try {
    const response = await api.post("/api/auth/register", {
      email,
      password,
      displayName,
    });
    const { user, token } = response.data.data; // Backend returns {success, data: {user, token}}
    setAuthToken(token);
    return { user, token };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Registration failed");
    }
    throw error;
  }
};

export const signOut = async (): Promise<void> => {
  try {
    await api.post("/api/auth/logout");
  } catch (error) {
    // Continue with logout even if API call fails
    console.error("Logout API call failed:", error);
  } finally {
    setAuthToken(null);
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const response = await api.get("/api/auth/me");
    return response.data.data; // Backend returns {success, data: <user object>}
  } catch (error) {
    setAuthToken(null);
    return null;
  }
};

export const refreshToken = async () => {
  try {
    const response = await fetch("/api/auth/refresh", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (data.success) {
      // Store the new token
      localStorage.setItem("token", data.data.token);
      return data.data.token;
    }
  } catch (error) {
    console.error("Token refresh failed:", error);
  }
};
