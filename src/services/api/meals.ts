import axios from "axios";
import { api, deduplicatedGet } from "./client";
import { Meal } from "../../models/Meal";

export const getMeals = async (): Promise<Meal[]> => {
  try {
    const response = await deduplicatedGet<{
      success: boolean;
      data: { meals: Meal[] };
    }>("/api/meals");
    return response.data.meals;
  } catch (error) {
    // Check if it's a circuit breaker cancellation
    if (axios.isCancel(error)) {
      throw new Error(
        error.message ||
          "Request blocked by circuit breaker. Please wait and try again."
      );
    }

    if (axios.isAxiosError(error)) {
      // Handle CORS errors (often means rate limit or server error)
      if (!error.response && error.message.includes("Network Error")) {
        throw new Error(
          "Unable to connect to server. The API may be temporarily unavailable or rate-limited."
        );
      }
      throw new Error(error.response?.data?.message || "Failed to fetch meals");
    }
    throw error;
  }
};

export const getMeal = async (id: string): Promise<Meal> => {
  try {
    const response = await api.get(`/api/meals/${id}`);

    // Try different possible response structures
    if (response.data.data?.meal) {
      return response.data.data.meal;
    } else if (response.data.meal) {
      return response.data.meal;
    } else if (response.data.data) {
      return response.data.data;
    } else {
      throw new Error("Unexpected response structure");
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to fetch meal");
    }
    throw error;
  }
};

export const createMeal = async (
  mealData: Omit<Meal, "id" | "createdAt">
): Promise<Meal> => {
  try {
    const response = await api.post("/api/meals", mealData);
    return response.data.data.meal; // Backend returns {success, data: {meal}}
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to create meal");
    }
    throw error;
  }
};

export const updateMeal = async (
  id: string,
  updates: Partial<Meal>
): Promise<Meal> => {
  try {
    const response = await api.put(`/api/meals/${id}`, updates);
    return response.data.data.meal; // Backend returns {success, data: {meal}}
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to update meal");
    }
    throw error;
  }
};

export const deleteMeal = async (id: string): Promise<void> => {
  try {
    await api.delete(`/api/meals/${id}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to delete meal");
    }
    throw error;
  }
};
