import React, { useState } from 'react';
import { addMeal } from '../services/firebase';
import { Meal} from '../models/Meal';

function CreatePage() {
  const [meal, setMeal] = useState<Meal>({
    id: '',
    name: '',
    description: '',
    price: 0,
    priceCurrency: '',
    weight: 0,
    weightUnit: '',
    imagePath: '',
    foodComponents: []
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMeal({ ...meal, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addMeal(meal).then(() => {
      // Handle success (e.g., redirect to home page)
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Create New Meal</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={meal.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
            name="description"
            value={meal.description}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Image URL</label>
          <input
            type="text"
            name="imagePath"
            value={meal.imagePath}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        {/* Add more fields for ingredients, etc. */}
        <button type="submit" className="bg-green-500 text-white p-2 rounded">Create</button>
      </form>
    </div>
  );
}

export default CreatePage;
