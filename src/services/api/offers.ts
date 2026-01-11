import axios from "axios";
import { deduplicatedGet } from "./client";
import { Offer } from "../../models/Offer";

export const getOffers = async (): Promise<Offer[]> => {
  try {
    const response = await deduplicatedGet<{
      success: boolean;
      data: { offers: Offer[] };
    }>("/api/offers");
    return response.data.offers;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch offers"
      );
    }
    throw error;
  }
};
