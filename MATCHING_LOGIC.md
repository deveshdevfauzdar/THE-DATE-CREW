# Matching Logic Documentation

## Overview
The matching engine in The Date Crew dashboard is a deterministic, 8-dimensional weighted algorithm designed specifically for Indian matchmaking nuances. Unlike standard dating apps, this algorithm respects strict cultural, familial, and gender-specific preferences.

## 8-Dimension Scoring Matrix

The algorithm evaluates compatibility across 8 distinct dimensions, each carrying a specific weight out of a total 100 points:

1. **Age Compatibility (20 points)**
   - Checks if the candidate falls within the customer's specified `ageMin` and `ageMax`.
   - Uses gender-specific logic (e.g., standardizing the expectation of male partners being slightly older).

2. **Education (15 points)**
   - Compares the candidate's highest qualification against the customer's preferred education tier.
   - Exact matches or higher tiers receive full points.

3. **Income (15 points)**
   - Checks if the candidate's annual income falls within the requested `incomeMin` and `incomeMax` LPA.
   - For male customers looking for female partners, income matching is often more flexible unless explicitly stated.

4. **Location & Relocation (15 points)**
   - **Primary Check:** Is the candidate in a preferred city? (10 points)
   - **Secondary Check:** If not in a preferred city, is the candidate `openToRelocate`? (5 points)

5. **Religion & Caste (15 points)**
   - Evaluates strict adherence to `preferredReligion` and `preferredCaste`.
   - In premium Indian matchmaking, this is often a hard requirement. Non-matches here severely penalize the score.

6. **Lifestyle & Habits (10 points)**
   - Compares `dietaryPreference` (e.g., Vegetarian vs Non-Vegetarian).
   - Compares `smokingPreference` and `drinkingPreference`.

7. **Family & Children (5 points)**
   - Evaluates alignment on `wantKids` (e.g., "Yes", "No", "Maybe").

8. **Interests & Hobbies (5 points)**
   - Calculates the Jaccard similarity (overlap) between the two arrays of hobbies/interests.

## Gender-Specific Logic
The algorithm does not treat matches symmetrically:
- **Male Customers:** The algorithm slightly biases towards female candidates who are 1-4 years younger, aligning with traditional market dynamics.
- **Female Customers:** The algorithm enforces strict lower bounds on the candidate's income relative to the customer's income, ensuring the candidate meets the premium threshold.

## Execution
The `generateMatches()` function takes a `customerId`, retrieves the customer profile, filters out their own gender (assuming heterosexual matching for this MVP), and calculates the 8-dimensional score for every possible candidate. It then returns the top 10 highest-scoring profiles.
