import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, push, set, get } from "firebase/database";
import { dummyMeals, Meal } from '../models/Meal';
import { User } from '../models/User';
import { FoodComponent } from '../models/FoodComponent';
import { Offer } from '../models/Offer';
require('dotenv').config();

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: `${process.env.REACT_APP_FIREBASE_PROJECT_ID}.firebaseapp.app`,
  databaseURL: `https://${process.env.REACT_APP_FIREBASE_DATABASE_URL}.firebasedatabase.app`,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: `${process.env.REACT_APP_FIREBASE_PROJECT_ID}.firebasestorage.app`,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);



//##############################################
//###########         GET           ############
//##############################################


export const getMeals = async (): Promise<Meal[]> => {
  const mealRef = ref(db, `/Meals/`);

  try {
    const snapshot = await get(mealRef);
    if (!snapshot.exists()) {
      throw new Error(`Meal not found`);
    }

    return snapshot.val() as Meal[];
  } catch (error) {
    console.error("Error fetching meal:", error);
    throw new Error("Failed to fetch meal. Please try again later.");
  }
};

export const getMeal = async (id: string): Promise<Meal> => {
  const mealRef = ref(db, `/Meals/${id}`);

  try {
    const snapshot = await get(mealRef);
    if (!snapshot.exists()) {
      throw new Error(`Meal with ID ${id} not found`);
    }

    return snapshot.val() as Meal;
  } catch (error) {
    console.error("Error fetching meal:", error);
    throw new Error("Failed to fetch meal. Please try again later.");
  }
};
// to use:
/*
const fetchMeal = async () => {
  try {
    const meal = await getMeal("12345");
    console.log("Fetched meal:", meal);
  } catch (error) {
    console.error(error);
  }
};
*/

export const getFoodComponents = async (): Promise<FoodComponent[]> => {
  const foodRef = ref(db, "/FoodComponent");

  try {
    const snapshot = await get(foodRef);
    if (!snapshot.exists()) {
      return [];
    }

    const dataList = snapshot.val();
    return Object.values(dataList) as FoodComponent[];
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

    const dataList = snapshot.val();
    return Object.values(dataList) as Offer[];
  } catch (error) {
    console.error("Error fetching offers:", error);
    throw new Error("Something went wrong");
  }
};


//##############################################
//###########         POST          ############
//##############################################

export const addMeal = async (meal: Meal): Promise<void> => {
  const newMealRef = push(ref(db, 'meals'));
  const data = {
    name: meal.name,
    description: meal.description,
    price: meal.price,
    priceCurrency: meal.priceCurrency,
    imagePath: meal.imagePath,
    foodComponents: meal.foodComponents
  };
  await set(newMealRef, data);
};
//##############################################
//###########         PUT           ############
//##############################################

export const updateMeal = async (meal: Meal): Promise<void> => {
  throw new Error('Not implemented');
}

export const updateUser = async (user: User): Promise<void> => {
  throw new Error('Not implemented');
}

export const updateMealImage = async (mealId: string, image: File): Promise<string> => {
  throw new Error('Not implemented');
}


//##############################################
//###########         DELETE        ############
//##############################################

export const deleteMeal = async (id: string): Promise<void> => {
  throw new Error('Not implemented');
};

export const deleteUser = async (id: string): Promise<void> => {
  throw new Error('Not implemented');
};


//##############################################
//###########         AUTH          ############
//##############################################

export const signIn = (email: string, password: string) => {
  throw new Error('Not implemented');
  //return signInWithEmailAndPassword(auth, email, password);
};

export const signOut = () => {
  throw new Error('Not implemented');
};

export const useAuth = (): User | null => {
  throw new Error('Not implemented');
};

