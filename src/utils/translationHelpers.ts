import { cuisineKeys, mealTypeKeys } from '../assets/Arrays';

/**
 * Get translated cuisine options for dropdowns/selects
 * @param t - Translation function from useTranslation hook
 * @returns Array of objects with value (key) and label (translated text)
 */
export const getTranslatedCuisines = (t: any) => {
  return cuisineKeys.map((cuisine) => ({
    value: cuisine,
    label: t(`cuisines.${cuisine}`)
  }));
};

/**
 * Get translated meal type options for dropdowns/selects
 * @param t - Translation function from useTranslation hook
 * @returns Array of objects with value (key) and label (translated text)
 */
export const getTranslatedMealTypes = (t: any) => {
  return mealTypeKeys.map((mealType) => ({
    value: mealType,
    label: t(`mealTypes.${mealType}`)
  }));
};

/**
 * Get just the translated cuisine names as an array
 * @param t - Translation function from useTranslation hook
 * @returns Array of translated cuisine names
 */
export const getTranslatedCuisineNames = (t: any) => {
  return cuisineKeys.map((cuisine) => t(`cuisines.${cuisine}`));
};

/**
 * Get just the translated meal type names as an array
 * @param t - Translation function from useTranslation hook
 * @returns Array of translated meal type names
 */
export const getTranslatedMealTypeNames = (t: any) => {
  return mealTypeKeys.map((mealType) => t(`mealTypes.${mealType}`));
};

/**
 * Translate a single cuisine key
 * @param cuisine - The cuisine key
 * @param t - Translation function
 * @returns Translated cuisine name
 */
export const translateCuisine = (cuisine: string | undefined, t: any) => {
  if (!cuisine) return '';
  return t(`cuisines.${cuisine}`);
};

/**
 * Translate a single meal type key
 * @param mealType - The meal type key
 * @param t - Translation function
 * @returns Translated meal type name
 */
export const translateMealType = (mealType: string | undefined, t: any) => {
  if (!mealType) return '';
  return t(`mealTypes.${mealType}`);
};
