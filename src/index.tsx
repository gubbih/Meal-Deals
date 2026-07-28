import React from "react";
import ReactDOM from "react-dom/client";
import "./App.css";
import "./index.css";
import "./i18n";
import App from "./App";

const isDarkModeEnabled = localStorage.getItem("darkMode") === "true";
document.documentElement.classList.toggle("dark", isDarkModeEnabled);
document.body.classList.toggle("dark", isDarkModeEnabled);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
