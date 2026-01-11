import { FoodComponent } from "./FoodComponent";
import { User } from "./User";

export interface Meal {
  id: string;
  name: string;
  description: string;
  price: number | null;
  priceCurrency: string | null;
  imagePath?: string;
  image?: File;
  foodComponents: FoodComponent[];
  mealCuisine: string | null;
  mealType: string | null;
  createdBy: string;
  createdAt: string;
  user?: {
    id: string;
    displayName: string;
  };
}
