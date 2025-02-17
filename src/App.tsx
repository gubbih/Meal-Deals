import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import MealPage from "./pages/MealPage";
import CreateMealPage from "./pages/CreateMealPage";
import UserPage from "./pages/UserPage";
import NotFoundPage from "./pages/NotFoundPage";
import EditMealPage from "./pages/EditMealPage";
import Navigation from "./components/Navigation";

function App() {
  return (
    <Router>
      <div className="bg-white dark:bg-gray-900 w-full flex justify-center">
        <div className="w-4/5">
          <Navigation />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/meal/:id" element={<MealPage />} />
            <Route path="/create" element={<CreateMealPage />} />
            <Route path="/user" element={<UserPage />} />
            <Route path="*" element={<NotFoundPage />} />
            <Route path="/meal/:id/edit" element={<EditMealPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
