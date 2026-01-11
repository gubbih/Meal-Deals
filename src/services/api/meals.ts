import axios from "axios";
import { api, deduplicatedGet } from "./client";
import { Meal } from "../../models/Meal";

interface GetMealsParams {
  page?: number;
  limit?: number;
  search?: string;
  cuisine?: string;
  mealType?: string;
  createdBy?: string;
}

interface GetMealsResponse {
  success: boolean;
  data: {
    meals: Meal[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
      pageSize: number;
    };
  };
}

export const getMeals = async (
  params?: GetMealsParams
): Promise<{ meals: Meal[]; pagination?: any }> => {
  try {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    if (params?.search) searchParams.set("search", params.search);
    if (params?.cuisine) searchParams.set("cuisine", params.cuisine);
    if (params?.mealType) searchParams.set("mealType", params.mealType);
    if (params?.createdBy) searchParams.set("createdBy", params.createdBy);

    const url = `/api/meals${searchParams.toString() ? `?${searchParams}` : ""}`;

    const response = await deduplicatedGet<GetMealsResponse>(url);

    return {
      meals: response.data.meals,
      pagination: response.data.pagination,
    };
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
    console.log("Creating meal with data:", mealData);

    // Check if there's a file to upload
    const hasFile = mealData.image instanceof File;

    let requestData;
    let config = {};

    if (hasFile) {
      // Use FormData for file uploads
      const formData = new FormData();

      // Add all meal data except the image file
      const { image, foodComponents, ...otherData } = mealData;
      Object.entries(otherData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      // Add food component IDs as an array
      if (foodComponents && foodComponents.length > 0) {
        formData.append(
          "foodComponents",
          JSON.stringify(foodComponents.map((fc) => fc.id))
        );
      }

      // Add the image file (we know it's a File because hasFile is true)
      formData.append("image", image as File);

      requestData = formData;
      config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
    } else {
      // Use JSON for URL-based images
      const { foodComponents, ...otherData } = mealData;
      requestData = {
        ...otherData,
        foodComponents: foodComponents?.map((fc) => fc.id) || [],
      };
    }

    const response = await api.post("/api/meals", requestData, config);
    console.log("Create meal response:", response);
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
    // Check if there's a file to upload
    const hasFile = updates.image instanceof File;

    let requestData;
    let config = {};

    if (hasFile) {
      // Use FormData for file uploads
      const formData = new FormData();

      // Add all meal data except the image file
      const { image, foodComponents, ...otherData } = updates;
      Object.entries(otherData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      // Add food component IDs as an array
      if (foodComponents && foodComponents.length > 0) {
        formData.append(
          "foodComponents",
          JSON.stringify(foodComponents.map((fc) => fc.id))
        );
      }

      // Add the image file (we know it's a File because hasFile is true)
      formData.append("image", image as File);

      requestData = formData;
      config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
    } else {
      // Use JSON for URL-based images
      const { foodComponents, ...otherData } = updates;
      requestData = {
        ...otherData,
        foodComponents: foodComponents?.map((fc) => fc.id) || [],
      };
    }

    const response = await api.put(`/api/meals/${id}`, requestData, config);
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
