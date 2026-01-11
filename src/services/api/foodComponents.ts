import axios from "axios";
import { deduplicatedGet } from "./client";
import { FoodComponent } from "../../models/FoodComponent";

export const getFoodComponents = async (): Promise<FoodComponent[]> => {
  try {
    const response = await deduplicatedGet<{
      success: boolean;
      data: { foodComponents: FoodComponent[] };
    }>("/api/food-components");
    return response.data.foodComponents;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch food components"
      );
    }
    throw error;
  }
};
