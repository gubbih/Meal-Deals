import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  IoMoon,
  IoSunny,
  IoMenu,
  IoClose,
  IoChevronDown,
} from "react-icons/io5";
import { useAuth, signOut } from "../services/firebase";
import { cuisines, mealsTypes } from "../assets/Arrays";

function Navigation() {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cuisineDropdownOpen, setCuisineDropdownOpen] = useState(false);
  const [mealTypeDropdownOpen, setMealTypeDropdownOpen] = useState(false);
  const [cuisineTimeout, setCuisineTimeout] = useState<NodeJS.Timeout | null>(
    null,
  );
  const [mealTypeTimeout, setMealTypeTimeout] = useState<NodeJS.Timeout | null>(
    null,
  );
  const { user } = useAuth();

  React.useEffect(() => {
    if (dark) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [dark]);

  const darkModeHandler = () => {
    const newDarkMode = !dark;
    setDark(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode.toString());
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setMobileMenuOpen(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleCuisineMouseEnter = () => {
    if (cuisineTimeout) {
      clearTimeout(cuisineTimeout);
      setCuisineTimeout(null);
    }
    setCuisineDropdownOpen(true);
  };

  const handleCuisineMouseLeave = () => {
    const timeout = setTimeout(() => {
      setCuisineDropdownOpen(false);
    }, 100); // 100ms delay
    setCuisineTimeout(timeout);
  };

  const handleMealTypeMouseEnter = () => {
    if (mealTypeTimeout) {
      clearTimeout(mealTypeTimeout);
      setMealTypeTimeout(null);
    }
    setMealTypeDropdownOpen(true);
  };

  const handleMealTypeMouseLeave = () => {
    const timeout = setTimeout(() => {
      setMealTypeDropdownOpen(false);
    }, 100); // 100ms delay
    setMealTypeTimeout(timeout);
  };

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900 fixed w-full z-30 top-0 start-0">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3">
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            Cheap Meals
          </span>
        </Link>

        {/* Dark Mode Toggle - Always Visible */}
        <div className="flex items-center space-x-3">
          <button
            onClick={darkModeHandler}
            className={`relative inline-flex items-center h-6 rounded-full w-11 focus:outline-none ${
              dark ? "bg-blue-600" : "bg-gray-200"
            }`}
            aria-label="Toggle dark mode"
          >
            <span
              className={`transform transition ease-in-out duration-200 ${
                dark ? "translate-x-6" : "translate-x-1"
              } inline-block w-4 h-4 rounded-full bg-white`}
            />
            {dark ? (
              <IoSunny className="absolute left-1 text-yellow-500" />
            ) : (
              <IoMoon className="absolute right-1 text-gray-500" />
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={toggleMobileMenu}
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-label="Open main menu"
          >
            {mobileMenuOpen ? <IoClose size={24} /> : <IoMenu size={24} />}
          </button>
        </div>

        {/* Navigation Menu */}
        <div
          className={`${
            mobileMenuOpen ? "block" : "hidden"
          } w-full md:block md:w-auto fixed md:relative top-16 left-0 right-0 md:top-auto md:left-auto bg-white dark:bg-gray-900 md:bg-transparent md:dark:bg-transparent z-10 shadow-lg md:shadow-none`}
        >
          <ul className="flex flex-col p-4 md:p-0 mt-0 md:mt-0 md:flex-row md:space-x-8 font-medium border-t border-gray-200 md:border-0 dark:border-gray-700">
            {/* Home - Always Visible */}
            <li>
              <Link
                to="/"
                className="block py-2 px-3 text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
            </li>

            {/* Cuisines Dropdown - Always Visible */}
            <li className="relative group">
              <button
                onMouseEnter={handleCuisineMouseEnter}
                onMouseLeave={handleCuisineMouseLeave}
                onClick={() => setCuisineDropdownOpen(!cuisineDropdownOpen)}
                className="flex items-center py-2 px-3 text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
              >
                Cuisines
                <IoChevronDown className="ml-1 h-4 w-4" />
              </button>
              <div
                className={`${
                  cuisineDropdownOpen ? "block" : "hidden"
                } absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-20`}
                onMouseEnter={handleCuisineMouseEnter}
                onMouseLeave={handleCuisineMouseLeave}
              >
                {cuisines.map((cuisine) => (
                  <Link
                    key={cuisine}
                    to={`/cuisine/${cuisine}`}
                    className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setCuisineDropdownOpen(false);
                    }}
                  >
                    {cuisine}
                  </Link>
                ))}
              </div>
            </li>

            {/* Meal Types Dropdown - Always Visible */}
            <li className="relative group">
              <button
                onMouseEnter={handleMealTypeMouseEnter}
                onMouseLeave={handleMealTypeMouseLeave}
                onClick={() => setMealTypeDropdownOpen(!mealTypeDropdownOpen)}
                className="flex items-center py-2 px-3 text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
              >
                Meal Types
                <IoChevronDown className="ml-1 h-4 w-4" />
              </button>
              <div
                className={`${
                  mealTypeDropdownOpen ? "block" : "hidden"
                } absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-20`}
                onMouseEnter={handleMealTypeMouseEnter}
                onMouseLeave={handleMealTypeMouseLeave}
              >
                {mealsTypes.map((mealType) => (
                  <Link
                    key={mealType}
                    to={`/meal-type/${mealType}`}
                    className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setMealTypeDropdownOpen(false);
                    }}
                  >
                    {mealType}
                  </Link>
                ))}
              </div>
            </li>

            {/* User-specific routes - Only visible when logged in */}
            {user && (
              <>
                <li>
                  <Link
                    to="/create"
                    className="block py-2 px-3 text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Create Meal
                  </Link>
                </li>
                <li>
                  <Link
                    to="/MyMeals"
                    className="block py-2 px-3 text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Meals
                  </Link>
                </li>
                <li>
                  <Link
                    to="/favorites"
                    className="block py-2 px-3 text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Favorites
                  </Link>
                </li>
              </>
            )}

            {/* Admin route - Only visible to admin users */}
            {user && user.isAdmin && (
              <li>
                <Link
                  to="/admin"
                  className="block py-2 px-3 text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin
                </Link>
              </li>
            )}

            {/* Authentication actions */}
            {user ? (
              <>
                <li>
                  <Link
                    to="/user"
                    className="block py-2 px-3 text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleSignOut}
                    className="block py-2 px-3 text-red-600 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-red-700 md:p-0 dark:text-red-500 md:dark:hover:text-red-500 dark:hover:bg-gray-700 dark:hover:text-red-500 md:dark:hover:bg-transparent"
                  >
                    Sign Out
                  </button>
                </li>
              </>
            ) : (
              <li className="flex flex-col sm:flex-row sm:space-x-6">
                <Link
                  to="/auth"
                  className="block py-2 px-5 text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent mb-2 sm:mb-0"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/auth?signup=true"
                  className="block py-2 px-5 text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent mb-2 sm:mb-0"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
