import React, { useEffect, useState } from "react";
import { getMeals } from "../services/firebase";
import { Meal } from "../models/Meal";

function HomePage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  console.log("meals: ", meals); // Log meals to the console
  useEffect(() => {
    getMeals().then((data) => setMeals(data));
  }, []);

  return (
    <div className="p-4">
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
                  View Meal
                </a>
                <a
                  href={`/meal/${meal.id}/edit`}
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                  Edit
                </a>
                {/* Should be an onclick? pop-up/taost to confirm that data has been deleted */}
                <a
                  href={`/deleteMeal/${meal.id}`}
                  className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800"
                >
                  Delete
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
