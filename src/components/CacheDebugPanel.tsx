import React, { useState } from "react";
import { useCache, CACHE_DURATIONS } from "../contexts/CacheContext";
import { useAuth } from "../services/firebase";

const CacheDebugPanel: React.FC = () => {
  const { user } = useAuth();
  const { getCacheSize, clearExpired, invalidateAll } = useCache();
  const [isOpen, setIsOpen] = useState(false);

  // Only show the debug panel for admin users
  if (!user || !user.isAdmin) {
    return null;
  }

  const formatDuration = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getDurationInfo = () => {
    return [
      {
        name: "Offers",
        duration: formatDuration(CACHE_DURATIONS.OFFERS),
        description: "Updates Monday & Friday nights",
        nextUpdate: getNextUpdateString([1, 5]), // Monday & Friday
      },
      {
        name: "Food Components",
        duration: formatDuration(CACHE_DURATIONS.FOOD_COMPONENTS),
        description: "Updates Monday & Friday nights",
        nextUpdate: getNextUpdateString([1, 5]), // Monday & Friday
      },
      {
        name: "Meals",
        duration: formatDuration(CACHE_DURATIONS.MEALS),
        description: "Can change frequently",
      },
      {
        name: "Meal Details",
        duration: formatDuration(CACHE_DURATIONS.MEAL_DETAIL),
        description: "Individual meal pages",
      },
      {
        name: "User Data",
        duration: formatDuration(CACHE_DURATIONS.USER_DATA),
        description: "User-specific information",
      },
    ];
  };

  const getNextUpdateString = (updateDays: number[]) => {
    const now = new Date();
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    // Find the next update day
    let nextUpdateDay: number;
    const futureUpdateDays = updateDays.filter((day) => day > currentDay);

    if (futureUpdateDays.length > 0) {
      nextUpdateDay = Math.min(...futureUpdateDays);
    } else {
      // Next update is next week
      nextUpdateDay = Math.min(...updateDays);
    }

    return `Next: ${dayNames[nextUpdateDay]}`;
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-red-600 text-white px-3 py-2 rounded-lg text-xs hover:bg-red-700 transition-colors z-50 border border-red-400"
        title="Admin Cache Debug"
      >
        🔧 Admin Cache ({getCacheSize()})
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 border border-red-300 dark:border-red-600 rounded-lg shadow-lg p-4 max-w-sm z-50">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-semibold text-red-900 dark:text-red-100">
          🔧 Admin Cache Debug
        </h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          ✕
        </button>
      </div>

      <div className="space-y-3">
        <div className="text-xs text-gray-600 dark:text-gray-400">
          Cache Items: <span className="font-medium">{getCacheSize()}</span>
          <br />
          <span className="text-red-600 dark:text-red-400 font-medium">
            Admin Only
          </span>
        </div>

        <div className="space-y-2">
          <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300">
            Cache Durations:
          </h4>
          {getDurationInfo().map((item) => (
            <div key={item.name} className="text-xs">
              <div className="font-medium text-gray-900 dark:text-white">
                {item.name}
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                Duration: {item.duration}
              </div>
              <div className="text-gray-500 dark:text-gray-500 text-xs">
                {item.description}
              </div>
              {item.nextUpdate && (
                <div className="text-blue-600 dark:text-blue-400 text-xs">
                  {item.nextUpdate}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex space-x-2 pt-2 border-t border-red-200 dark:border-red-600">
          <button
            onClick={clearExpired}
            className="flex-1 bg-yellow-600 text-white text-xs px-2 py-1 rounded hover:bg-yellow-700 transition-colors"
          >
            Clear Expired
          </button>
          <button
            onClick={invalidateAll}
            className="flex-1 bg-red-600 text-white text-xs px-2 py-1 rounded hover:bg-red-700 transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
};

export default CacheDebugPanel;
