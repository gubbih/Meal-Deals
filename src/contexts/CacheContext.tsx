import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

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
}

const CacheContext = createContext<CacheContextType | undefined>(undefined);

interface CacheProviderProps {
  children: ReactNode;
  // Default maximum age for cache items (in milliseconds)
  defaultMaxAge?: number;
}

export const CacheProvider: React.FC<CacheProviderProps> = ({
  children,
  defaultMaxAge = 5 * 60 * 1000, // 5 minutes default
}) => {
  // Store cache items in state
  const [cache, setCache] = useState<Record<string, CacheItem<any>>>({});

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
        const newCache = { ...cache };
        delete newCache[key];
        setCache(newCache);
        return null;
      }

      return item.data;
    },
    [cache, defaultMaxAge],
  );

  // Store an item in cache
  const set = useCallback(<T,>(key: string, data: T): void => {
    setCache((prevCache) => ({
      ...prevCache,
      [key]: {
        data,
        timestamp: Date.now(),
        key,
      },
    }));
  }, []);

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

  return (
    <CacheContext.Provider value={{ get, set, invalidate, invalidateAll }}>
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
  },
) => {
  const { get, set } = useCache();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const maxAge = options?.maxAge;
  const enabled = options?.enabled ?? true;

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
    [fetchFunction, get, key, maxAge, options, set],
  );

  // Automatically fetch on mount if enabled
  React.useEffect(() => {
    if (enabled) {
      execute();
    }
  }, [enabled, execute]);

  return {
    data,
    loading,
    error,
    refetch: () => execute(true), // Force fresh fetch
    execute,
  };
};
