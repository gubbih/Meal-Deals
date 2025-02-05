import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc, addDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { Meal } from '../models/Meal';
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
const db = getFirestore(app);
const auth = getAuth(app);

export const getMeals = async (): Promise<Meal[]> => {
  const mealsCol = collection(db, 'meals');
  const mealSnapshot = await getDocs(mealsCol);
  return mealSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Meal));
};

export const getMeal = async (id: string): Promise<Meal> => {
  const mealDoc = doc(db, 'meals', id);
  const mealSnapshot = await getDoc(mealDoc);
  return { id: mealSnapshot.id, ...mealSnapshot.data() } as Meal;
};

export const addMeal = async (meal: Meal): Promise<void> => {
  const mealsCol = collection(db, 'meals');
  await addDoc(mealsCol, meal);
};

export const signIn = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const signOut = () => {
  return firebaseSignOut(auth);
};

export const useAuth = (): User | null => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const { uid, email, displayName } = firebaseUser;
        const [firstName, lastName] = displayName ? displayName.split(' ') : ['', ''];
        setUser({ id: uid, email: email || '', firstName, lastName });
      } else {
        setUser(null);
      }
    });
    return unsubscribe;
  }, []);

  return user;
};
