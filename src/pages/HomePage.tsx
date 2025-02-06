import React, { useEffect, useState } from 'react';
import { getMeals } from '../services/firebase';
import { Meal } from '../models/Meal';
import { getFoodComponents } from '../services/firebase';

function HomePage() {
  const [meals, setMeals] = useState<Meal[]>([]);

  useEffect(() => {
    getMeals().then(data => setMeals(data));
  }, []);

  const handleClick = () => {
    console.log("Click");
    getFoodComponents()
  };

  return (
    <div className="p-4">
      <button
        type="button"
        onClick={handleClick}
        className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
      >      
      Alternative
    </button>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {meals.map(meal => (
          <div key={meal.id} className="card">
            <div className="p-4 bg-white shadow-md rounded">
              <img src={meal.imagePath} alt={meal.name} />
              <h2 className="text-xl font-bold">{meal.name}</h2>
              <p>{meal.description}</p>
              <a href={`/meal/${meal.id}`} className="text-blue-500">View Meal</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
