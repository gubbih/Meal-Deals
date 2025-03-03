import React from "react";
import { Link } from "react-router-dom";
import { IoMoon, IoSunny } from "react-icons/io5";
import { useAuth, signOut } from "../services/firebase";

function Navigation() {
  const [dark, setDark] = React.useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  const { user } = useAuth();

  React.useEffect(() => {
    if (dark) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [dark]);

  const darkModeHandler = () => {
    setDark(!dark);
    localStorage.setItem("darkMode", (!dark).toString());
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="/" className="flex items-center space-x-3 ">
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            Cheap Meals
          </span>
        </a>
        <div className="block items-center md:order-2 space-x-1 md:space-x-2">
          <button
            onClick={darkModeHandler}
            className={`relative inline-flex items-center h-6 rounded-full w-11 focus:outline-none ${
              dark ? "bg-blue-600" : "bg-gray-200"
            }`}
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
        </div>
        <div className="flex items-center md:order-3 space-x-1 md:space-x-1 ">
          <div className="flex items-center md:order-2 space-x-1 md:space-x-2 md:flex hidden">
            {user ? (
              <>
                <span className="text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-2 md:px-5 md:py-2.5 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800">
                  <a href="/user">{user.displayName}</a>
                </span>
                <button
                  onClick={handleSignOut}
                  className="block px-3 text-red-600 hover:bg-gray-50 md:hover:bg-transparent md:hover:text-red-600 md:p-0 dark:text-red-500 md:dark:hover:text-red-500 dark:hover:bg-gray-700 dark:hover:text-red-500 md:dark:hover:bg-transparent"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <a
                  href="/user"
                  className="text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-2 md:px-5 md:py-2.5 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
                >
                  Login
                </a>
                <a
                  href="/user"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 md:px-5 md:py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                  Sign up
                </a>
              </>
            )}
          </div>
          <div className="flex items-center justify-between w-full md:flex md:w-auto md:order-1 md:space-x-1 ">
            <ul className="flex flex-row font-medium md:flex-row md:mt-0 md:space-x-8 ">
              <Link
                to="/"
                className="block px-3 text-blue-600 hover:bg-gray-50 md:hover:bg-transparent md:hover:text-blue-600 md:p-0 dark:text-blue-500 md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-blue-500 md:dark:hover:bg-transparent"
              >
                Home
              </Link>
              <Link
                to="/create"
                className="block px-3 text-blue-600 hover:bg-gray-50 md:hover:bg-transparent md:hover:text-blue-600 md:p-0 dark:text-blue-500 md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-blue-500 md:dark:hover:bg-transparent"
              >
                Create meal
              </Link>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
