import type { FoodItem } from './types';

// Nutrient data for frequently tracked foods.
// In a real app, this would come from a proper database and the AI would provide all nutrients.
// For now, we are mocking the data based on the provided image, filling in missing values.

export const FREQUENTLY_TRACKED_FOODS: Omit<FoodItem, 'id'>[] = [
  {
    name: 'Tea',
    quantity: '1.0 teacup',
    nutrients: { calories: 73, protein: 0, sodium: 0, potassium: 0, phosphorus: 0 },
  },
  {
    name: 'Boiled Egg',
    quantity: '2.0 large',
    nutrients: { calories: 155, protein: 13, sodium: 124, potassium: 126, phosphorus: 172 },
  },
  {
    name: 'Banana',
    quantity: '1.0 small (4.5" long)',
    nutrients: { calories: 55, protein: 0.7, sodium: 1, potassium: 225, phosphorus: 14 },
  },
  {
    name: 'Roti',
    quantity: '1.0 roti/chapati',
    nutrients: { calories: 85, protein: 3, sodium: 180, potassium: 110, phosphorus: 90 },
  },
  {
    name: 'Almond',
    quantity: '5.0 almond',
    nutrients: { calories: 37, protein: 1.5, sodium: 0, potassium: 50, phosphorus: 34 },
  },
  {
    name: 'Milk',
    quantity: '1.0 glass',
    nutrients: { calories: 168, protein: 8, sodium: 100, potassium: 380, phosphorus: 250 },
  },
  {
    name: 'Idli',
    quantity: '2.0 idli (regular)',
    nutrients: { calories: 146, protein: 4, sodium: 300, potassium: 90, phosphorus: 70 },
  },
  {
    name: 'Apple',
    quantity: '1.0 small (2-3/4" dia)',
    nutrients: { calories: 88, protein: 0.5, sodium: 2, potassium: 195, phosphorus: 20 },
  },
  {
    name: 'Walnut',
    quantity: '2.0 piece (half of one)',
    nutrients: { calories: 28, protein: 0.6, sodium: 0, potassium: 19, phosphorus: 15 },
  },
  {
    name: 'Dosa',
    quantity: '1.5 medium',
    nutrients: { calories: 221, protein: 6, sodium: 450, potassium: 150, phosphorus: 120 },
  },
];
