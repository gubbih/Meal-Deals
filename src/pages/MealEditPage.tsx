import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { updateMeal } from "../services/firebase";
import { Meal } from "../models/Meal";
import useFetchFoodComponents from "../hooks/useFetchFoodComponents";
import MealForm from "../components/MealForm";
import { cuisines, meals } from "../assets/Arrays";
import useFetchMeal from "../hooks/useFetchMeal";

function EditMealPage() {
  const { id } = useParams<{ id: string }>() || { id: "" };
  const {
    foodComponents,
    loading: foodComponentsLoading,
    error: foodComponentsError,
  } = useFetchFoodComponents();
  const {
    meal: fetchedMeal,
    loading: mealLoading,
    error: mealError,
  } = useFetchMeal(id || "");
  const [meal, setMeal] = useState<Meal | null>(null);
  const [selectedComponents, setSelectedComponents] = useState<
    { label: string; value: string; category: string }[]
  >([]);
  //To do add ignore to useeffect
  useEffect(() => {
    if (fetchedMeal) {
      setMeal(fetchedMeal);
      setSelectedComponents(
        fetchedMeal.foodComponents.map((fc) => ({
          label: `${fc.category ? fc?.category : "Ukendt"}: ${Array.isArray(fc.items) ? "Multiple" : "Single"}`, // F.eks. "Drikkevarer: Cola"
          value: Array.isArray(fc.items) ? fc.items.join(", ") : fc.items,
          category: fc.category,
        }))
      );
    }
  }, [fetchedMeal]);

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

  if (!id) return <div>No meal found</div>;
  if (mealError) return <div>Error: {mealError}</div>;
  if (foodComponentsError) return <div>Error: {foodComponentsError}</div>;
  if (mealLoading || foodComponentsLoading) return <div>Loading...</div>;

  // Formatér foodComponents korrekt til brug i React-Select
  const categoryOptions = foodComponents.flatMap((fc) =>
    fc.items.map((item) => ({
      label: `${fc.category}: ${item}`, // F.eks. "Drikkevarer: Cola"
      value: [item],
      category: fc.category,
    }))
  );

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Edit Meal</h1>
      {meal && (
        <MealForm
          meal={meal}
          cuisines={cuisines}
          meals={meals}
          categoryOptions={categoryOptions}
          handleChange={handleChange}
          handleFoodComponentChange={handleFoodComponentChange}
          handleSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

export default EditMealPage;
