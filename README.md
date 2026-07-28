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

---

## SSH Auto-Deploy (cPanel + Passenger)

This repository can auto-deploy on pushes to `main` using GitHub Actions and SSH.

### What triggers deployment

Deployment runs only when a pull request is merged into `main` and it changes at least one of:

- `src/**`
- `package.json`
- `package-lock.json`
- `deploy-ssh.sh`
- `.github/workflows/deploy.yml`

Merge commits are detected and skipped.

### Files used

- Workflow: `.github/workflows/deploy.yml`
- Server script: `deploy-ssh.sh`

### Required GitHub repository secrets

- `SSH_HOST`: server hostname (example: `api.cheapmeals.dk`)
- `SSH_PORT`: SSH port (usually `22`)
- `SSH_USER`: SSH username
- `SSH_PRIVATE_KEY`: private key for the deploy user (recommended)
- `SSH_PASSWORD`: SSH password (optional fallback if no key is used)
- `SSH_KNOWN_HOSTS`: output from `ssh-keyscan -p <port> <host>`

Optional (recommended for private repositories when server SSH key is not already trusted by GitHub):

- `GH_DEPLOY_TOKEN`: GitHub token with repository read access

### Server prerequisites

1. App directory exists at `/home/cheapmea/api.cheapmeals.dk`.
2. The directory is a git clone of this repository.
3. `node`, `npm`, and `git` are installed on the server.
4. Passenger app restarts when `tmp/restart.txt` is touched.

### First-time server setup example

```bash
cd /home/cheapmea
git clone git@github.com:<org-or-user>/<repo>.git api.cheapmeals.dk
cd api.cheapmeals.dk
chmod +x deploy-ssh.sh
```

If using HTTPS for a private repo, ensure the server can fetch with credentials (or provide `GH_DEPLOY_TOKEN` as a repository secret).

### Deployment flow on server

`deploy-ssh.sh` does the following:

1. Fetches latest code from `main` (supports private repo via token).
2. Sets `NODE_ENV=development` for build tooling.
3. Runs `npm ci --include=dev`, and falls back to `npm install --include=dev` if lockfile mismatch occurs.
4. Builds the app (`build/`).
5. Switches to production mode and prunes dev dependencies.
6. Touches `tmp/restart.txt` to restart Passenger.
