import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import MealPage from "./pages/MealPage";
import CreatePage from "./pages/CreatePage";
import UserPage from "./pages/UserPage";
import NotFoundPage from "./pages/NotFoundPage";
import { IoMoon, IoSunny } from "react-icons/io5";

function App() {
  const [dark, setDark] = React.useState(false);

  const darkModeHandler = () => {
    setDark(!dark);
    document.body.classList.toggle("dark");
  };

  return (
    <Router>
      <nav className="bg-green-500 p-4">
        <Link to="/" className="text-white text-2xl font-bold">
          Cheap meals!
        </Link>
        <div>
          <Link to="/" className="text-white mx-2">
            Home
          </Link>
          <Link to="/create" className="text-white mx-2">
            Create
          </Link>
          <Link to="/user" className="text-white mx-2">
            User
          </Link>
        </div>
        <div className="bg-green-500 dark:bg-blue-900">
          <button onClick={() => darkModeHandler()}>
            {dark && <IoSunny />}
            {!dark && <IoMoon />}
          </button>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/meal/:id" element={<MealPage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
