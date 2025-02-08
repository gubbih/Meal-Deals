import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, set, get } from "firebase/database";
import { dummyMeals, Meal } from '../models/Meal';
import { User } from '../models/User';
import { FoodComponent } from '../models/FoodComponent';
import { Offer } from '../models/Offer';

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
  const mealRef = ref(db, `meals/`);

  try {
    const snapshot = await get(mealRef);
    if (!snapshot.exists()) {
      throw new Error(`Meal not found`);
    }
    const mealList: Meal[] = [];
    snapshot.forEach((child) => {

      const data:Meal = {
        id: child.key as string,
        name: child.val().name,
        description: child.val().description,
        price: child.val().price,
        priceCurrency: child.val().priceCurrency,
        imagePath: child.val().imagePath,
        foodComponents: child.val().foodComponents,
        cuisine: child.val()?.crusine,
        category: child.val()?.category,
        meal: child.val()?.meal
      }
      mealList.push(data);
    });

    return mealList;
  } catch (error) {
    console.error("Error fetching meal:", error);
    throw new Error("Failed to fetch meal. Please try again later.");
  }
};

export const getMeal = async (id: string): Promise<Meal> => {
  const mealRef = ref(db, `/meals/${id}`);

  try {
    const snapshot = await get(mealRef);
    if (!snapshot.exists()) {
      throw new Error(`Meal with ID ${id} not found`);
    }
    const data:Meal = {
      id: snapshot.key as string,
      name: snapshot.val().name,
      description: snapshot.val().description,
      price: snapshot.val().price,
      priceCurrency: snapshot.val().priceCurrency,
      imagePath: snapshot.val().imagePath,
      foodComponents: snapshot.val().foodComponents,
      cuisine: snapshot.val()?.crusine,
      meal: snapshot.val()?.meal,
      category: snapshot.val()?.category,
    }
    return data;
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
    foodComponents.forEach(fc => {
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
        name: child.val().name,
        store: child.val().store,
        price: child.val().price,
        priceCurrency: child.val().valuta,
        weight: child.val().weight,
        weightUnit: child.val().weight_unit,
        offerStart: child.val().run_till,
        offerEnd: child.val().run_from,
        category: child.val().categories,
        matchedItems: child.val().matchedItems,
        catelogid: child.val().catelog_id
      }
      offerList.push(data);
    });
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

