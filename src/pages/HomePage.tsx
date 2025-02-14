import React, { useEffect, useState } from "react";
import { getMeals } from "../services/firebase";
import { Meal } from "../models/Meal";
import useDeleteMeal from "../hooks/useDeleteMeal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function HomePage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const { handleDeleteMeal } = useDeleteMeal();

  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    const data = await getMeals();
    setMeals(data);
  };

  const handleDelete = async (mealId: string) => {
    const confirmDelete = window.confirm(
      "Er du sikker på, at du vil slette dette ret?",
    );

    if (confirmDelete) {
      await handleDeleteMeal(mealId);
      toast.success("Ret blev succesfuldt slettet!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      fetchMeals();
    }
  };

  return (
    <div className="p-4">
      <ToastContainer />
      {meals.length === 0 ? (
        <div className="flex justify-center">
          <a
            href="/meal/new"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Create New Meal
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {meals.map((meal) => (
            <div key={meal.id} className="card">
              <div className="p-4 bg-white shadow-md rounded">
                <img src={meal.imagePath} alt={meal.name} />
                <h2 className="text-xl font-bold">{meal.name}</h2>
                <p className="text-gray-600 text-sm">{meal.description}</p>
                <div className="mt-4 space-x-2">
                  <a
                    href={`/meal/${meal.id}`}
                    className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800"
                  >
                    Se ret
                  </a>
                  <a
                    href={`/meal/${meal.id}/edit`}
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                  >
                    Rediger
                  </a>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleDelete(meal.id);
                    }}
                    className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800"
                  >
                    Slet
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HomePage;
