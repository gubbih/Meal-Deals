import React from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const currentLanguage = (i18n.resolvedLanguage || i18n.language || "en").toLowerCase();
  const isEnglish = currentLanguage.startsWith("en");
  const isDanish = currentLanguage.startsWith("da");

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => changeLanguage("en")}
        className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
          isEnglish
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        }`}
      >
        English
      </button>
      <button
        onClick={() => changeLanguage("da")}
        className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
          isDanish
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        }`}
      >
        Dansk
      </button>
    </div>
  );
};

export default LanguageSwitcher;
