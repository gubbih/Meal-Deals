import React, { useEffect, useState } from 'react';
import { getMeals } from '../services/firebase';
import { Meal } from '../models/Meal';

function HomePage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  console.log("meals: ", meals);  // Log meals to the console
  useEffect(() => {
    getMeals().then(data => setMeals(data));
  }, []);


  return (
    <div className="p-4">
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
