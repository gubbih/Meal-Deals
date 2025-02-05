import { initializeApp } from 'firebase/app';
import { Database, getDatabase, ref, set, push} from 'firebase/database';
import { getAuth, signInWithEmailAndPassword, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { dummyMeals, Meal } from '../models/Meal';
import { User } from '../models/User';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getDatabase();
const auth = getAuth(app);
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
  return signInWithEmailAndPassword(auth, email, password);
};

export const signOut = () => {
  throw new Error('Not implemented');
};

export const useAuth = (): User | null => {
  throw new Error('Not implemented');
};

