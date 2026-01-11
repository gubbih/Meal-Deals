import { z } from "zod";
import { cuisines, mealsTypes } from "../assets/Arrays";

// Schema for food component selection
export const foodComponentSchema = z.object({
  category: z.string().min(1, "Category is required"),
  items: z.array(z.string()).min(1, "At least one item is required"),
});

// Schema for meal creation and editing
export const mealFormSchema = z
  .object({
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
      .trim()
      .url("Please enter a valid image URL")
      .optional()
      .or(z.literal("")), // Allows empty string if file is used

    image: z
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
        (file) =>
          !file || (file instanceof File && file.size <= 5 * 1024 * 1024), // Added !file check
        "Max file size is 5MB"
      )
      .refine(
        (file) =>
          !file ||
          ["image/jpeg", "image/png", "image/webp"].includes(file.type),
        "Only .jpg, .png, and .webp formats are supported"
      ),

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
            (c) => `${c.category}:${c.items.join(",")}`
          );
          return new Set(categoryItemPairs).size === categoryItemPairs.length;
        },
        {
          message: "Duplicate food components detected",
        }
      ),
  })
  .refine(
    (data) => {
      const hasUrl =
        typeof data.imagePath === "string" && data.imagePath.trim().length > 0;

      // After transform, data.image is either a File or undefined
      const hasFile = data.image instanceof File;

      return hasUrl || hasFile;
    },
    {
      message: "Please provide either an image URL or upload a file",
      path: ["imagePath"],
    }
  );

// Type definitions based on the schemas
export type FoodComponentInput = z.infer<typeof foodComponentSchema>;
export type MealFormValues = z.infer<typeof mealFormSchema>;
