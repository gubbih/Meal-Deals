import { z } from "zod";
import { cuisines, mealsTypes } from "../assets/Arrays";

// Schema for food component selection
export const foodComponentSchema = z.object({
  category: z.string().min(1, "Category is required"),
  items: z.array(z.string()).min(1, "At least one item is required"),
});

// Schema for meal creation and editing
export const mealFormSchema = z.object({
  name: z
    .string()
    .min(2, "Meal name must be at least 2 characters")
    .max(100, "Meal name must be less than 100 characters")
    .trim(),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be less than 1000 characters")
    .trim(),

  imagePath: z
    .string()
    .url("Please enter a valid image URL")
    .min(5, "Image URL is too short")
    .trim(),

  mealCuisine: z.string().refine((value) => cuisines.includes(value), {
    message: "Please select a valid cuisine type",
  }),

  mealType: z.string().refine((value) => mealsTypes.includes(value), {
    message: "Please select a valid meal type",
  }),

  foodComponents: z
    .array(foodComponentSchema)
    .min(1, "Please select at least one food component")
    .max(20, "Too many food components selected")
    .refine(
      (components) => {
        // Check for duplicate categories and items
        const categoryItemPairs = components.map(
          (c) => `${c.category}:${c.items.join(",")}`,
        );
        return new Set(categoryItemPairs).size === categoryItemPairs.length;
      },
      {
        message: "Duplicate food components detected",
      },
    ),
});

// Type definitions based on the schemas
export type FoodComponentInput = z.infer<typeof foodComponentSchema>;
export type MealFormValues = z.infer<typeof mealFormSchema>;
