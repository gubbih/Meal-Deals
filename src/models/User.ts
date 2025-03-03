export interface User {
  uid: string;
  email: string;
  displayName?: string;
  isAdmin?: boolean;
  createdAt?: string;
  lastLogin?: string;
  favoriteRecipes?: string[];
}
