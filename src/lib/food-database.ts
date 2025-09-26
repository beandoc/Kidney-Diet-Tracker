import type { FoodItem } from './types';

// Nutrient data for frequently tracked foods.
// In a real app, this would come from a proper database and the AI would provide all nutrients.
// For now, we are mocking the data based on the provided image, filling in missing values.

export const FREQUENTLY_TRACKED_FOODS: Omit<FoodItem, 'id'>[] = [
  {
    name: 'Roti',
    quantity: '2.0 roti/chapati',
    nutrients: { calories: 171, protein: 6, sodium: 360, potassium: 220, phosphorus: 180 },
  },
  {
    name: 'Rice',
    quantity: '2.0 katori',
    nutrients: { calories: 241, protein: 5, sodium: 10, potassium: 60, phosphorus: 80 },
  },
  {
    name: 'Boiled Egg',
    quantity: '2.0 large',
    nutrients: { calories: 155, protein: 13, sodium: 124, potassium: 126, phosphorus: 172 },
  },
  {
    name: 'Curd',
    quantity: '1.0 katori',
    nutrients: { calories: 90, protein: 5, sodium: 50, potassium: 200, phosphorus: 150 },
  },
  {
    name: 'Dal',
    quantity: '3.0 katori',
    nutrients: { calories: 346, protein: 18, sodium: 600, potassium: 800, phosphorus: 400 },
  },
  {
    name: 'Milk',
    quantity: '1.0 glass',
    nutrients: { calories: 168, protein: 8, sodium: 100, potassium: 350, phosphorus: 250 },
  },
  {
    name: 'Cucumber',
    quantity: '1.0 large (8-1/4" long)',
    nutrients: { calories: 42, protein: 2, sodium: 6, potassium: 440, phosphorus: 70 },
  },
  {
    name: 'Paneer',
    quantity: '40.0 grams',
    nutrients: { calories: 106, protein: 7, sodium: 8, potassium: 50, phosphorus: 130 },
  },
  {
    name: 'Dosa',
    quantity: '1.0 medium',
    nutrients: { calories: 147, protein: 4, sodium: 300, potassium: 100, phosphorus: 80 },
  },
  {
    name: 'Chicken Curry',
    quantity: '0.5 katori',
    nutrients: { calories: 80, protein: 7.5, sodium: 200, potassium: 150, phosphorus: 90 },
  },
  {
    name: 'Sambar',
    quantity: '1.5 katori',
    nutrients: { calories: 170, protein: 8, sodium: 500, potassium: 350, phosphorus: 150 },
  },
];
