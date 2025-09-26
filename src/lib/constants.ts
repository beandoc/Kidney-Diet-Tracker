import type { Nutrient } from './types';
import { Flame, Beef, ChefHat, Banana, Bone } from 'lucide-react';

export const DAILY_GOALS: Record<Nutrient, number> = {
  calories: 2000,
  protein: 60,
  sodium: 2300,
  potassium: 2000,
  phosphorus: 1000,
};

export const NUTRIENT_LABELS: Record<Nutrient, string> = {
  calories: 'Calories',
  protein: 'Protein',
  sodium: 'Sodium',
  potassium: 'Potassium',
  phosphorus: 'Phosphorus',
};

export const NUTRIENT_UNITS: Record<Nutrient, string> = {
  calories: 'kcal',
  protein: 'g',
  sodium: 'mg',
  potassium: 'mg',
  phosphorus: 'mg',
};

export const NUTRIENT_ICONS: Record<Nutrient, React.ElementType> = {
  calories: Flame,
  protein: Beef,
  sodium: ChefHat,
  potassium: Banana,
  phosphorus: Bone,
};
