import type { FoodItem } from './types';

// Nutrient data for frequently tracked foods.
// In a real app, this would come from a proper database and the AI would provide all nutrients.
// For now, we are mocking the data based on the provided image, filling in missing values.

export const FREQUENTLY_TRACKED_FOODS: Omit<FoodItem, 'id'>[] = [
  {
    name: 'Rice',
    quantity: '1.0 katori',
    nutrients: { calories: 120, protein: 2.5, sodium: 5, potassium: 30, phosphorus: 40 },
  },
  {
    name: 'Roti',
    quantity: '1.0 roti/chapati',
    nutrients: { calories: 85, protein: 3, sodium: 180, potassium: 110, phosphorus: 90 },
  },
  {
    name: 'Curd',
    quantity: '1.0 katori',
    nutrients: { calories: 90, protein: 5, sodium: 50, potassium: 200, phosphorus: 150 },
  },
  {
    name: 'Dal',
    quantity: '1.5 katori',
    nutrients: { calories: 173, protein: 9, sodium: 300, potassium: 400, phosphorus: 200 },
  },
  {
    name: 'Cucumber',
    quantity: '1.0 large (8-1/4" long)',
    nutrients: { calories: 42, protein: 2, sodium: 6, potassium: 440, phosphorus: 70 },
  },
  {
    name: 'Boiled Egg',
    quantity: '2.0 large',
    nutrients: { calories: 155, protein: 13, sodium: 124, potassium: 126, phosphorus: 172 },
  },
  {
    name: 'Sambar',
    quantity: '1.5 katori',
    nutrients: { calories: 170, protein: 8, sodium: 500, potassium: 350, phosphorus: 150 },
  },
  {
    name: 'Salad',
    quantity: '1.0 katori',
    nutrients: { calories: 36, protein: 1, sodium: 15, potassium: 200, phosphorus: 50 },
  },
  {
    name: 'Chicken Curry',
    quantity: '1.0 katori',
    nutrients: { calories: 160, protein: 15, sodium: 400, potassium: 300, phosphorus: 180 },
  },
  {
    name: 'Buttermilk',
    quantity: '1.0 glass',
    nutrients: { calories: 45, protein: 2, sodium: 250, potassium: 150, phosphorus: 100 },
  },
  {
    name: 'Dal Fry',
    quantity: '1.0 katori',
    nutrients: { calories: 128, protein: 7, sodium: 350, potassium: 300, phosphorus: 180 },
  }
];
