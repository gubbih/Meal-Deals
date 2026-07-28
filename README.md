# Cheaper Meal Plan

## Project Overview

This project is a work-in-progress for building a simple meal planning application. The main idea is to help users find recipes and identify the cheapest places to buy ingredients.

---

## To-Do List

create mailing system
reset password
rating system, one rating pr user for each meal (start system or like/dislikes)
create search
create more slings.
fix issues.

## Development Roadmap

### High Priority

- [x] Move everything from Firebase to other host site
  - Move database
  - Move Hosting
  - Move Image hosting
  - Move Auth from firebase

- [ ] **Authentication refinement**

  - [x] Fix user login/creation flow
  - [x] Implement proper validation for authentication forms
  - Add password reset functionality

- [x] **Meal management**

  - Complete the CRUD operations for meals
  - Fix redirect after create/update
  - Implement loading states on all pages

- [x] **Data validation**
  - Implement proper form validation beyond HTML validation
  - Fix type casting issues in MealForm
- [x] **Limmiter on api calls**

### Medium Priority

- [x] **UX improvements**

  - Fix navigation UI issues (create button position)
  - Improve mobile responsiveness
  - Add loading indicators for asynchronous operations

- [x] **Backend optimization**

  - Fix the duplicate offers issue from ABC stores
  - Implement a solution for efficiently handling multiple store catalogs

- [x] **Image handling**

  - Implement image storage.
  - Add image upload functionality

- [ ] **User features**
  - [x] Complete favorites functionality
  - Add meal ratings/reviews

### Lower Priority

- [x] **Performance optimization**

  - Implement lazy loading for components and routes
  - Add caching for frequently accessed data
  - Optimize Firebase calls

- [ ] **Search & filtering**

  - Enhance search functionality for meals
  - Add more sophisticated filtering options

- [ ] **Content management**
  - Add predefined recipes/meals
  - Create sample data for new users

## Technical Tasks

- [x] Remove http image from create meal

- [x] **Fix the foodComponents system**

  - Complete the implementation for adding all components
  - Improve the UI for selecting food components

- [ ] **Test coverage**

  - Add comprehensive unit and integration tests
  - Set up CI/CD pipeline with GitHub Actions

- [x] **Code refactoring**

  - Address TODOs in the codebase
  - Consolidate repeated code patterns
  - Improve type safety in areas using 'any'

- [x] **Environment setup**
  - Configure proper environment variables for different stages
  - Complete Firebase configuration

## Architecture

The project follows a modular structure:

- `/src/components`: Reusable UI components
- `/src/hooks`: Custom React hooks for API integration and state management
- `/src/models`: TypeScript interfaces and types
- `/src/pages`: Page components accessible through routing
- `/src/services`: API service functions
- `/src/assets`: Static assets and configuration

---

## Notes

This is an ongoing project. Contributions and ideas are welcome! The project is not yet functional and is currently in the planning phase.
