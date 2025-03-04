import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Meal } from "../models/Meal";
import { useAuth } from "../services/firebase";
import useFavoriteMeals from "../hooks/useFavoriteMeals";
import FavoriteButton from "./FavoriteButton";

// Responsive breakpoints for the carousel
const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4,
    slidesToSlide: 4,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    slidesToSlide: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
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
    event: React.MouseEvent
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
    <div className="my-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        {title}
      </h2>

      {meals.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">
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
          containerClass="meal-carousel-container"
          removeArrowOnDeviceType={["tablet", "mobile"]}
          dotListClass="custom-dot-list-style"
          itemClass="px-2"
        >
          {meals.map((meal) => (
            <div key={meal.id} className="relative group">
              <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
                <a href={`/meal/${meal.id}`}>
                  <img
                    src={meal.imagePath}
                    alt={meal.name}
                    className="rounded-t-md h-64 w-full object-cover"
                  />
                </a>

                {user && (
                  <FavoriteButton
                    mealId={meal.id}
                    favorites={favorites}
                    handleToggleFavorite={handleToggleFavorite}
                  />
                )}

                <div className="p-4">
                  <a href={`/meal/${meal.id}`}>
                    <h2 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
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
