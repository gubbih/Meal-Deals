import { FoodComponent } from './FoodComponent';

export interface Meal {
    id: string;
    name: string;
    description: string;
    price: number;
    priceCurrency: string;
    weight: number;
    weightUnit: string;
    imagePath: string;
    foodComponents: FoodComponent[];
}
