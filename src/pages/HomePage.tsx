import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getMeals } from "../services/firebase";
import { Meal } from "../models/Meal";
import useDeleteMeal from "../hooks/useDeleteMeal";
import Toast from "../components/Toast";
import Modal from "../components/Modal";
import { useAuth } from "../services/firebase";
import useFavoriteMeals from "../hooks/useFavoriteMeals";
import FavoriteButton from "../components/FavoriteButton";

function HomePage() {
  const location = useLocation();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [mealToDelete, setMealToDelete] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    type: "success" | "error" | "warning" | "info";
    message: string;
  } | null>(location.state?.toast || null);
  const { handleDeleteMeal } = useDeleteMeal();
  const { user } = useAuth();
  const { favorites, addToFavorites, removeFromFavorites } = useFavoriteMeals();
  const [localFavorites, setLocalFavorites] = useState<string[]>(favorites);

  useEffect(() => {
    fetchMeals();
  }, []);

  useEffect(() => {
    setLocalFavorites(favorites);
  }, [favorites]);

  const fetchMeals = async () => {
    const data = await getMeals();
    setMeals(data);
  };

  const handleDelete = (mealId: string) => {
    setMealToDelete(mealId);
    setIsModalVisible(true);
  };

  const confirmDelete = async () => {
    if (mealToDelete) {
      try {
        await handleDeleteMeal(mealToDelete);
        setToast({ type: "success", message: "Ret blev succesfuldt slettet!" });
        fetchMeals();
      } catch (error) {
        setToast({
          type: "error",
          message: "Der opstod en fejl under sletning!",
        });
      } finally {
        setIsModalVisible(false);
        setMealToDelete(null);
      }
    }
  };

  const cancelDelete = () => {
    setIsModalVisible(false);
    setMealToDelete(null);
  };

  const handleToggleFavorite = async (
    mealId: string,
    event: React.MouseEvent,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (!user) {
      setToast({ type: "warning", message: "Please sign in to add favorites" });
      return;
    }

    try {
      if (localFavorites.includes(mealId)) {
        await removeFromFavorites(mealId);
        setLocalFavorites(localFavorites.filter((id) => id !== mealId));
        setToast({ type: "info", message: "Removed from favorites" });
      } else {
        await addToFavorites(mealId);
        setLocalFavorites([...localFavorites, mealId]);
        setToast({ type: "success", message: "Added to favorites" });
      }
    } catch (error) {
      setToast({ type: "error", message: "Failed to update favorites" });
    }
  };

  return (
    <div className="p-4">
      {toast && <Toast type={toast.type} message={toast.message} />}
      {meals.length === 0 ? (
        <CreateNewMealButton />
      ) : (
        <MealGrid
          meals={meals}
          user={user}
          localFavorites={localFavorites}
          handleToggleFavorite={handleToggleFavorite}
          handleDelete={handleDelete}
        />
      )}
      <Modal
        isVisible={isModalVisible}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        message="Er du sikker på, at du vil slette denne ret?"
      />
    </div>
  );
}

const CreateNewMealButton = () => (
  <div className="flex justify-center">
    <a
      href="/create/"
      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
    >
      Create New Meal
    </a>
  </div>
);

const MealGrid = ({
  meals,
  user,
  localFavorites,
  handleToggleFavorite,
  handleDelete,
}: {
  meals: Meal[];
  user: any;
  localFavorites: string[];
  handleToggleFavorite: (mealId: string, event: React.MouseEvent) => void;
  handleDelete: (mealId: string) => void;
}) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    {meals.map((meal) => (
      <MealCard
        key={meal.id}
        meal={meal}
        user={user}
        localFavorites={localFavorites}
        handleToggleFavorite={handleToggleFavorite}
        handleDelete={handleDelete}
      />
    ))}
  </div>
);

const MealCard = ({
  meal,
  user,
  localFavorites,
  handleToggleFavorite,
  handleDelete,
}: {
  meal: Meal;
  user: any;
  localFavorites: string[];
  handleToggleFavorite: (mealId: string, event: React.MouseEvent) => void;
  handleDelete: (mealId: string) => void;
}) => (
  <div className="flex justify-center">
    <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <div className="relative">
        <img
          src={meal.imagePath}
          alt={meal.name}
          className="rounded-t-md h-64 w-full object-cover"
        />
        {user && (
          <FavoriteButton
            mealId={meal.id}
            favorites={localFavorites}
            handleToggleFavorite={handleToggleFavorite}
          />
        )}
      </div>
      <div className="p-4">
        <h2 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
          {meal.name}
        </h2>
      </div>
      <div className="flex items-center justify-between px-2 m-2">
        <a
          href={`/meal/${meal.id}`}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Se ret
        </a>
        <a
          href={`/meal/${meal.id}/edit`}
          className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900"
        >
          Rediger
        </a>
        <button
          data-modal-target="popup-modal"
          className="block text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
          type="button"
          onClick={(e) => {
            e.preventDefault();
            handleDelete(meal.id);
          }}
        >
          Slet
        </button>
      </div>
    </div>
  </div>
);

export default HomePage;
