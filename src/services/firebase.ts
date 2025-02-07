import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, push, set, get } from "firebase/database";
import { dummyMeals, Meal } from '../models/Meal';
import { User } from '../models/User';
import { FoodComponent } from '../models/FoodComponent';
import { Offer } from '../models/Offer';

const firebaseConfig = {
  apiKey: "AIzaSyCsCQ_943yRXb_mjw9_WLeIlN8Eu6SMLa8",
  authDomain: "meal-deals-2b177.firebaseapp.com",
  databaseURL: "https://meal-deals-2b177-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "meal-deals-2b177",
  storageBucket: "meal-deals-2b177.firebasestorage.app",
  messagingSenderId: "160668943646",
  appId: "1:160668943646:web:34f06f3de84760385ef50f",
  measurementId: "G-3W874VXGT0"
};
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);



//##############################################
//###########         GET           ############
//##############################################


export const getMeals = async (): Promise<Meal[]> => {
  // Todo: Implement fetching meals from Firebase
  return dummyMeals as Meal[];
};

export const getMeal = async (id: string): Promise<Meal> => {
  //Todo: Implement fetching meal from Firebase
  return dummyMeals.find(meal => meal.id === id) as Meal;
};

export const getFoodComponents = async (): Promise<FoodComponent[]> => {
  return new Promise((resolve, reject) => {
    const foodRef = ref(db, "/foodComponents");

    onValue(foodRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const foodArray = Object.entries(data).map(([key, value]) => ({
          category: key,              // Use the key as the category
          items: value as string[],   // Assert that items is an array of strings
        }));
        console.log("Data hentet fra foodComponents:", foodArray);
        resolve(foodArray as FoodComponent[]);
      } else {
        console.warn("Ingen data fundet i foodComponents!");
        resolve([]);
      }
    }, (error) => {
      console.error("Fejl ved hentning af data:", error);
      reject(error);
    });
  });
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

