import React, { useState } from "react";
import { addMeal } from "../services/firebase";
import { Meal } from "../models/Meal";
import useFetchFoodComponents from "../hooks/useFetchFoodComponents";
import MealForm from "../components/MealForm";
import { cuisines, meals } from "../assets/Arrays";

function CreatePage() {
  const { foodComponents, loading, error } = useFetchFoodComponents();
  const [meal, setMeal] = useState<Meal>({
    id: "",
    name: "",
    description: "",
    price: 0,
    priceCurrency: "",
    imagePath: "",
    foodComponents: [],
    cuisine: "",
    meal: "",
  });
  const [selectedComponents, setSelectedComponents] = useState([]);

  // Håndterer ændringer i inputfelter
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setMeal({ ...meal, [name]: value });
  };

  // Håndterer valg af food components fra dropdown
  const handleFoodComponentChange = (selectedOptions: any) => {
    console.log("selectedOptions: ", selectedOptions);
    setSelectedComponents(selectedOptions);
    const formattedComponents = selectedOptions.map((option: any) => {
      const { label, value, ...rest } = option;
      return { ...rest, items: value };
    });
    setMeal({ ...meal, foodComponents: formattedComponents });
  };

  // Sender data til databasen
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await addMeal(meal);
    alert("Meal successfully added!");
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

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
      <h1 className="text-3xl font-bold mb-4">Create New Meal</h1>
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

export default CreatePage;
