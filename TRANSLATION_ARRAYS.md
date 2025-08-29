# Translation Implementation for Arrays

## Overview
This document explains how to handle translatable arrays in the Meal Deals application.

## Problem
The original `Arrays.ts` file contained hardcoded values in Danish/English, making it difficult to support multiple languages.

## Solution

### 1. Updated Arrays.ts
- Renamed arrays to `cuisineKeys` and `mealTypeKeys` to indicate they are translation keys
- Kept original exports for backward compatibility
- These keys correspond to entries in the translation JSON files

### 2. Created Translation Helper Functions
Located in `src/utils/translationHelpers.ts`:

#### Core Functions:
- `getTranslatedCuisines(t)` - Returns cuisine options with translated labels for dropdowns
- `getTranslatedMealTypes(t)` - Returns meal type options with translated labels for dropdowns
- `translateCuisine(cuisine, t)` - Translates a single cuisine key
- `translateMealType(mealType, t)` - Translates a single meal type key

#### Additional Utilities:
- `getTranslatedCuisineNames(t)` - Returns array of translated cuisine names
- `getTranslatedMealTypeNames(t)` - Returns array of translated meal type names

### 3. Updated Components
Modified the following components to use translations:

#### Forms and Dropdowns:
- `MealForm.tsx` - Uses `getTranslatedCuisines()` and `getTranslatedMealTypes()` for select options

#### Display Components:
- `MealPage.tsx` - Uses `translateCuisine()` and `translateMealType()` for displaying meal details
- `MyMeals.tsx` - Uses translation helpers for meal cards
- `UserPage.tsx` - Uses `translateMealType()` for favorite meals display

#### Navigation:
- `Navigation.tsx` - Already properly implemented using `t(\`cuisines.${cuisine}\`)`

### 4. Translation Files
The translation keys are defined in:
- `src/i18n/locales/en.json` - English translations
- `src/i18n/locales/da.json` - Danish translations

Example structure:
```json
{
  "cuisines": {
    "Danish": "Danish",
    "Italian": "Italian",
    "Chinese": "Chinese"
  },
  "mealTypes": {
    "Morgenmad": "Breakfast",
    "Frokost": "Lunch",
    "Aftensmad": "Dinner"
  }
}
```

## Usage Examples

### In a Form Component:
```tsx
import { useTranslation } from "react-i18next";
import { getTranslatedCuisines } from "../utils/translationHelpers";

const MyComponent = () => {
  const { t } = useTranslation();
  const cuisineOptions = getTranslatedCuisines(t);
  
  return (
    <Select 
      options={cuisineOptions}
      placeholder={t('selectCuisine')}
    />
  );
};
```

### For Display:
```tsx
import { useTranslation } from "react-i18next";
import { translateCuisine } from "../utils/translationHelpers";

const MealDisplay = ({ meal }) => {
  const { t } = useTranslation();
  
  return (
    <div>
      <span>{translateCuisine(meal.mealCuisine, t)}</span>
    </div>
  );
};
```

## Benefits

1. **Scalability** - Easy to add new languages by adding translation files
2. **Consistency** - Centralized translation logic
3. **Type Safety** - Helper functions handle undefined values gracefully
4. **Backward Compatibility** - Original array exports still work for validation
5. **User Experience** - Arrays are now properly localized

## Adding New Languages

To add a new language:
1. Create a new JSON file in `src/i18n/locales/` (e.g., `fr.json`)
2. Add translations for `cuisines` and `mealTypes` objects
3. Update `src/i18n/index.ts` to include the new language
4. All array translations will automatically work!
