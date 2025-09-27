import type { FoodItem } from '../types';

export const indianCuisine: Omit<FoodItem, 'id'>[] = [
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
];
