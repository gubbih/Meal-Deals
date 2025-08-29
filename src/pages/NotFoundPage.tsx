import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-12 text-center">
      <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
        404
      </h1>
      <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
        {t("notFoundPage.pageNotFound")}
      </h2>
      <p className="text-gray-600 dark:text-gray-400 max-w-md mb-8">
        {t("notFoundPage.sorryMessage")}
      </p>
      <Link
        to="/"
        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
      >
        {t("notFoundPage.goBackHome")}
      </Link>
    </div>
  );
}

export default NotFoundPage;
