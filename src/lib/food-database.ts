import type { FoodItem } from './types';

// This file serves as a template for your local food database.
// You can add as many food items as you like to this array.
// The `name` should be unique.
// The `quantity` is a descriptive string (e.g., "1 cup", "100g", "2 slices").
// The `nutrients` object must contain all five specified nutrient values.

export const LOCAL_FOOD_DATABASE: Omit<FoodItem, 'id'>[] = [
  // Indian Cuisine
  {
    name: 'Roti',
    quantity: '1 medium roti/chapati',
    nutrients: { calories: 85, protein: 3, sodium: 180, potassium: 110, phosphorus: 90 },
  },
  {
    name: 'Basmati Rice (Cooked)',
    quantity: '1 cup',
    nutrients: { calories: 205, protein: 4.3, sodium: 1, potassium: 55, phosphorus: 115 },
  },
  {
    name: 'Toor Dal (Cooked)',
    quantity: '1 cup',
    nutrients: { calories: 218, protein: 14, sodium: 8, potassium: 450, phosphorus: 260 },
  },
  {
    name: 'Paneer',
    quantity: '100 grams',
    nutrients: { calories: 265, protein: 18, sodium: 20, potassium: 130, phosphorus: 320 },
  },
  {
    name: 'Curd (Yogurt)',
    quantity: '1 cup',
    nutrients: { calories: 150, protein: 10, sodium: 110, potassium: 350, phosphorus: 300 },
  },
  {
    name: 'Dosa',
    quantity: '1 medium',
    nutrients: { calories: 147, protein: 4, sodium: 300, potassium: 100, phosphorus: 80 },
  },
  {
    name: 'Sambar',
    quantity: '1 cup',
    nutrients: { calories: 115, protein: 5, sodium: 880, potassium: 250, phosphorus: 100 },
  },
   {
    name: 'Chicken Curry',
    quantity: '1 cup',
    nutrients: { calories: 240, protein: 25, sodium: 600, potassium: 400, phosphorus: 250 },
  },

  // Fruits & Vegetables
  {
    name: 'Apple',
    quantity: '1 medium',
    nutrients: { calories: 95, protein: 0.5, sodium: 2, potassium: 195, phosphorus: 20 },
  },
  {
    name: 'Banana',
    quantity: '1 medium',
    nutrients: { calories: 105, protein: 1.3, sodium: 1, potassium: 422, phosphorus: 31 },
  },
  {
    name: 'Cucumber',
    quantity: '1 large (8-1/4" long)',
    nutrients: { calories: 42, protein: 2, sodium: 6, potassium: 440, phosphorus: 70 },
  },
   {
    name: 'Broccoli (Steamed)',
    quantity: '1 cup',
    nutrients: { calories: 55, protein: 3.7, sodium: 64, potassium: 457, phosphorus: 105 },
  },

  // Proteins
  {
    name: 'Boiled Egg',
    quantity: '1 large',
    nutrients: { calories: 78, protein: 6.3, sodium: 62, potassium: 63, phosphorus: 86 },
  },
  {
    name: 'Grilled Chicken Breast',
    quantity: '100 grams',
    nutrients: { calories: 165, protein: 31, sodium: 74, potassium: 256, phosphorus: 228 },
  },

  // Dairy
  {
    name: 'Milk (Whole)',
    quantity: '1 cup (8 fl oz)',
    nutrients: { calories: 149, protein: 7.7, sodium: 105, potassium: 322, phosphorus: 205 },
  },
];
