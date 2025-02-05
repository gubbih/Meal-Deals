import React, { useEffect, useState } from 'react';
import { getMeal } from '../services/firebase';
import { Meal } from '../models/Meal';

interface MealPageProps {
  id: string;
}

function MealPage({ id }: MealPageProps) {
  const [meal, setMeal] = useState<Meal | null>(null);

  useEffect(() => {
    getMeal(id).then(data => setMeal(data));
  }, [id]);

  if (!meal) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">{meal.name}</h1>
      <img src={meal.imagePath} alt={meal.name} className="mb-4" />
      <p>{meal.description}</p>
      <div className="mt-4">
        <h2 className="text-2xl font-bold">Ingredients</h2>
        <table className="table-auto w-full mt-2">
          <thead>
            <tr>
              <th className="px-4 py-2">Ingredient</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Weight</th>
              <th className="px-4 py-2">Offer Start</th>
              <th className="px-4 py-2">Offer End</th>
            </tr>
          </thead>
          <tbody>
            {meal.foodComponents.map((foodComponent, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{foodComponent.name}</td>
                <td className="border px-4 py-2">{foodComponent.price}</td>
                <td className="border px-4 py-2">{foodComponent.weight}</td>
                <td className="border px-4 py-2">{foodComponent.offerStart}</td>
                <td className="border px-4 py-2">{foodComponent.offerEnd}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MealPage;
