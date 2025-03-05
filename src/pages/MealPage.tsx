import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { useAuth } from "../services/firebase";
import useFavoriteMeals from "../hooks/useFavoriteMeals";
import Toast from "../components/Toast";
import { LoadingSpinner } from "../components/LoadingSpinner";

function MealPage() {
  const { id } = useParams<{ id: string }>();
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

  const isFavorite = id ? favorites.includes(id) : false;

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
          onClick={() => (window.location.href = "/")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Return to Home
        </button>
      </div>
    );
  }

  if (!meal) {
    return (
      <div className="p-4 text-gray-600 dark:text-gray-400 flex flex-col items-center justify-center min-h-64">
        <p className="text-lg font-medium mb-2">Meal not found</p>
        <button
          onClick={() => (window.location.href = "/")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 dark:text-white dark:bg-gray-900">
      {toast && <Toast type={toast.type} message={toast.message} />}

      {/* Mobile friendly meal header */}
      <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8">
        {/* Left column - image and description */}
        <div className="w-full md:w-2/3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold break-words">
              {meal.name}
            </h1>
            <button
              onClick={handleToggleFavorite}
              disabled={favLoading}
              className={`flex items-center px-4 py-2 rounded-lg ${
                isFavorite
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
              } whitespace-nowrap`}
            >
              <svg
                className={`w-5 h-5 ${isFavorite ? "text-white" : "text-gray-800 dark:text-white"} mr-2`}
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
                {isFavorite ? "Favorited" : "Add to Favorites"}
              </span>
            </button>
          </div>

          <div className="rounded-lg overflow-hidden shadow-md mb-5">
            <img
              src={meal.imagePath}
              alt={meal.name}
              className="w-full h-auto rounded-lg object-cover"
            />
          </div>

          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md mb-5">
            <h2 className="text-xl font-bold mb-2">Beskrivelse</h2>
            <p className="text-base">{meal.description}</p>
          </div>
        </div>

        {/* Right column - meal details */}
        <div className="w-full md:w-1/3">
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md mb-5 sticky top-20">
            <div className="flex flex-wrap gap-2 mb-3">
              {meal.mealType && (
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                  {meal.mealType}
                </span>
              )}
              {meal.mealCuisine && (
                <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-purple-900 dark:text-purple-300">
                  {meal.mealCuisine}
                </span>
              )}
            </div>

            <h3 className="text-lg font-bold mb-2">Ting der skal bruges:</h3>
            <ul className="space-y-2">
              {meal.foodComponents.map((fc, index) => (
                <li key={index} className="text-sm">
                  <span className="font-semibold">{fc.category}:</span>{" "}
                  {Array.isArray(fc.items) ? fc.items.join(", ") : fc.items}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Ingredients & Offers Table */}
      <div className="mt-6">
        <h2 className="text-xl md:text-2xl font-bold mb-4">
          Ingredients & Offers
        </h2>

        <div className="overflow-x-auto">
          <TableContainer component={Paper} className="shadow-lg rounded-lg">
            <Table
              aria-label="collapsible table"
              className="min-w-full divide-y divide-gray-200"
              size="small" // Makes the table more compact on mobile
            >
              <TableHead className="bg-gray-50 dark:bg-gray-700">
                <TableRow>
                  <TableCell />
                  <TableCell className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-gray-900 dark:text-gray-200">
                    Ingredient
                  </TableCell>
                  <TableCell className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-gray-900 dark:text-gray-200">
                    Price
                  </TableCell>
                  <TableCell className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-gray-900 dark:text-gray-200 hidden sm:table-cell">
                    Weight
                  </TableCell>
                  <TableCell className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-gray-900 dark:text-gray-200 hidden md:table-cell">
                    Offer Start
                  </TableCell>
                  <TableCell className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-gray-900 dark:text-gray-200 hidden md:table-cell">
                    Offer End
                  </TableCell>
                  <TableCell className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-gray-900 dark:text-gray-200">
                    Store
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
                        <TableRow key={`${fcIndex}-${itemIndex}-no-offer`}>
                          <TableCell className="px-2 py-4 whitespace-nowrap" />
                          <TableCell
                            component="th"
                            scope="row"
                            className="px-2 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200"
                          >
                            {item}
                          </TableCell>
                          <TableCell
                            colSpan={5}
                            align="center"
                            className="px-2 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
                          >
                            <Typography className="font-bold mb-2 text-sm text-gray-900 dark:text-white flex items-center justify-left">
                              Ikke på tilbud lige nu
                            </Typography>
                          </TableCell>
                        </TableRow>
                      );
                    }
                  });
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
}

export default MealPage;
