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

function MealPage() {
  const { id } = useParams<{ id: string }>();
  const [meal, setMeal] = useState<Meal | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const {
    addToFavorites,
    removeFromFavorites,
    favorites,
    loading: favLoading,
  } = useFavoriteMeals();
  const [toast, setToast] = useState<{
    type: "success" | "error" | "warning";
    message: string;
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const mealData = await getMeal(id);
        setMeal(mealData);
        const offersData = await getOffers();
        setOffers(offersData);
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (!meal?.foodComponents || offers.length === 0) return;

    const grouped: Record<string, Offer[]> = {};

    meal.foodComponents.forEach((fc) => {
      if (!fc?.category || !fc?.items) return;
      const foodItems = Array.isArray(fc.items) ? fc.items : [fc.items];

      const matchedOffers = offers.filter((offer) =>
        (offer.matchedItems ?? []).some((item) => foodItems.includes(item))
      );

      matchedOffers.forEach((offer) => {
        if (!grouped[offer.name]) {
          grouped[offer.name] = [];
        }
        if (
          !grouped[offer.name].some(
            (o) => o.price === offer.price && o.name === offer.name
          )
        ) {
          grouped[offer.name].push(offer);
        }
      });
    });
    // Sort each group by price (lowest to highest)
    Object.keys(grouped).forEach((key) => {
      grouped[key].sort((a, b) => a.price - b.price);
    });
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
      setToast({ type: "error", message: "Failed to update favorites" });
    }
  };

  const isFavorite = id ? favorites.includes(id) : false;

  if (loading || !meal) return <div>Loading...</div>;

  return (
    <div className="p-4 dark:text-white dark:bg-gray-900">
      {toast && <Toast type={toast.type} message={toast.message} />}
      <div className="flex flex-col md:flex-row">
        <div className="md:w-3/4 m-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">{meal.name}</h1>
            <button
              onClick={handleToggleFavorite}
              disabled={favLoading}
              className={`flex items-center px-4 py-2 rounded-lg ${
                isFavorite
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
              }`}
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
              {isFavorite ? "Favorited" : "Add to Favorites"}
            </button>
          </div>
          <img
            src={meal.imagePath}
            alt={meal.name}
            className="rounded-lg shadow-md max-w-full h-auto"
          />
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md mt-4">
            <h1 className="text-2xl font-bold mb-2">Beskrivelse</h1>
            <p className="text-lg mb-2">{meal.description}</p>
          </div>
        </div>
        <div className="md:w-2/4 md:pl-8">
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md mb-4">
            <p className="text-md mb-2 font-semibold">{meal.mealType}</p>
            <p className="text-md mb-4 italic">{meal.mealCuisine}</p>
            <p className="text-lg font-bold mb-2">Ting der skal bruges:</p>
            <ul className="list-disc list-inside">
              {meal.foodComponents.map((fc, index) => (
                <li key={index} className="text-md mb-1">
                  <span className="font-semibold">{fc.category}</span> -{" "}
                  {fc.items}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <h2 className="text-2xl font-bold ">Ingredients & Offers</h2>

        <TableContainer component={Paper} className="shadow-lg rounded-lg">
          <Table
            aria-label="collapsible table"
            className="min-w-full divide-y divide-gray-200"
          >
            <TableHead className="bg-gray-50 dark:bg-gray-700">
              <TableRow>
                <TableCell />
                <TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-gray-900 dark:text-gray-200">
                  Ingredient
                </TableCell>
                <TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-gray-900 dark:text-gray-200">
                  Price
                </TableCell>
                <TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-gray-900 dark:text-gray-200">
                  Weight
                </TableCell>
                <TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-gray-900 dark:text-gray-200">
                  Offer Start
                </TableCell>
                <TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-gray-900 dark:text-gray-200">
                  Offer End
                </TableCell>
                <TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-gray-900 dark:text-gray-200">
                  Store
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              {meal.foodComponents.map((fc, index) => {
                const foodItems = Array.isArray(fc.items)
                  ? fc.items
                  : [fc.items];

                const groupedOffers: Record<string, Offer[]> = {};
                offers.forEach((offer) => {
                  if (
                    (offer.matchedItems ?? []).some((item) =>
                      foodItems.includes(item)
                    )
                  ) {
                    const key =
                      (offer.matchedItems ?? []).find((item) =>
                        foodItems.includes(item)
                      ) || offer.name;
                    if (!groupedOffers[key]) {
                      groupedOffers[key] = [];
                    }
                    groupedOffers[key].push(offer);
                  }
                });

                return (
                  <React.Fragment key={index}>
                    {Object.keys(groupedOffers).length > 0 ? (
                      Object.entries(groupedOffers).map(([name, meal], idx) => (
                        <Row
                          key={`${index}-${idx}`}
                          offers={groupedOffers[name]}
                          foodComponentName={fc}
                        />
                      ))
                    ) : (
                      <TableRow>
                        <TableCell className="px-6 py-4 whitespace-nowrap" />
                        <TableCell
                          component="th"
                          scope="row"
                          className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200"
                        >
                          {foodItems.join(", ")}
                        </TableCell>
                        <TableCell
                          colSpan={5}
                          align="center"
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
                        >
                          <Typography className="font-bold mb-2 text-sm text-gray-900 dark:text-white flex items-center justify-left">
                            Ikke på tilbud lige nu
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default MealPage;
