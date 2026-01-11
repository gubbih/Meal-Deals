import axios from "axios";
import { api } from "./client";

export const getFavoriteMeals = async (userId: string): Promise<string[]> => {
  try {
    const response = await api.get(`/api/users/${userId}/favorites`);
    return response.data.data.favorites; // Backend returns {success, data: {favorites}}
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch favorite meals"
      );
    }
    throw error;
  }
};

export const addFavoriteMeal = async (
  userId: string,
  mealId: string
): Promise<void> => {
  try {
    await api.post(`/api/users/${userId}/favorites`, { mealId });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to add favorite meal"
      );
    }
    throw error;
  }
};

export const removeFavoriteMeal = async (
  userId: string,
  mealId: string
): Promise<void> => {
  try {
    await api.delete(`/api/users/${userId}/favorites/${mealId}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to remove favorite meal"
      );
    }
    throw error;
  }
};
