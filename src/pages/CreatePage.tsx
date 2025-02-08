import React, { useState } from "react";
import Select from "react-select";
import { addMeal } from "../services/firebase";
import { Meal } from "../models/Meal";
import useFetchFoodComponents from "../hooks/useFetchFoodComponents";
import { FoodComponent } from "../models/FoodComponent";

const cuisines = [
  "Ukendt",
  "Danish",
  "Italian",
  "Chinese",
  "Thai",
  "Indian",
  "French",
  "Japanese",
  "Mexican",
  "None",
];

const meals = [
  "Morgenmad",
  "Frokost",
  "Aftensmad",
  "Dessert",
  "Snack",
  "Drikke",
];

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
    >,
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
    })),
  );

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Create New Meal</h1>
      <form onSubmit={handleSubmit}>
        {/* Name */}
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

        {/* Description */}
        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
            name="description"
            value={meal.description}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        {/* Image URL */}
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

        {/* Cuisine Type */}
        <div className="mb-4">
          <label className="block text-gray-700">Cuisine</label>
          <select
            name="cuisine"
            value={meal.cuisine}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          >
            {cuisines.map((cuisine) => (
              <option key={cuisine} value={cuisine}>
                {cuisine}
              </option>
            ))}
          </select>
        </div>

        {/* Meal Type */}
        <div className="mb-4">
          <label className="block text-gray-700">Meal Type</label>
          <select
            name="meal"
            value={meal.meal}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          >
            {meals.map((mealType) => (
              <option key={mealType} value={mealType}>
                {mealType}
              </option>
            ))}
          </select>
        </div>

        {/* Food Components Multi-Select */}
        <div className="mb-4">
          <label className="block text-gray-700">Food Components</label>
          <Select
            options={categoryOptions}
            isMulti
            onChange={handleFoodComponentChange}
            placeholder="Vælg madkomponenter..."
            styles={{
              control: (base) => ({
                ...base,
                borderRadius: "8px",
                padding: "5px",
              }),
            }}
          />
        </div>

        <button type="submit" className="bg-green-500 text-white p-2 rounded">
          Create
        </button>
      </form>
    </div>
  );
}

export default CreatePage;
