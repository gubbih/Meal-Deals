import { useState, useEffect } from 'react';
import { getFoodComponents } from '../services/firebase'; // Adjust the import path as necessary
import { FoodComponent } from '../models/FoodComponent';

const useFetchFoodComponents = () => {
  const [foodComponents, setFoodComponents] = useState<FoodComponent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getFoodComponents()
      .then(data => {
        setFoodComponents(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { foodComponents, loading, error };
};

export default useFetchFoodComponents;