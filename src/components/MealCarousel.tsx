import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Meal } from "../models/Meal";
import { useAuth } from "../services/firebase";
import useFavoriteMeals from "../hooks/useFavoriteMeals";
import FavoriteButton from "./FavoriteButton";

// Responsive breakpoints for the carousel - improved for mobile
const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4,
    slidesToSlide: 1, // Reduced for smoother scrolling
  },
  tablet: {
    breakpoint: { max: 1024, min: 640 },
    items: 2,
    slidesToSlide: 1,
  },
  mobile: {
    breakpoint: { max: 640, min: 0 },
    items: 1.2, // Show a peek of the next item
    slidesToSlide: 1,
  },
};

interface MealCarouselProps {
  meals: Meal[];
  title: string;
  isFavoriteSection?: boolean;
}

const MealCarousel: React.FC<MealCarouselProps> = ({
  meals,
  title,
  isFavoriteSection = false,
}) => {
  const { user } = useAuth();
  const { addToFavorites, removeFromFavorites, favorites } = useFavoriteMeals();

  const handleToggleFavorite = async (
    mealId: string,
    event: React.MouseEvent,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (!user) return;

    try {
      if (favorites.includes(mealId)) {
        await removeFromFavorites(mealId);
      } else {
        await addToFavorites(mealId);
      }
    } catch (error) {
      console.error("Failed to toggle favorite", error);
    }
  };

  // If it's a favorite section and no favorites, return null
  if (isFavoriteSection && meals.length === 0) {
    return null;
  }

  return (
    <div className="my-6 md:my-8">
      <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-gray-900 dark:text-white px-2">
        {title}
      </h2>

      {meals.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400 px-2">
          {isFavoriteSection
            ? "You haven't added any favorite meals yet."
            : "No meals available."}
        </p>
      ) : (
        <Carousel
          swipeable={true}
          draggable={true}
          showDots={true}
          responsive={responsive}
          infinite={false}
          autoPlay={false}
          keyBoardControl={true}
          customTransition="all .5s ease"
          transitionDuration={500}
          containerClass="meal-carousel-container pb-10" // Added padding bottom for dots
          removeArrowOnDeviceType={["mobile"]}
          dotListClass="custom-dot-list-style"
          itemClass="px-2"
          partialVisible={true} // Shows partial next item
        >
          {meals.map((meal) => (
            <div key={meal.id} className="relative group pb-1">
              <div className="w-full bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 h-full">
                <a
                  href={`/meal/${meal.id}`}
                  className="block overflow-hidden rounded-t-lg"
                >
                  <img
                    src={meal.imagePath}
                    alt={meal.name}
                    className="rounded-t-md h-40 sm:h-48 md:h-56 w-full object-cover transform transition-transform duration-300 group-hover:scale-105"
                  />
                </a>

                {user && (
                  <FavoriteButton
                    mealId={meal.id}
                    favorites={favorites}
                    handleToggleFavorite={handleToggleFavorite}
                  />
                )}

                <div className="p-3 md:p-4">
                  <a href={`/meal/${meal.id}`}>
                    <h2 className="text-lg md:text-xl font-semibold tracking-tight text-gray-900 dark:text-white line-clamp-2">
                      {meal.name}
                    </h2>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      )}
    </div>
  );
};

export default MealCarousel;
