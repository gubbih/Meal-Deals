import { FoodComponent } from './FoodComponent';

export interface Meal {
    id: string;
    name: string;
    description: string;
    price: number | null;
    priceCurrency: string | null;
    imagePath: string;
    foodComponents: FoodComponent[];
}

export const dummyMeals: Meal[] = [
    {
        id: '1',
        name: 'Meal 1',
        description: 'Delicious meal 1',
        price: 10,
        priceCurrency: 'DKK',
        imagePath: 'https://placehold.co/200x200',
        foodComponents: [
            { name: 'Component 1', price: 2, weight: 100, weightUnit: "g", offerStart: '2023-01-01', offerEnd: '2023-12-31' },
            { name: 'Component 2', price: 3, weight: 150, weightUnit: "g", offerStart: '2023-01-01', offerEnd: '2023-12-31' }
        ]
    },
    {
        id: '2',
        name: 'Meal 2',
        description: 'Delicious meal 2',
        price: 12,
        priceCurrency: 'DKK',
        imagePath: 'https://placehold.co/200x200',
        foodComponents: [
            { name: 'Component 1', price: 2, weight: 100, weightUnit: "g", offerStart: '2023-01-01', offerEnd: '2023-12-31' },
            { name: 'Component 3', price: 4, weight: 200, weightUnit: "ml", offerStart: '2023-01-01', offerEnd: '2023-12-31' }
        ]
    },
    {
        id: '3',
        name: 'Meal 3',
        description: 'Delicious meal 3',
        price: 10,
        priceCurrency: 'DKK',
        imagePath: 'https://placehold.co/200x200',
        foodComponents: [
            { name: 'Component 1', price: 2, weight: 100, weightUnit: "g", offerStart: '2023-01-01', offerEnd: '2023-12-31' },
            { name: 'Component 2', price: 3, weight: 150, weightUnit: "g", offerStart: '2023-01-01', offerEnd: '2023-12-31' }
        ]
    },
    {
        id: '4',
        name: 'Meal 4',
        description: 'Delicious meal 4',
        price: 12,
        priceCurrency: 'DKK',
        imagePath: 'https://placehold.co/200x200',
        foodComponents: [
            { name: 'Component 1', price: 2, weight: 100, weightUnit: "g", offerStart: '2023-01-01', offerEnd: '2023-12-31' },
            { name: 'Component 3', price: 4, weight: 200, weightUnit: "ml", offerStart: '2023-01-01', offerEnd: '2023-12-31' }
        ]
    }
];
