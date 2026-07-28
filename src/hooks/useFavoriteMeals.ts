import { useState, useEffect, useRef } from "react";
import {
  addFavoriteMeal,
  getFavoriteMeals,
  removeFavoriteMeal,
} from "../services/api";
import { useAuth } from "../contexts/AuthContext";

const favoritesCache = new Map<string, string[]>();
const inFlightFavorites = new Map<string, Promise<string[]>>();
type FavoritesListener = (userId: string, favorites: string[]) => void;
const favoritesListeners = new Set<FavoritesListener>();

const updateFavoritesStore = (userId: string, favorites: string[]) => {
  favoritesCache.set(userId, favorites);
  favoritesListeners.forEach((listener) => listener(userId, favorites));
};

const loadFavoritesForUser = async (userId: string): Promise<string[]> => {
  if (favoritesCache.has(userId)) {
    return favoritesCache.get(userId) ?? [];
  }

  const existingRequest = inFlightFavorites.get(userId);
  if (existingRequest) return existingRequest;

  const request = getFavoriteMeals(userId)
    .then((ids) => {
      updateFavoritesStore(userId, ids);
      return ids;
    })
    .finally(() => {
      inFlightFavorites.delete(userId);
    });

  inFlightFavorites.set(userId, request);
  return request;
};

const normalizeFavoriteIds = (rawFavorites: unknown): string[] => {
  if (!Array.isArray(rawFavorites)) return [];

  return rawFavorites
    .map((item) => {
      if (typeof item === "string") return item;
      if (item && typeof item === "object") {
        const obj = item as Record<string, unknown>;
        if (typeof obj.mealId === "string") return obj.mealId;
        if (typeof obj.id === "string") return obj.id;

        const nestedMeal = obj.meal as Record<string, unknown> | undefined;
        if (nestedMeal && typeof nestedMeal.id === "string")
          return nestedMeal.id;
      }
      return null;
    })
    .filter((id): id is string => Boolean(id));
};

const useFavoriteMeals = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, refreshUser } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const pendingMealIdsRef = useRef<Set<string>>(new Set());

  // Update favorites when user changes
  useEffect(() => {
    if (!user) {
      setFavorites([]);
      return;
    }

    let isMounted = true;
    const listener: FavoritesListener = (changedUserId, nextFavorites) => {
      if (isMounted && changedUserId === user.id) {
        setFavorites(nextFavorites);
      }
    };
    favoritesListeners.add(listener);

    const authFavorites = normalizeFavoriteIds(user.favoriteRecipes);
    if (authFavorites.length > 0) {
      setFavorites(authFavorites);
      updateFavoritesStore(user.id, authFavorites);
    }

    loadFavoritesForUser(user.id)
      .then((ids) => {
        if (isMounted) setFavorites(ids);
      })
      .catch((err) => {
        if (isMounted) {
          setError(err instanceof Error ? err.message : String(err));
        }
      });

    return () => {
      isMounted = false;
      favoritesListeners.delete(listener);
    };
  }, [user, user?.id, user?.favoriteRecipes]);

  const addToFavorites = async (mealId: string) => {
    if (!user) {
      setError("User not logged in");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await addFavoriteMeal(user.id, mealId);
      // Optimistically update local state
      setFavorites((prev) => {
        const next = prev.includes(mealId) ? prev : [...prev, mealId];
        updateFavoritesStore(user.id, next);
        return next;
      });
      await refreshUser();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
      // Revert local state on error
      setFavorites((prev) => {
        const next = prev.filter((id) => id !== mealId);
        updateFavoritesStore(user.id, next);
        return next;
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeFromFavorites = async (mealId: string) => {
    if (!user) {
      setError("User not logged in");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await removeFavoriteMeal(user.id, mealId);
      // Optimistically update local state
      setFavorites((prev) => {
        const next = prev.filter((id) => id !== mealId);
        updateFavoritesStore(user.id, next);
        return next;
      });
      await refreshUser();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
      // Revert local state on error
      setFavorites((prev) => {
        const next = prev.includes(mealId) ? prev : [...prev, mealId];
        updateFavoritesStore(user.id, next);
        return next;
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (mealId: string) => {
    if (!user) {
      setError("User not logged in");
      return;
    }

    if (pendingMealIdsRef.current.has(mealId)) {
      return;
    }

    pendingMealIdsRef.current.add(mealId);
    try {
      const cachedFavorites = favoritesCache.get(user.id) ?? favorites;
      const isFavorite = cachedFavorites.includes(mealId);

      if (isFavorite) {
        await removeFromFavorites(mealId);
      } else {
        await addToFavorites(mealId);
      }
    } finally {
      pendingMealIdsRef.current.delete(mealId);
    }
  };

  return {
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    loading,
    error,
    favorites,
  };
};

export default useFavoriteMeals;
