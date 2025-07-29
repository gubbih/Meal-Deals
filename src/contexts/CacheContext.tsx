import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";

// Utility functions for calculating cache durations based on update schedules
export const getCacheMaxAgeForWeeklyUpdates = (
  updateDays: number[]
): number => {
  const now = new Date();
  const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

  // Find the next update day
  let nextUpdateDay: number;
  const futureUpdateDays = updateDays.filter((day) => day > currentDay);

  if (futureUpdateDays.length > 0) {
    nextUpdateDay = Math.min(...futureUpdateDays);
  } else {
    // Next update is next week
    nextUpdateDay = Math.min(...updateDays) + 7;
  }

  // Calculate days until next update
  const daysUntilUpdate = nextUpdateDay - currentDay;

  // Convert to milliseconds and add a small buffer
  const millisecondsUntilUpdate = daysUntilUpdate * 24 * 60 * 60 * 1000;

  // Return cache duration with 10% buffer to ensure freshness
  return Math.max(millisecondsUntilUpdate * 0.9, 60 * 60 * 1000); // Minimum 1 hour
};

// Specific cache durations for different data types
export const CACHE_DURATIONS = {
  // Offers and food components update Monday (1) and Friday (5) nights
  OFFERS: getCacheMaxAgeForWeeklyUpdates([1, 5]), // Monday and Friday
  FOOD_COMPONENTS: getCacheMaxAgeForWeeklyUpdates([1, 5]), // Monday and Friday

  // Meals can change more frequently
  MEALS: 5 * 60 * 1000, // 5 minutes
  MEAL_DETAIL: 10 * 60 * 1000, // 10 minutes

  // User data changes moderately
  USER_DATA: 15 * 60 * 1000, // 15 minutes
} as const;

interface CacheItem<T> {
  data: T;
  timestamp: number;
  key: string;
}

interface CacheContextType {
  get: <T>(key: string, maxAge?: number) => T | null;
  set: <T>(key: string, data: T) => void;
  invalidate: (key: string) => void;
  invalidateAll: () => void;
  getCacheSize: () => number;
  clearExpired: () => void;
}

const CacheContext = createContext<CacheContextType | undefined>(undefined);

interface CacheProviderProps {
  children: ReactNode;
  // Default maximum age for cache items (in milliseconds)
  defaultMaxAge?: number;
  // Maximum number of cache items to store
  maxCacheSize?: number;
  // Whether to persist cache to localStorage
  persistToStorage?: boolean;
}

export const CacheProvider: React.FC<CacheProviderProps> = ({
  children,
  defaultMaxAge = 5 * 60 * 1000, // 5 minutes default
  maxCacheSize = 100, // Maximum 100 cache items
  persistToStorage = true,
}) => {
  // Load initial cache from localStorage if enabled
  const loadCacheFromStorage = (): Record<string, CacheItem<any>> => {
    if (!persistToStorage || typeof window === "undefined") return {};

    try {
      const stored = localStorage.getItem("meal-deals-cache");
      if (stored) {
        const parsed = JSON.parse(stored);
        // Validate and clean expired items on load
        const now = Date.now();
        const cleaned: Record<string, CacheItem<any>> = {};

        Object.entries(parsed).forEach(([key, item]: [string, any]) => {
          if (
            item &&
            typeof item === "object" &&
            typeof item.timestamp === "number" &&
            item.data !== undefined
          ) {
            // Keep non-expired items
            if (now - item.timestamp <= defaultMaxAge * 2) {
              // Allow some grace period
              cleaned[key] = item;
            }
          }
        });

        return cleaned;
      }
    } catch (error) {
      console.warn("Failed to load cache from localStorage:", error);
    }

    return {};
  };

  // Store cache items in state
  const [cache, setCache] =
    useState<Record<string, CacheItem<any>>>(loadCacheFromStorage);

  // Persist cache to localStorage when it changes
  useEffect(() => {
    if (!persistToStorage || typeof window === "undefined") return;

    try {
      localStorage.setItem("meal-deals-cache", JSON.stringify(cache));
    } catch (error) {
      console.warn("Failed to persist cache to localStorage:", error);
    }
  }, [cache, persistToStorage]);

  // Clean up expired items and enforce size limit
  const cleanupCache = useCallback(
    (newCache: Record<string, CacheItem<any>>) => {
      const now = Date.now();
      let cleaned = { ...newCache };

      // Remove expired items
      Object.keys(cleaned).forEach((key) => {
        const item = cleaned[key];
        if (now - item.timestamp > defaultMaxAge * 2) {
          // Grace period for cleanup
          delete cleaned[key];
        }
      });

      // Enforce size limit by removing oldest items
      const entries = Object.entries(cleaned);
      if (entries.length > maxCacheSize) {
        // Sort by timestamp (oldest first) and remove excess
        entries.sort(([, a], [, b]) => a.timestamp - b.timestamp);
        const itemsToRemove = entries.length - maxCacheSize;

        for (let i = 0; i < itemsToRemove; i++) {
          delete cleaned[entries[i][0]];
        }
      }

      return cleaned;
    },
    [defaultMaxAge, maxCacheSize]
  );

  // Get an item from cache, respecting max age
  const get = useCallback(
    <T,>(key: string, maxAge: number = defaultMaxAge): T | null => {
      const item = cache[key];

      if (!item) {
        return null;
      }

      const now = Date.now();
      const isExpired = now - item.timestamp > maxAge;

      if (isExpired) {
        // Clean up expired item
        setCache((prevCache) => {
          const newCache = { ...prevCache };
          delete newCache[key];
          return cleanupCache(newCache);
        });
        return null;
      }

      return item.data;
    },
    [cache, defaultMaxAge, cleanupCache]
  );

  // Store an item in cache
  const set = useCallback(
    <T,>(key: string, data: T): void => {
      setCache((prevCache) => {
        const newCache = {
          ...prevCache,
          [key]: {
            data,
            timestamp: Date.now(),
            key,
          },
        };
        return cleanupCache(newCache);
      });
    },
    [cleanupCache]
  );

  // Invalidate a specific cache item
  const invalidate = useCallback((key: string): void => {
    setCache((prevCache) => {
      const newCache = { ...prevCache };
      delete newCache[key];
      return newCache;
    });
  }, []);

  // Invalidate all cache items
  const invalidateAll = useCallback((): void => {
    setCache({});
  }, []);

  // Get current cache size
  const getCacheSize = useCallback((): number => {
    return Object.keys(cache).length;
  }, [cache]);

  // Manually clear expired items
  const clearExpired = useCallback((): void => {
    const now = Date.now();
    setCache((prevCache) => {
      const cleaned: Record<string, CacheItem<any>> = {};

      Object.entries(prevCache).forEach(([key, item]) => {
        if (now - item.timestamp <= defaultMaxAge) {
          cleaned[key] = item;
        }
      });

      return cleaned;
    });
  }, [defaultMaxAge]);

  return (
    <CacheContext.Provider
      value={{
        get,
        set,
        invalidate,
        invalidateAll,
        getCacheSize,
        clearExpired,
      }}
    >
      {children}
    </CacheContext.Provider>
  );
};

// Custom hook to use the cache context
export const useCache = () => {
  const context = useContext(CacheContext);
  if (context === undefined) {
    throw new Error("useCache must be used within a CacheProvider");
  }
  return context;
};

// Helper hook to fetch data with caching
export const useCachedFetch = <T,>(
  key: string,
  fetchFunction: () => Promise<T>,
  options?: {
    maxAge?: number;
    enabled?: boolean;
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
    backgroundRefresh?: boolean; // Refresh data in background when close to expiry
  }
) => {
  const { get, set } = useCache();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const maxAge = options?.maxAge;
  const enabled = options?.enabled ?? true;
  const backgroundRefresh = options?.backgroundRefresh ?? false;

  // Execute the fetch
  const execute = useCallback(
    async (skipCache = false) => {
      setLoading(true);
      setError(null);

      try {
        // Check cache first unless skipCache is true
        if (!skipCache) {
          const cachedData = get<T>(key, maxAge);
          if (cachedData) {
            setData(cachedData);
            setLoading(false);
            options?.onSuccess?.(cachedData);
            return cachedData;
          }
        }

        // If no cached data or skipCache is true, fetch fresh data
        const freshData = await fetchFunction();
        set(key, freshData);
        setData(freshData);
        options?.onSuccess?.(freshData);
        return freshData;
      } catch (e) {
        const err = e instanceof Error ? e : new Error(String(e));
        setError(err);
        options?.onError?.(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchFunction, get, key, maxAge, options, set]
  );

  // Background refresh when data is close to expiry
  const checkForBackgroundRefresh = useCallback(() => {
    if (!backgroundRefresh || !maxAge) return;

    const cachedData = get<T>(key, maxAge);
    if (cachedData) {
      // If data is in the last 20% of its lifetime, refresh in background
      const item = get<T>(key, maxAge * 5); // Check with extended time
      if (item) {
        // Calculate time remaining
        const now = Date.now();
        const cacheItem = (get as any).cache?.[key];
        if (cacheItem) {
          const timeElapsed = now - cacheItem.timestamp;
          const timeRemaining = maxAge - timeElapsed;

          if (timeRemaining < maxAge * 0.2) {
            // Refresh in background without changing loading state
            fetchFunction()
              .then((freshData) => {
                set(key, freshData);
                setData(freshData);
              })
              .catch(() => {
                // Silently fail background refresh
              });
          }
        }
      }
    }
  }, [backgroundRefresh, maxAge, get, key, fetchFunction, set]);

  // Automatically fetch on mount if enabled
  React.useEffect(() => {
    if (enabled) {
      execute();
    }
  }, [enabled, execute]);

  // Set up background refresh interval
  React.useEffect(() => {
    if (!backgroundRefresh || !maxAge) return;

    const interval = setInterval(
      checkForBackgroundRefresh,
      Math.min(maxAge * 0.1, 30000)
    ); // Check every 10% of max age or 30s max

    return () => clearInterval(interval);
  }, [backgroundRefresh, maxAge, checkForBackgroundRefresh]);

  return {
    data,
    loading,
    error,
    refetch: () => execute(true), // Force fresh fetch
    execute,
  };
};

// Debug hook to inspect cache state
export const useCacheDebug = () => {
  const { getCacheSize, clearExpired } = useCache();

  return {
    cacheSize: getCacheSize(),
    clearExpired,
    logCacheState: () => {
      if (typeof window !== "undefined") {
        console.log("Cache size:", getCacheSize());
        console.log(
          "Cache contents:",
          localStorage.getItem("meal-deals-cache")
        );
      }
    },
  };
};
