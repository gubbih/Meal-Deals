import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css"; // Import Tailwind CSS
import App from "./App";

// Create a root element
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

// Render the App component inside React.StrictMode
root.render(
  <div className="bg-white dark:bg-black dark:bg-gray-900 min-h-screen">
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </div>,
);
