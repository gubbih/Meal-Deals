import { z } from "zod";
import { cuisines, mealsTypes } from "../assets/Arrays";

// Schema for the new food component structure (individual components)
export const foodComponentSchema = z.object({
  id: z.number(),
  componentName: z.string(),
  normalizedName: z.string(),
  categoryId: z.number(),
  category: z.object({
    id: z.number(),
    categoryName: z.string(),
  }),
});

// Legacy schema for backward compatibility with the form structure
export const legacyFoodComponentSchema = z.object({
  category: z.string().min(1, "Category is required"),
  items: z.array(z.string()).min(1, "At least one item is required"),
});

const baseMealFormSchema = z.object({
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

  mealCuisine: z.string().refine((value) => cuisines.includes(value), {
    message: "Please select a valid cuisine type",
  }),

  mealType: z.string().refine((value) => mealsTypes.includes(value), {
    message: "Please select a valid meal type",
  }),

  // For the form, we'll use an array of selected food component objects
  foodComponents: z
    .array(z.any())
    .min(1, "At least one food component is required"),
});

const createImageSchema = z
  .any()
  .refine(
    (files) => !files || files.length === 0 || files instanceof FileList,
    "Invalid file input"
  )
  .transform((files) =>
    files instanceof FileList && files.length > 0 ? files[0] : undefined
  )
  .optional()
  .refine(
    (file) => !file || (file instanceof File && file.size <= 5 * 1024 * 1024),
    "Max file size is 5MB"
  )
  .refine(
    (file) =>
      !file || ["image/jpeg", "image/png", "image/webp"].includes(file.type),
    "Only .jpg, .png, and .webp formats are supported"
  );

export const createMealFormSchema = baseMealFormSchema
  .extend({
    imagePath: z.string().optional().or(z.literal("")),
    image: createImageSchema,
  })
  .refine((data) => data.image instanceof File, {
    message: "Please upload an image",
    path: ["image"],
  });

// Edit mode keeps the existing image unless a new file is selected.
// Do not validate image fields when editing.
export const editMealFormSchema = baseMealFormSchema.extend({
  imagePath: z.string().optional().or(z.literal("")),
  image: z.any().optional(),
});

// Type definitions based on the schemas
export type FoodComponentInput = z.infer<typeof foodComponentSchema>;
export type LegacyFoodComponentInput = z.infer<
  typeof legacyFoodComponentSchema
>;
export type MealFormValues = z.infer<typeof editMealFormSchema>;
