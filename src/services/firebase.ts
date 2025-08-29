import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  push,
  set,
  get,
  update,
  remove,
} from "firebase/database";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword as firebaseSignIn,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import { Meal } from "../models/Meal";
import { User } from "../models/User";
import { FoodComponent } from "../models/FoodComponent";
import { Offer } from "../models/Offer";
import { useState, useEffect } from "react";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: `${process.env.REACT_APP_FIREBASE_PROJECT_ID}.firebaseapp.app`,
  databaseURL: `https://${process.env.REACT_APP_FIREBASE_DATABASE_URL}.firebasedatabase.app`,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: `${process.env.REACT_APP_FIREBASE_PROJECT_ID}.firebasestorage.app`,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

//##############################################
//###########         GET           ############
//##############################################

export const getMeals = async (): Promise<Meal[]> => {
  const mealRef = ref(db, `meals/`);

  try {
    const snapshot = await get(mealRef);
    if (!snapshot.exists()) {
      throw new Error(`Meal not found`);
    }
    const mealList: Meal[] = [];
    snapshot.forEach((child) => {
      const data: Meal = {
        id: child.key as string,
        name: child.val().name,
        description: child.val().description,
        price: child.val().price,
        priceCurrency: child.val().valuta,
        imagePath: child.val().imagePath,
        foodComponents: child.val().foodComponents,
        mealCuisine: child.val()?.mealCuisine,
        mealType: child.val()?.mealType,
        createdBy: child.val().createdBy,
        createdAt: child.val().createdAt,
      };
      mealList.push(data);
    });

    return mealList;
  } catch (error) {
    console.error("Error fetching meal:", error);
    throw new Error("Failed to fetch meal. Please try again later.");
  }
};

export const getMeal = async (id: string): Promise<Meal> => {
  const mealRef = ref(db, `meals/${id}`);

  try {
    const snapshot = await get(mealRef);
    if (!snapshot.exists()) {
      throw new Error(`Meal with ID ${id} not found`);
    }
    const data: Meal = {
      id: snapshot.key as string,
      name: snapshot.val().name,
      description: snapshot.val().description,
      price: snapshot.val().price,
      priceCurrency: snapshot.val().valuta,
      imagePath: snapshot.val().imagePath,
      foodComponents: snapshot.val().foodComponents,
      mealCuisine: snapshot.val()?.mealCuisine,
      mealType: snapshot.val()?.mealType,
      createdBy: snapshot.val().createdBy,
      createdAt: snapshot.val().createdAt,
    };
    return data;
  } catch (error) {
    console.error("Error fetching meal:", error);
    console.log("Error fetching meal:", error);
    throw new Error("Failed to fetch meal. Please try again later.");
  }
};

export const getMealByUser = async (userId: string): Promise<Meal[]> => {
  const mealRef = ref(db, `meals/`);

  try {
    const snapshot = await get(mealRef);
    if (!snapshot.exists()) {
      throw new Error(`Meal not found`);
    }
    const mealList: Meal[] = [];
    snapshot.forEach((child) => {
      const data: Meal = {
        id: child.key as string,
        name: child.val().name,
        description: child.val().description,
        price: child.val().price,
        priceCurrency: child.val().valuta,
        imagePath: child.val().imagePath,
        foodComponents: child.val().foodComponents,
        mealCuisine: child.val()?.mealCuisine,
        mealType: child.val()?.mealType,
        createdBy: child.val().createdBy,
        createdAt: child.val().createdAt,
      };
      if (data.createdBy === userId) {
        mealList.push(data);
      }
    });

    return mealList;
  } catch (error) {
    console.error("Error fetching meal:", error);
    throw new Error("Failed to fetch meal. Please try again later.");
  }
};

export const addFavoriteMeal = async (
  userId: string,
  mealId: string
): Promise<void> => {
  const userPrefsRef = ref(db, `users/${userId}/favoriteRecipes`);

  try {
    const snapshot = await get(userPrefsRef);
    let favorites: string[] = [];

    if (snapshot.exists()) {
      favorites = snapshot.val();
    }

    if (!favorites.includes(mealId)) {
      favorites.push(mealId);
      await set(userPrefsRef, favorites);
    }
  } catch (error) {
    console.error("Error adding favorite meal:", error);
    throw new Error("Failed to add favorite meal.");
  }
};

export const getFoodComponents = async (): Promise<FoodComponent[]> => {
  const foodRef = ref(db, "/foodComponents");

  try {
    const snapshot = await get(foodRef);
    if (!snapshot.exists()) {
      return [];
    }

    const dataList = snapshot.val();
    const foodComponents = Object.values(dataList) as FoodComponent[];

    // Sort the food components alphabetically by category
    foodComponents.sort((a, b) => a.category.localeCompare(b.category));
    foodComponents.forEach((fc) => {
      fc.items.sort();
    });
    return foodComponents;
  } catch (error) {
    console.error("Error fetching FoodComponent:", error);
    throw new Error("Something went wrong");
  }
};

export const getOffers = async (): Promise<Offer[]> => {
  const foodRef = ref(db, "/offers");

  try {
    const snapshot = await get(foodRef);
    if (!snapshot.exists()) {
      return [];
    }
    const offerList: Offer[] = [];
    snapshot.forEach((child) => {
      const data: Offer = {
        id: child.key as string,
        name: child.val().original_name,
        store: child.val().store,
        price: child.val().price,
        priceCurrency: child.val().valuta,
        weight: child.val().weight,
        weightUnit: child.val().weight_unit,
        offerStart: child.val().run_from,
        offerEnd: child.val().run_till,
        category: child.val().category,
        matchedItems: child.val().original_matched_text,
        catelogid: child.val().catalog_id,
        productId: child.val().product_id,
        isOrganic: child.val().is_organic,
        confidence: child.val().confidence,
        foodComponent: child.val().foodcomponent,
      };
      offerList.push(data);
    });
    console.log("Fetched offers:", offerList);
    return Object.values(offerList) as Offer[];
  } catch (error) {
    console.error("Error fetching offers:", error);
    throw new Error("Something went wrong");
  }
};

//##############################################
//###########         POST          ############
//##############################################

export const addMeal = async (meal: Meal): Promise<void> => {
  const newMealRef = push(ref(db, "meals"));
  const data = {
    name: meal.name,
    description: meal.description,
    price: meal.price,
    valuta: meal.priceCurrency,
    imagePath: meal.imagePath,
    foodComponents: meal.foodComponents,
    mealCuisine: meal.mealCuisine,
    mealType: meal.mealType,
    createdBy: meal.createdBy,
    createdAt: new Date().toISOString(),
  };
  await update(newMealRef, data);
};
//##############################################
//###########         PUT           ############
//##############################################

export const updateMealImage = async (
  mealId: string,
  imagepath: string,
  image: File
): Promise<string> => {
  //upload image to storage

  throw new Error("Not implemented");
  //return imagepath;
};

export const updateMeal = async (meal: Meal, image?: File): Promise<void> => {
  const mealRef = ref(db, `/meals/${meal.id}`);
  const data = {
    name: meal.name,
    description: meal.description,
    price: meal.price,
    valuta: meal.priceCurrency,
    imagePath: meal.imagePath,
    foodComponents: meal.foodComponents,
    mealCuisine: meal.mealCuisine,
    mealType: meal.mealType,
    createdBy: meal.createdBy,
    createdAt: meal.createdAt,
  };
  //check if image is the same:
  if (!image) {
    await set(mealRef, data);
  } else {
    //add updateMealImage
    const newImagePath = await updateMealImage(meal.id, meal.imagePath, image);
    data.imagePath = newImagePath;
    await set(mealRef, data);
  }
};

//##############################################
//###########         DELETE        ############
//##############################################

export const deleteMeal = async (id: string): Promise<void> => {
  const mealRef = ref(db, `/meals/${id}`);
  try {
    await remove(mealRef);
    const users = await getAllUsers();
    users.forEach(async (user) => {
      await removeFavoriteMeal(user.uid, id);
    });

    console.log(`Meal with ID ${id} has been deleted successfully.`);
  } catch (error) {
    console.error("Error deleting meal:", error);
    throw new Error("Failed to delete meal. Please try again later.");
  }
};

export const removeFavoriteMeal = async (
  userId: string,
  mealId: string
): Promise<void> => {
  const userPrefsRef = ref(db, `users/${userId}/favoriteRecipes`);

  try {
    const snapshot = await get(userPrefsRef);
    if (!snapshot.exists()) {
      return;
    }

    const favorites: string[] = snapshot.val();
    const updatedFavorites = favorites.filter((id) => id !== mealId);

    await set(userPrefsRef, updatedFavorites);
  } catch (error) {
    console.error("Error removing favorite meal:", error);
    throw new Error("Failed to remove favorite meal.");
  }
};

//##############################################
//###########         AUTH          ############
//##############################################

export const signUp = async (
  email: string,
  password: string,
  displayName: string
): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await updateProfile(userCredential.user, { displayName });

    // Create user in database
    const userRef = ref(db, `users/${userCredential.user.uid}`);
    const userData: User = {
      uid: userCredential.user.uid,
      email: userCredential.user.email as string,
      displayName: displayName,
      isAdmin: false,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      favoriteRecipes: [],
    };

    await set(userRef, userData);
    return userData;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const signIn = (email: string, password: string) => {
  return firebaseSignIn(auth, email, password);
};

export const signOut = () => {
  return firebaseSignOut(auth);
};

export const resetPassword = (email: string) => {
  return sendPasswordResetEmail(auth, email);
};

export const getUser = async (uid: string): Promise<User | null> => {
  const userRef = ref(db, `users/${uid}`);

  try {
    const snapshot = await get(userRef);
    if (!snapshot.exists()) {
      return null;
    }

    return {
      uid: snapshot.key as string,
      email: snapshot.val().email,
      displayName: snapshot.val().displayName,
      isAdmin: snapshot.val().isAdmin,
      createdAt: snapshot.val().createdAt,
      lastLogin: snapshot.val().lastLogin,
      favoriteRecipes: snapshot.val().favoriteRecipes,
    };
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("Failed to fetch user data.");
  }
};

export const updateUser = async (user: User): Promise<void> => {
  const userRef = ref(db, `users/${user.uid}`);

  try {
    // Update lastLogin
    user.lastLogin = new Date().toISOString();
    await update(userRef, user);
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Failed to update user data.");
  }
};

export const deleteUser = async (uid: string): Promise<void> => {
  const userRef = ref(db, `users/${uid}`);

  try {
    await remove(userRef);
    console.log(`User with ID ${uid} has been deleted successfully.`);
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error("Failed to delete user data.");
  }
};

export const getAllUsers = async (): Promise<User[]> => {
  const usersRef = ref(db, "users/");

  try {
    const snapshot = await get(usersRef);
    if (!snapshot.exists()) {
      return [];
    }

    const userList: User[] = [];
    snapshot.forEach((child) => {
      const data: User = {
        uid: child.key as string,
        email: child.val().email,
        displayName: child.val().displayName,
        isAdmin: child.val().isAdmin,
        createdAt: child.val().createdAt,
        lastLogin: child.val().lastLogin,
        favoriteRecipes: child.val().favoriteRecipes,
      };
      userList.push(data);
    });

    return userList;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users. Please try again later.");
  }
};

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      try {
        if (firebaseUser) {
          // Check if user exists in database, if not create a basic entry
          let userData = await getUser(firebaseUser.uid);

          if (!userData) {
            userData = {
              uid: firebaseUser.uid,
              email: firebaseUser.email as string,
              displayName: firebaseUser.displayName || "User",
              isAdmin: false,
              createdAt: new Date().toISOString(),
              lastLogin: new Date().toISOString(),
              favoriteRecipes: [],
            };

            const userRef = ref(db, `users/${firebaseUser.uid}`);
            await set(userRef, userData);
          } else {
            // Update last login time
            const userRef = ref(db, `users/${firebaseUser.uid}`);
            await update(userRef, { lastLogin: new Date().toISOString() });
          }

          setCurrentUser(userData);
        } else {
          setCurrentUser(null);
        }
      } catch (err) {
        console.error("Auth error:", err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Unknown authentication error");
        }
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return { user: currentUser, loading, error };
};
