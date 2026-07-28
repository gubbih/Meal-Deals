# Feature Ideas Roadmap

This document captures proposed product features for Meal Deals.

## Priority Legend

- High: Strong product impact and should be prioritized.
- Medium: Valuable, but can follow after high-priority items.
- Low: Nice to have or may require larger structural changes first.

## Features

1. Smart price-per-meal calculator  
   Priority: Medium  
   Status: [ ] Prioritized  
   Estimate total meal cost from selected store offers and show cost per serving.

Implementation notes:

- Show a coverage message, for example: "Missing offer data for 5 ingredients".
- Add a confidence label based on offer coverage:
  - High: >= 80%
  - Medium: 50-79%
  - Low: < 50%

2. Weekly meal planner  
   Priority: Medium  
   Status: [ ] Prioritized  
   Drag meals into a week view and auto-generate a combined shopping list.

3. Auto shopping list from meal  
   Priority: Medium  
   Status: [ ]  
   One-click add ingredients to a shopping list, grouped by store/category.

4. Offer expiry + urgency badges  
   Priority: High  
   Status: [ ]  
   Show labels like "ends today" or "2 days left" to drive action.

5. Ingredient substitutions  
   Priority: low  
   Status: [ ]  
   Suggest cheaper or available alternatives when offers are missing.

6. Pantry mode  
   Priority: low  
   Status: [ ]  
   Users mark ingredients they already have; total meal cost updates dynamically.

7. Dietary filters  
   Priority: low  
   Status: [ ]  
   Vegetarian, vegan, gluten-free, dairy-free, nut-free, high-protein, etc.

8. Best store combo optimizer  
   Priority: low  
   Status: [ ]  
   Recommend the cheapest single-store or multi-store combination for a meal.

9. Saved alerts  
   Priority: low  
   Status: [ ]  
   Examples: "Notify me when chicken is on sale" or "when this meal drops below X DKK".

10. User ratings + reviews  
    Priority: High  
    Status: [ ]  
    Community quality signal for meals and practical tips.

11. Meal difficulty + prep time  
    Priority: Low  
    Status: [ ]  
    Useful metadata for quick decision-making.

12. Portion scaling  
    Priority: Medium  
    Status: [ ]  
    2/4/6 servings with automatic ingredient and price recalculation.

13. Recipe steps + cooking mode  
    Priority: Low  
    Status: [ ]  
    Step-by-step fullscreen mode with timers and focused cooking UX.

14. Shareable meal links/cards  
    Priority: Medium  
    Status: [ ]  
    Share to social or copy link with meal image and current offer highlights.

15. Admin moderation dashboard  
    Priority: High  
    Status: []  
    Approve/edit user meals, flag duplicates, and manage low-quality submissions.

## Notes

- You mentioned timer and difficulty can be nice, but usefulness depends on cooking confidence and may require database rework.
- Because of that, the related items (11 and 13) are currently marked as Low priority.
