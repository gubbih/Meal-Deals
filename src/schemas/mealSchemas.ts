import { z } from "zod";
import { FoodComponent } from "../models/FoodComponent";
import { cuisines, mealsTypes } from "../assets/Arrays";

// Create a typed enum from the existing arrays
const CuisineEnum = z.enum(cuisines as [string, ...string[]]);
const MealTypeEnum = z.enum(mealsTypes as [string, ...string[]]);

// Schema for food component selection
export const foodComponentSchema = z.object({
  category: z.string(),
  items: z.array(z.string()),
});

// Schema for meal creation and editing
export const mealFormSchema = z.object({
  name: z.string().min(2, "Meal name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  imagePath: z.string().url("Please enter a valid image URL"),
  imageFile: z.any().optional(),
  mealCuisine: z.string().refine((value) => cuisines.includes(value), {
    message: "Please select a valid cuisine type",
  }),
  mealType: z.string().refine((value) => mealsTypes.includes(value), {
    message: "Please select a valid meal type",
  }),
  foodComponents: z
    .array(foodComponentSchema)
    .min(1, "Please select at least one food component"),
});

// Type definitions based on the schemas
export type FoodComponentInput = z.infer<typeof foodComponentSchema>;
export type MealFormValues = z.infer<typeof mealFormSchema>;
