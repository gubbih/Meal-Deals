import React from 'react';
import './App.css';
import HomePage from './pages/HomePage';
import MealPage from './pages/MealPage';
import CreatePage from './pages/CreatePage';
import UserPage from './pages/UserPage';


function App() {
  // Extract the meal ID from the URL if it exists
  const mealId = window.location.pathname.startsWith("/meal/") 
    ? window.location.pathname.split("/meal/")[1] 
    : null;

  return (
    <div>
      <nav className="bg-green-500 p-4">
        <a href="/" className="text-white text-2xl font-bold">Cheap meals!</a>
        <div>
          <a href="/" className="text-white mx-2">Home</a>
          <a href="/create" className="text-white mx-2">Create</a>
          <a href="/user" className="text-white mx-2">User</a>
        </div>
      </nav>
      <div>
        {/* Manually render components based on the current URL */}
        {window.location.pathname === "/" && <HomePage />}
        {mealId && <MealPage id={mealId} />}
        {window.location.pathname === "/create" && <CreatePage />}
        {window.location.pathname === "/user" && <UserPage />}
      </div>
    </div>
  );
}

export default App;


