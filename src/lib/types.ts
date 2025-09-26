export type Nutrient = 'calories' | 'protein' | 'sodium' | 'potassium' | 'phosphorus';

export type FoodItem = {
  id: string;
  name: string;
  quantity: string;
  nutrients: Record<Nutrient, number>;
};

export type Meal = {
  id: string;
  name: string;
  items: FoodItem[];
};
