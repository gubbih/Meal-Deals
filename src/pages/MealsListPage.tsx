import React from "react";
import MealsListView from "../components/MealsListView";

const MealsListPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <MealsListView
        title="All Meals"
        showFilters={true}
        showSearch={true}
        showPagination={true}
        defaultPageSize={12}
      />
    </div>
  );
};

export default MealsListPage;
