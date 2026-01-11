import { useEffect, useState } from "react";
import { getOffers } from "../services/api";
import { Offer } from "../models/Offer";

// Custom hook til at hente tilbud
export const useOffers = (realTime: boolean = false) => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getOffers()
      .then((data) => setOffers(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [realTime]);

  return { offers, loading, error };
};
