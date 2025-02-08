import { FoodComponent } from "./FoodComponent";

export interface Meal {
    id: string;
    name: string;
    description: string;
    price: number | null;
    priceCurrency: string | null;
    imagePath: string;
    foodComponents: FoodComponent[];
    category?: string;
    cuisine?: string;
    meal?: string;
}