import { FoodComponent } from "./FoodComponent";

export interface Meal {
  id: string;
  name: string;
  description: string;
  price: number | null;
  priceCurrency: string | null;
  imagePath?: string;
  image?: File;
  foodComponents: FoodComponent[];
  mealCuisine: string;
  mealType: string;
  createdBy: string;
  createdAt: string;
}
