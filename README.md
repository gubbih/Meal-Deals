# Cheaper Meal Plan

## Project Overview

This project is a work-in-progress for building a simple meal planning application. The main idea is to help users find recipes and identify the cheapest places to buy ingredients.

---

## To-Do List

## Development Roadmap

### High Priority

- [ ] **Authentication refinement**

  - Fix user login/creation flow
  - [x] Implement proper validation for authentication forms
  - Add password reset functionality

- [ ] **Meal management**

  - Complete the CRUD operations for meals
  - Fix redirect after create/update
  - Implement loading states on all pages

- [ ] **Firebase security**

  - Implement proper Firebase security rules
  - Set up admin SDK correctly

- [ ] **Data validation**
  - Implement proper form validation beyond HTML validation
  - Fix type casting issues in MealForm

### Medium Priority

- [ ] **UX improvements**

  - Fix navigation UI issues (create button position)
  - Improve mobile responsiveness
  - Add loading indicators for asynchronous operations

- [ ] **Backend optimization**

  - Fix the duplicate offers issue from ABC stores
  - Implement a solution for efficiently handling multiple store catalogs

- [ ] **Image handling**

  - Implement image storage with Supabase
  - Add image upload functionality

- [ ] **User features**
  - Complete favorites functionality
  - Add meal ratings/reviews

### Lower Priority

- [ ] **Performance optimization**

  - Implement lazy loading for components and routes
  - Add caching for frequently accessed data
  - Optimize Firebase calls

- [ ] **Search & filtering**

  - Enhance search functionality for meals
  - Add more sophisticated filtering options

- [ ] **Social features**

  - Implement sharing functionality
  - Allow users to comment on meals

- [ ] **Content management**
  - Add predefined recipes/meals
  - Create sample data for new users

## Technical Tasks

- [ ] **Fix the foodComponents system**

  - Complete the implementation for adding all components
  - Improve the UI for selecting food components

- [ ] **Test coverage**

  - Add comprehensive unit and integration tests
  - Set up CI/CD pipeline with GitHub Actions

- [ ] **Code refactoring**

  - Address TODOs in the codebase
  - Consolidate repeated code patterns
  - Improve type safety in areas using 'any'

- [ ] **Environment setup**
  - Configure proper environment variables for different stages
  - Complete Firebase configuration

## Architecture

The project follows a modular structure:

- `/src/components`: Reusable UI components
- `/src/hooks`: Custom React hooks for Firebase and state management
- `/src/models`: TypeScript interfaces and types
- `/src/pages`: Page components accessible through routing
- `/src/services`: Firebase service functions
- `/src/assets`: Static assets and configuration

---

## Notes

This is an ongoing project. Contributions and ideas are welcome! The project is not yet functional and is currently in the planning phase.
