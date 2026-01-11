export interface User {
  id: string; // Changed from uid to match backend response
  uid?: string; // Keep for backward compatibility
  email: string;
  displayName?: string;
  isAdmin?: boolean;
  createdAt?: string;
  lastLogin?: string;
  favoriteRecipes?: string[];
}
