import axios from "axios";
import { api } from "./client";
import { User } from "../../models/User";

export const updateUser = async (
  userId: string,
  updates: Partial<User>
): Promise<User> => {
  try {
    const response = await api.put(`/api/users/${userId}`, updates);
    return response.data.data.user; // Backend returns {success, data: {user}}
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to update user");
    }
    throw error;
  }
};
