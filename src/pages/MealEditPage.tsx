import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getMeal, updateMeal } from "../services/firebase";
import { Meal } from "../models/Meal";
import useFetchFoodComponents from "../hooks/useFetchFoodComponents";
import MealForm from "../components/MealForm";
import { cuisines, meals } from "../assets/Arrays";

function EditMealPage() {
  const { id } = useParams<{ id: string }>();
  const { foodComponents, loading, error } = useFetchFoodComponents();
  const [meal, setMeal] = useState<Meal | null>(null);
  const [selectedComponents, setSelectedComponents] = useState<
    { label: string; value: string; category: string }[]
  >([]);

  useEffect(() => {
    const fetchMeal = async () => {
      if (!id) return;
      const fetchedMeal = await getMeal(id);
      setMeal(fetchedMeal);
      console.log("fetchedMeal: ", fetchedMeal);
      setSelectedComponents(
        fetchedMeal.foodComponents.map((fc) => ({
          label: `${fc.category}: ${fc.items ? fc.items.join(", ") : fc.items}`,
          value: fc.items ? fc.items.join(", ") : fc.items,
          category: fc.category,
        }))
      );
    };
    fetchMeal();
  }, [id]);

  // Håndterer ændringer i inputfelter
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    if (meal) {
      const { name, value } = e.target;
      setMeal({ ...meal, [name]: value });
    }
  };

  // Håndterer valg af food components fra dropdown
  const handleFoodComponentChange = (selectedOptions: any) => {
    console.log("selectedOptions: ", selectedOptions);
    setSelectedComponents(selectedOptions);
    if (meal) {
      const formattedComponents = selectedOptions.map((option: any) => {
        const { label, value, ...rest } = option;
        return { ...rest, items: value.split(", ") };
      });
      setMeal({ ...meal, foodComponents: formattedComponents });
    }
  };

  // Sender data til databasen
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (meal) {
      await updateMeal(meal);
      alert("Meal successfully updated!");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!meal) return <div>Loading meal data...</div>;

  // Formatér foodComponents korrekt til brug i React-Select
  const categoryOptions = foodComponents.flatMap((fc) =>
    fc.items.map((item) => ({
      label: `${fc.category}: ${item}`, // F.eks. "Drikkevarer: Cola"
      value: item,
      category: fc.category,
    }))
  );

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Edit Meal</h1>
      <MealForm
        meal={meal}
        cuisines={cuisines}
        meals={meals}
        categoryOptions={categoryOptions}
        handleChange={handleChange}
        handleFoodComponentChange={handleFoodComponentChange}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}

export default EditMealPage;
