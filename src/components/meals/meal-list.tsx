import type { Meal } from '@/lib/types';
import { MealCard } from './meal-card';

interface MealListProps {
  meals: Meal[];
  onRemoveMeal: (mealId: string) => void;
  onUpdateMeal: (meal: Meal) => void;
}

export function MealList({ meals, onRemoveMeal, onUpdateMeal }: MealListProps) {
  if (meals.length === 0) {
    return (
      <div className="text-center py-16 border-2 border-dashed rounded-lg">
        <p className="text-muted-foreground">No meals logged for today.</p>
        <p className="text-sm text-muted-foreground/80">Click &quot;Add Meal&quot; to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {meals.map((meal) => (
        <MealCard key={meal.id} meal={meal} onRemoveMeal={onRemoveMeal} onUpdateMeal={onUpdateMeal}/>
      ))}
    </div>
  );
}
