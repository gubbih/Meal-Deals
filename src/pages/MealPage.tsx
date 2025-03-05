import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getMeal, getOffers } from "../services/firebase";
import { Meal } from "../models/Meal";
import { Offer } from "../models/Offer";
import { Row } from "../components/TableRows";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useAuth } from "../services/firebase";
import useFavoriteMeals from "../hooks/useFavoriteMeals";
import Toast from "../components/Toast";
import { LoadingSpinner } from "../components/LoadingSpinner";

function MealPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [meal, setMeal] = useState<Meal | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [groupedOffers, setGroupedOffers] = useState<Record<string, Offer[]>>(
    {}
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

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setError("No meal ID provided");
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
        console.error("Error fetching data:", error);
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Process food components and match with offers
  useEffect(() => {
    if (!meal?.foodComponents || offers.length === 0) return;

    try {
      const grouped: Record<string, Offer[]> = {};

      // Process each food component
      meal.foodComponents.forEach((fc) => {
        if (!fc?.category || !fc?.items || !Array.isArray(fc.items)) {
          console.warn("Invalid food component format:", fc);
          return;
        }

        // Process each item in the food component
        fc.items.forEach((item) => {
          // Find offers that match this specific item
          const matchedOffers = offers.filter((offer) => {
            if (!offer.matchedItems || !Array.isArray(offer.matchedItems))
              return false;
            return offer.matchedItems.some(
              (matchItem) =>
                // Case-insensitive match
                matchItem.toLowerCase() === item.toLowerCase()
            );
          });

          // Add matched offers to the grouped object
          if (matchedOffers.length > 0) {
            if (!grouped[item]) {
              grouped[item] = [];
            }

            // Add only unique offers
            matchedOffers.forEach((offer) => {
              const isDuplicate = grouped[item].some(
                (existingOffer) => existingOffer.id === offer.id
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
      setGroupedOffers(grouped);
    } catch (error) {
      console.error("Error processing offers:", error);
      setError("Error processing offers");
    }
  }, [meal, offers]);

  const handleToggleFavorite = async () => {
    if (!user) {
      setToast({ type: "warning", message: "Please sign in to add favorites" });
      return;
    }

    if (!meal || !id) return;

    try {
      if (favorites.includes(id)) {
        await removeFromFavorites(id);
        setToast({ type: "success", message: "Removed from favorites" });
      } else {
        await addToFavorites(id);
        setToast({ type: "success", message: "Added to favorites" });
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      setToast({ type: "error", message: "Failed to update favorites" });
    }
  };

  const handleEdit = () => {
    if (meal && user && (user.uid === meal.createdBy || user.isAdmin)) {
      navigate(`/meal/${id}/edit`);
    } else {
      setToast({
        type: "error",
        message: "You don't have permission to edit this meal",
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
        <p className="text-lg font-medium mb-2">Error</p>
        <p>{error}</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Hjem
        </button>
      </div>
    );
  }

  if (!meal) {
    return (
      <div className="p-4 text-gray-600 dark:text-gray-400 flex flex-col items-center justify-center min-h-64">
        <p className="text-lg font-medium mb-2">Meal not found</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Hjem
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
                  <Link to={`/mealType/${meal.mealType}`}>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                      {meal.mealType}
                    </span>
                  </Link>
                )}
                {meal.mealCuisine && (
                  <Link to={`/cuisine/${meal.mealCuisine}`}>
                    <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-purple-900 dark:text-purple-300">
                      {meal.mealCuisine}
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
                  {isFavorite ? "Remove Favorite" : "Add to Favorites"}
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
                  <span className="hidden sm:inline">Edit Meal</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main content grid */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left column - description */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Beskrivelse
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
          // Part of MealPage.tsx - Improved Table Section
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
              Tilbud på Ingredienser
            </h2>

            <div className="overflow-hidden rounded-lg shadow-md">
              <div className="overflow-x-auto">
                <Table
                  aria-label="tilbudstabel"
                  className="min-w-full divide-y divide-gray-200"
                  size="small"
                >
                  <TableHead className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/40 dark:to-blue-800/40">
                    <TableRow>
                      <TableCell />
                      <TableCell className="px-3 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider dark:text-gray-200">
                        Ingrediens
                      </TableCell>
                      <TableCell className="px-3 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider dark:text-gray-200">
                        Pris
                      </TableCell>
                      <TableCell className="px-3 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider dark:text-gray-200 hidden sm:table-cell">
                        Mængde
                      </TableCell>
                      <TableCell className="px-3 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider dark:text-gray-200 hidden md:table-cell">
                        Tilbud Start
                      </TableCell>
                      <TableCell className="px-3 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider dark:text-gray-200 hidden md:table-cell">
                        Tilbud Slut
                      </TableCell>
                      <TableCell className="px-3 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider dark:text-gray-200">
                        Butik
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                    {meal.foodComponents.flatMap((fc, fcIndex) => {
                      // Handle each item in the food component
                      const foodItems = Array.isArray(fc.items)
                        ? fc.items
                        : [fc.items];

                      return foodItems.map((item, itemIndex) => {
                        // Check if we have offers for this item
                        const offersForItem = groupedOffers[item] || [];

                        if (offersForItem.length > 0) {
                          // Render the row with offers
                          return (
                            <Row
                              key={`${fcIndex}-${itemIndex}`}
                              offers={offersForItem}
                              foodComponentName={{
                                category: fc.category,
                                items: item,
                              }}
                            />
                          );
                        } else {
                          // Render a row showing no offers
                          return (
                            <TableRow
                              key={`${fcIndex}-${itemIndex}-no-offer`}
                              className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                              <TableCell className="px-3 py-4 whitespace-nowrap" />
                              <TableCell
                                component="th"
                                scope="row"
                                className="px-3 py-4 text-sm font-medium text-gray-900 dark:text-gray-200"
                              >
                                <div>
                                  <span className="font-medium">{item}</span>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {fc.category}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell
                                colSpan={4}
                                align="center"
                                className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400"
                              >
                                <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">
                                  Ingen aktuelle tilbud
                                </span>
                              </TableCell>
                              <TableCell className="px-3 py-4 whitespace-nowrap" />
                            </TableRow>
                          );
                        }
                      });
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>

        {/* Right column - meal details */}
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sticky top-20">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white border-b pb-2 border-gray-200 dark:border-gray-700">
              Ingredients
            </h2>

            <div className="space-y-5">
              {meal.foodComponents.map((fc, index) => (
                <div key={index} className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    {fc.category}
                  </h3>
                  <ul className="list-disc list-inside space-y-1 pl-2">
                    {Array.isArray(fc.items) ? (
                      fc.items.map((item, itemIndex) => (
                        <li
                          key={itemIndex}
                          className="text-gray-700 dark:text-gray-300"
                        >
                          {item}
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-700 dark:text-gray-300">
                        {fc.items}
                      </li>
                    )}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                Details
              </h3>
              <dl className="space-y-2">
                {meal.mealType && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600 dark:text-gray-400">
                      Meal Type:
                    </dt>
                    <dd className="font-medium text-gray-900 dark:text-white">
                      {meal.mealType}
                    </dd>
                  </div>
                )}
                {meal.mealCuisine && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600 dark:text-gray-400">
                      Cuisine:
                    </dt>
                    <dd className="font-medium text-gray-900 dark:text-white">
                      {meal.mealCuisine}
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
