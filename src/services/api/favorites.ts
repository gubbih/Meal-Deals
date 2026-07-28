import axios from "axios";
import { api } from "./client";

export const getFavoriteMeals = async (userId: string): Promise<string[]> => {
  try {
    const response = await api.get(`/api/users/${userId}/favorites`);

    const payload = response.data?.data;
    const rawFavorites = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.favorites)
        ? payload.favorites
        : [];

    return rawFavorites
      .map((item: unknown): string | null => {
        if (typeof item === "string") return item;
        if (!item || typeof item !== "object") return null;

        const obj = item as Record<string, unknown>;
        if (typeof obj.mealId === "string") return obj.mealId;
        if (typeof obj.id === "string") return obj.id;

        const meal = obj.meal as Record<string, unknown> | undefined;
        if (meal && typeof meal.id === "string") return meal.id;

        return null;
      })
        .filter((id: string | null): id is string => Boolean(id));
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
