import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getMeal, getOffers } from "../services/firebase";
import { Meal } from "../models/Meal";
import { Offer } from "../models/Offer";
import { Row } from "../components/TableRows";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { useAuth } from "../services/firebase";
import useFavoriteMeals from "../hooks/useFavoriteMeals";
import Toast from "../components/Toast";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { translateCuisine, translateMealType } from "../utils/translationHelpers";

function MealPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [meal, setMeal] = useState<Meal | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [groupedOffers, setGroupedOffers] = useState<Record<string, Offer[]>>(
    {},
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const {
    addToFavorites,
    removeFromFavorites,
    favorites,
    loading: favLoading,
  } = useFavoriteMeals();
  const [toast, setToast] = useState<{
    type: "success" | "error" | "warning" | "info";
    message: string;
  } | null>(null);
  const [selectedStores, setSelectedStores] = useState<string[]>([]);
  const [availableStores, setAvailableStores] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setError(t("mealPage.errors.noMealId"));
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch meal data
        const mealData = await getMeal(id);
        setMeal(mealData);

        // Fetch offers data
        const offersData = await getOffers();
        setOffers(offersData);
      } catch (error) {
        console.error(t("mealPage.errors.fetchingData"), error);
        setError(error instanceof Error ? error.message : t("common.error"));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Extract unique stores from offers
  useEffect(() => {
    if (offers.length > 0) {
      const uniqueStores = [
        ...new Set(offers.map((offer) => offer.store)),
      ].sort();
      setAvailableStores(uniqueStores);

      // Try to load saved store preferences, otherwise select all
      let savedStores: string | null = null;
      try {
        savedStores = localStorage.getItem("selectedStores");
      } catch (error) {
        console.error(t("mealPage.errors.localStorage"), error);
      }
      if (savedStores) {
        try {
          const parsed = JSON.parse(savedStores);
          // Only include stores that exist in current offers
          const validStores = parsed.filter((store: string) =>
            uniqueStores.includes(store),
          );
          setSelectedStores(
            validStores.length > 0 ? validStores : uniqueStores,
          );
        } catch {
          setSelectedStores(uniqueStores);
        }
      } else {
        setSelectedStores(uniqueStores);
      }
    }
  }, [offers]);

  // Save selected stores to localStorage when they change
  useEffect(() => {
    if (selectedStores.length > 0) {
      try {
        localStorage.setItem("selectedStores", JSON.stringify(selectedStores));
      } catch (error) {
        console.error(t("mealPage.errors.saveStores"), error);
      }
    }
  }, [selectedStores]);

  // Process food components and match with offers
  useEffect(() => {
    if (!meal?.foodComponents || offers.length === 0) return;

    try {
      const grouped: Record<string, Offer[]> = {};

      // Filter offers by selected stores
      const filteredOffers =
        selectedStores.length > 0
          ? offers.filter((offer) => selectedStores.includes(offer.store))
          : offers;

      // Process each food component
      meal.foodComponents.forEach((fc) => {
        if (!fc?.category || !fc?.items || !Array.isArray(fc.items)) {
          console.log("Invalid food component format:", fc);
          return;
        }

        // Process each item in the food component
        fc.items.forEach((item) => {
          console.log("Debug meal item:", item);
          filteredOffers.forEach((offer) => {
            console.log("Debug offer:", offer);
          });
          // Find offers that match this specific item from filtered offers
          const matchedOffers = filteredOffers.filter((offer) => {
            // Collect all possible food component names from offer
            let fcList = [
              ...(Array.isArray(offer.foodComponent) ? offer.foodComponent : [offer.foodComponent || ""]),
              ...(Array.isArray(offer.foodcomponent) ? offer.foodcomponent : [offer.foodcomponent || ""])
            ].flat().filter(Boolean);

            return fcList.some((fcName) => {
              const fcNameLower = fcName.toString().toLowerCase();
              const itemName = item.toString().toLowerCase();
              return fcNameLower === itemName;
            });
          });

          // Add matched offers to the grouped object
          if (matchedOffers.length > 0) {
            if (!grouped[item]) {
              grouped[item] = [];
            }

            // Add only unique offers
            matchedOffers.forEach((offer) => {
              const isDuplicate = grouped[item].some(
                (existingOffer) => existingOffer.id === offer.id,
              );

              if (!isDuplicate) {
                grouped[item].push(offer);
              }
            });

            // Sort offers by price (lowest first)
            grouped[item].sort((a, b) => a.price - b.price);
          }
        });
      });

      // Store the grouped offers in state for rendering
      console.log("grouped", grouped);
      setGroupedOffers(grouped);
    } catch (error) {
      console.error(t("mealPage.errors.processingOffers"), error);
      setError(t("mealPage.errors.processingOffers"));
    }
  }, [meal, offers, selectedStores]);

  const handleToggleFavorite = async () => {
    if (!user) {
      setToast({ type: "warning", message: t("mealPage.toast.signInToFavorite") });
      return;
    }

    if (!meal || !id) return;

    try {
      if (favorites.includes(id)) {
        await removeFromFavorites(id);
        setToast({ type: "success", message: t("mealPage.toast.removedFavorite") });
      } else {
        await addToFavorites(id);
        setToast({ type: "success", message: t("mealPage.toast.addedFavorite") });
      }
    } catch (error) {
      console.error(t("mealPage.toast.failedFavorite"), error);
      setToast({ type: "error", message: t("mealPage.toast.failedFavorite") });
    }
  };

  const handleEdit = () => {
    if (meal && user && (user.uid === meal.createdBy || user.isAdmin)) {
      navigate(`/meal/${id}/edit`);
    } else {
      setToast({
        type: "error",
        message: t("mealPage.toast.noEditPermission"),
      });
    }
  };

  const isFavorite = id ? favorites.includes(id) : false;
  const canEdit =
    user && meal ? user.uid === meal.createdBy || user.isAdmin : false;

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8 h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600 dark:text-red-400 flex flex-col items-center justify-center min-h-64">
        <p className="text-lg font-medium mb-2">{t("common.error")}</p>
        <p>{error}</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {t("navigation.home")}
        </button>
      </div>
    );
  }

  if (!meal) {
    return (
      <div className="p-4 text-gray-600 dark:text-gray-400 flex flex-col items-center justify-center min-h-64">
        <p className="text-lg font-medium mb-2">{t("mealPage.errors.mealNotFound")}</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {t("navigation.home")}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 dark:text-white dark:bg-gray-900">
      {toast && <Toast type={toast.type} message={toast.message} />}

      {/* Hero section with image, title and actions */}
      <div className="relative rounded-xl overflow-hidden mb-10">
        {/* Image with gradient overlay */}
        <div className="w-full h-96 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
          <img
            src={meal.imagePath}
            alt={meal.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content positioned over the image */}
        <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                {meal.mealType && (
                  <Link to={`/meal-type/${meal.mealType}`}>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                      {translateMealType(meal.mealType, t)}
                    </span>
                  </Link>
                )}
                {meal.mealCuisine && (
                  <Link to={`/cuisine/${meal.mealCuisine}`}>
                    <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-purple-900 dark:text-purple-300">
                      {translateCuisine(meal.mealCuisine, t)}
                    </span>
                  </Link>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 drop-shadow-md">
                {meal.name}
              </h1>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap gap-3">
              <button
                onClick={handleToggleFavorite}
                disabled={favLoading}
                className={`flex items-center px-4 py-2 rounded-lg ${
                  isFavorite
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-white hover:bg-gray-100 text-gray-800"
                } whitespace-nowrap shadow-md transition-colors`}
              >
                <svg
                  className={`w-5 h-5 ${isFavorite ? "text-white" : "text-gray-800"} mr-2`}
                  fill={isFavorite ? "currentColor" : "none"}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <span className="hidden sm:inline">
                  {isFavorite ? t("mealPage.favorite.remove") : t("mealPage.favorite.add")}
                </span>
              </button>

              {canEdit && (
                <button
                  onClick={handleEdit}
                  className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md transition-colors"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  <span className="hidden sm:inline">{t("mealPage.editMeal")}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Store Filter Section */}
      {availableStores.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t("mealPage.filterBySupermarket")}
          </h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedStores(availableStores)}
              className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-md transition-colors"
            >
              {t("mealPage.selectAll")}
            </button>
            <button
              onClick={() => setSelectedStores([])}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md transition-colors"
            >
              {t("mealPage.clearAll")}
            </button>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
              {availableStores.map((store) => {
                const storeOfferCount = offers.filter(
                  (offer) => offer.store === store,
                ).length;
                return (
                  <button
                    key={store}
                    onClick={() => {
                      if (selectedStores.includes(store)) {
                        setSelectedStores(
                          selectedStores.filter((s) => s !== store),
                        );
                      } else {
                        setSelectedStores([...selectedStores, store]);
                      }
                    }}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      selectedStores.includes(store)
                        ? "bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800 text-green-800 dark:text-green-200 border-2 border-green-300 dark:border-green-700"
                        : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 border-2 border-transparent"
                    }`}
                    title={t("mealPage.offersAvailable", { count: storeOfferCount })}
                  >
                    {store} ({storeOfferCount})
                  </button>
                );
              })}
            </div>
          </div>
          <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
            {selectedStores.length === 0
              ? t("mealPage.noStoresSelected")
              : t("mealPage.showingOffers", { selected: selectedStores.length, total: availableStores.length })}
          </div>
        </div>
      )}

      {/* Main content grid */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left column - description */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              {t("mealPage.description")}
            </h2>
            <div className="prose max-w-none dark:prose-invert">
              {meal.description.split("\n\n").map((paragraph, idx) => (
                <p key={idx} className="mb-4 text-gray-700 dark:text-gray-300">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          {/* Ingredients & Offers Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">
              {t("mealPage.offersOnIngredients")}
            </h2>

            <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
              <Table
                aria-label="tilbudstabel"
                className="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
                size="small"
              >
                <TableBody>
                  {/* Pre-process and sort food components - Those with offers first */}
                  {(() => {
                    // Prepare the data with info about whether items have offers
                    const sortedComponents = meal.foodComponents.flatMap(
                      (fc) => {
                        const foodItems = Array.isArray(fc.items)
                          ? fc.items
                          : [fc.items];

                        return foodItems.map((item) => ({
                          category: fc.category,
                          item,
                          hasOffers: Boolean(groupedOffers[item]?.length > 0),
                          offers: groupedOffers[item] || [],
                        }));
                      },
                    );

                    // Sort: items with offers first, then alphabetically by name
                    sortedComponents.sort((a, b) => {
                      // First sort by whether it has offers
                      if (a.hasOffers && !b.hasOffers) return -1;
                      if (!a.hasOffers && b.hasOffers) return 1;

                      // Then sort alphabetically by item name
                      return a.item.localeCompare(b.item);
                    });

                    // Render the sorted components
                    return sortedComponents.map((component, index) => {
                      console.log("Rendering component:", component);
                      if (component.hasOffers) {
                        // Render row with offers
                        return (
                          <Row
                            key={`sorted-${index}`}
                            offers={component.offers}
                            foodComponentName={{
                              category: component.category,
                              items: component.item,
                            }}
                          />
                        );
                      } else {
                        // Render row showing no offers
                        return (
                          <TableRow
                            key={`sorted-${index}-no-offer`}
                            className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b dark:border-gray-700"
                          >
                            <TableCell
                              colSpan={7}
                              className="p-0 border border-gray-200 dark:border-gray-700"
                            >
                              <div className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/70 transition-colors min-h-[4.5rem]">
                                <div className="grid grid-cols-1 sm:grid-cols-6 gap-3 p-3">
                                  {/* Left side - ingredient info */}
                                  <div className="sm:col-span-4 flex">
                                    <div className="pr-3 pt-1">
                                      <div className="w-8"></div>
                                    </div>

                                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                                      <div className="flex items-start mb-1">
                                        <div className="flex-1">
                                          <span className="text-gray-700 dark:text-gray-300 font-medium line-clamp-2">
                                            {component.item}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="text-sm text-gray-600 dark:text-gray-400">
                                        {component.category}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Right side - no offers message */}
                                  <div className="sm:col-span-2 flex items-center justify-center">
                                    <span className="inline-block px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-full text-xs text-gray-500 dark:text-gray-400">
                                      Ingen aktuelle tilbud
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      }
                    });
                  })()}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {/* Right column - meal details */}
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white border-b pb-2 border-gray-200 dark:border-gray-700">
              {t("mealPage.ingredients")}
            </h2>

            <div className="space-y-5">
              {(() => {
                // Group items by category
                const groupedByCategory: Record<string, string[]> = {};
                meal.foodComponents.forEach((fc) => {
                  if (!groupedByCategory[fc.category]) {
                    groupedByCategory[fc.category] = [];
                  }
                  if (Array.isArray(fc.items)) {
                    groupedByCategory[fc.category].push(...fc.items);
                  } else {
                    groupedByCategory[fc.category].push(fc.items);
                  }
                });
                return Object.entries(groupedByCategory).map(
                  ([category, items]) => (
                    <div key={category} className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                        {category}
                      </h3>
                      <ul className="list-disc list-inside space-y-1 pl-2">
                        {items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ),
                );
              })()}
            </div>

            <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                {t("mealPage.details")}
              </h3>
              <dl className="space-y-2">
                {meal.mealType && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600 dark:text-gray-400">
                      {t("mealPage.mealType")}
                    </dt>
                    <dd className="font-medium text-gray-900 dark:text-white">
                      {translateMealType(meal.mealType, t)}
                    </dd>
                  </div>
                )}
                {meal.mealCuisine && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600 dark:text-gray-400">
                      {t("mealPage.mealCuisine")}
                    </dt>
                    <dd className="font-medium text-gray-900 dark:text-white">
                      {translateCuisine(meal.mealCuisine, t)}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MealPage;
