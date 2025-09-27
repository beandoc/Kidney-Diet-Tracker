import type { FoodItem } from './types';
import { fruitsAndVeggies } from './data/fruits-and-veggies';
import { indianCuisine } from './data/indian-cuisine';
import { nutsAndSeeds } from './data/nuts-and-seeds';
import { dairyAndEggs } from './data/dairy-and-eggs';

// This file serves as a central point to combine all local food databases.
// The `LOCAL_FOOD_DATABASE` is an aggregation of all food items from the /data directory.

export const LOCAL_FOOD_DATABASE: Omit<FoodItem, 'id'>[] = [
  ...indianCuisine,
  ...fruitsAndVeggies,
  ...nutsAndSeeds,
  ...dairyAndEggs,
];

// This list contains only the foods that are frequently tracked.
// It is separate from the main database to keep the "Add Meal" dialog clean.
// For now, we will keep it simple, but this could be dynamic in the future.
export const FREQUENTLY_TRACKED_FOODS: Omit<FoodItem, 'id'>[] = [
  ...indianCuisine,
  {
    name: 'Apple',
    quantity: '100g',
    nutrients: { calories: 52, protein: 0.26, sodium: 1, potassium: 107, phosphorus: 11 },
  },
  {
    name: 'Banana',
    quantity: '100g',
    nutrients: { calories: 89, protein: 1.09, sodium: 1, potassium: 358, phosphorus: 22 },
  },
  {
    name: 'Boiled Egg',
    quantity: '1 large',
    nutrients: { calories: 78, protein: 6.3, sodium: 62, potassium: 63, phosphorus: 86 },
  },
   {
    name: 'Milk (Cow)',
    quantity: '100g',
    nutrients: { calories: 61, protein: 3.15, sodium: 43, potassium: 132, phosphorus: 84 },
  },
  {
    name: 'Butter',
    quantity: '100g',
    nutrients: { calories: 717, protein: 0.85, sodium: 11, potassium: 24, phosphorus: 24 },
  },
];
