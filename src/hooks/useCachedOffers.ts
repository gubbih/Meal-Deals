import { Offer } from "../models/Offer";
import { getOffers } from "../services/firebase";
import { useCachedFetch, CACHE_DURATIONS } from "../contexts/CacheContext";

// Cache key for offers
const OFFERS_CACHE_KEY = "offers";

const useCachedOffers = () => {
  const { data, loading, error, refetch } = useCachedFetch<Offer[]>(
    OFFERS_CACHE_KEY,
    getOffers,
    {
      maxAge: CACHE_DURATIONS.OFFERS,
      enabled: true,
    },
  );

  return {
    offers: data || [],
    loading,
    error: error?.message || null,
    refetch,
  };
};

export default useCachedOffers;
