import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Meal } from "../models/Meal";
import useFetchFoodComponents from "../hooks/useFetchFoodComponents";
import MealForm from "../components/MealForm";
import { useFetchMeal } from "../hooks/useFetchMeal";
import useUpdateMeal from "../hooks/useUpdateMeal";
import Toast from "../components/Toast";
import Modal from "../components/Modal";

function EditMealPage() {
  const { id } = useParams<{ id: string }>() || { id: "" };
  const navigate = useNavigate();
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

  const {
    updateMealData,
    loading: updateLoading,
    error: updateError,
  } = useUpdateMeal();

  const [meal, setMeal] = useState<Meal | null>(null);
  const [toast, setToast] = useState<{
    type: "success" | "error" | "warning";
    message: string;
  } | null>(null);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [navigateAway, setNavigateAway] = useState(false);

  const handleCancel = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    setIsModalVisible(true);
  };

  const confirmNavigateAway = () => {
    setIsModalVisible(false);
    setNavigateAway(true);
  };

  useEffect(() => {
    if (navigateAway) {
      navigate("/");
    }
  }, [navigateAway, navigate]);

  useEffect(() => {
    if (fetchedMeal) {
      setMeal({
        ...fetchedMeal,
        mealCuisine: fetchedMeal.mealCuisine || "",
        mealType: fetchedMeal.mealType || "",
        foodComponents: fetchedMeal.foodComponents
          ? fetchedMeal.foodComponents
          : [],
      });
    }
  }, [fetchedMeal]);

  const onInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    if (meal) {
      const { name, value } = e.target;
      setMeal({ ...meal, [name]: value });
    }
  };

  const onFoodComponentChange = (selectedOptions: any) => {
    if (meal) {
      const formattedComponents = selectedOptions.map((option: any) => ({
        category: option.category,
        items: option.value,
      }));
      setMeal({ ...meal, foodComponents: formattedComponents });
    }
  };

  const handleSelectChange = (key: keyof Meal) => (selectedOption: any) => {
    if (meal) {
      setMeal({ ...meal, [key]: selectedOption.value });
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (meal) {
      try {
        await updateMealData(meal);
        setToast({ type: "success", message: "Meal successfully updated!" });
        navigate("/", {
          state: {
            toast: { type: "success", message: "Meal successfully updated!" },
          },
        });
      } catch (error) {
        setToast({ type: "error", message: "Failed to update meal!" });
      }
    }
  };

  const categoryOptions = useMemo(() => {
    return foodComponents.flatMap((fc) => {
      if (Array.isArray(fc.items)) {
        return fc.items.map((item) => ({
          label: `${fc.category}: ${item}`,
          value: [item],
          category: fc.category,
        }));
      }
      return [];
    });
  }, [foodComponents]);

  const isLoading = mealLoading || foodComponentsLoading || updateLoading;
  const error = mealError || foodComponentsError || updateError;

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!id) return <div>No meal found</div>;

  return (
    <div className="">
      <Modal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onConfirm={confirmNavigateAway}
        message="Er du sikker på at gå væk fra denne side, tingene er ikke gemt?"
      />
      <div className="p-6">
        {toast && <Toast type={toast.type} message={toast.message} />}
        <h1 className="text-xl justify-center flex font-semibold tracking-tight text-gray-900 dark:text-white">
          Edit Meal
        </h1>
        {meal && (
          <MealForm
            meal={meal}
            foodComponentOptions={categoryOptions}
            onInputChange={onInputChange}
            onFoodComponentChange={onFoodComponentChange}
            onCuisineChange={handleSelectChange("mealCuisine")}
            onMealTypeChange={handleSelectChange("mealType")}
            onSubmit={onSubmit}
            onCancel={handleCancel}
          />
        )}
      </div>
    </div>
  );
}

export default EditMealPage;
