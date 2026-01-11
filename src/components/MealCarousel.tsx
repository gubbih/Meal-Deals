import React from "react";
import { useTranslation } from "react-i18next";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Meal } from "../models/Meal";
import { useAuth } from "../contexts/AuthContext";
import MealCard from "./MealCard";

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
  const { t } = useTranslation();

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
            ? t("mealCarousel.noFavoritesYet")
            : t("mealCarousel.noMealsAvailable")}
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
            <MealCard key={meal.id} meal={meal} user={user} />
          ))}
        </Carousel>
      )}
    </div>
  );
};

export default MealCarousel;
