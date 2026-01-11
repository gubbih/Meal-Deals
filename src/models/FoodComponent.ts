export interface FoodComponent {
  id: number;
  componentName: string;
  normalizedName: string;
  categoryId: number;
  category: {
    id: number;
    categoryName: string;
  };
}
