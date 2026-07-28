import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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
import { CacheProvider } from "./contexts/CacheContext";
import { AuthProvider } from "./contexts/AuthContext";
import CuisinePage from "./pages/CuisinePage";
import MealTypePage from "./pages/MealTypePage";
import CacheDebugPanel from "./components/CacheDebugPanel";

const CACHE_DEFAULT_MAX_AGE_MS = 5 * 60 * 1000;
const CACHE_MAX_SIZE = 150;

function App() {
  return (
    <AuthProvider>
      <CacheProvider
        defaultMaxAge={CACHE_DEFAULT_MAX_AGE_MS}
        maxCacheSize={CACHE_MAX_SIZE}
        persistToStorage={true}
      >
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
                  <Route path="/cuisine/:cuisine" element={<CuisinePage />} />
                  <Route
                    path="/meal-type/:mealType"
                    element={<MealTypePage />}
                  />
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
              <CacheDebugPanel />
            </div>
          </Router>
        </ToastProvider>
      </CacheProvider>
    </AuthProvider>
  );
}

export default App;
