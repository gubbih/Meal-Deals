import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import MealPage from "./pages/MealPage";
import CreateMealPage from "./pages/CreateMealPage";
import UserPage from "./pages/UserPage";
import AuthPage from "./pages/AuthPage";
import NotFoundPage from "./pages/NotFoundPage";
import EditMealPage from "./pages/EditMealPage";
import FavoritesPage from "./pages/FavoritesPage";
import Navigation from "./components/Navigation";
import MyMeals from "./pages/MyMeals";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ToastProvider } from "./contexts/ToastContext";

function App() {
  return (
    <ToastProvider>
      <Router>
        <div className="bg-white dark:bg-gray-900 w-full flex flex-col min-h-screen">
          <Navigation />
          <div className="w-full flex-grow pt-20 px-4 md:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/meal/:id" element={<MealPage />} />
              <Route path="/create" element={<CreateMealPage />} />
              <Route path="/user" element={<UserPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="*" element={<NotFoundPage />} />
              <Route
                path="/meal/:id/edit"
                element={
                  <ProtectedRoute>
                    <EditMealPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/MyMeals"
                element={
                  <ProtectedRoute>
                    <MyMeals />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/favorites"
                element={
                  <ProtectedRoute>
                    <FavoritesPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </div>
      </Router>
    </ToastProvider>
  );
}

export default App;
