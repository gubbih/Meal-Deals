import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams
import { getMeal, getOffer} from '../services/firebase';
import { Meal } from '../models/Meal';
import { Offer } from '../models/Offer';

function MealPage() {
  const { id } = useParams<{ id: string }>(); // Use useParams to get the id
  
  const [meal, setMeal] = useState<Meal | null>(null);
  const [offer, setOffer] = useState<Offer | null>(null);
  console.log("meal: ", meal);

  useEffect(() => {
    if (id) {
      getMeal(id).then(data => setMeal(data));
    }
    if (id) {
      getOffer(id).then(data => setOffer(data));
    }
  }, [id]);

  if (!meal || !offer) return <div>Loading...</div>;

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
            {/*
            {meal.foodComponents.map((offer, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{offer.name}</td>
                <td className="border px-4 py-2">{offer.price}</td>
                <td className="border px-4 py-2">{offer.weight}</td>
                <td className="border px-4 py-2">{offer.offerStart}</td>
                <td className="border px-4 py-2">{offer.offerEnd}</td>
              </tr>
            ))}
            */}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MealPage;

