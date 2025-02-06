// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);


function fetchFoodComponents() {
    const foodRef = ref(database, "/foodcompents");
  
    onValue(foodRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log("FoodComponent Data:", data);
      } else {
        console.warn("Ingen data fundet i foodComponents!");
      }
    }, (error) => {
      console.error("Fejl ved hentning af data:", error);
    });
  }
  
  // 🔹 Kald funktionen
  fetchFoodComponents();