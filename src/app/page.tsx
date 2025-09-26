'use client';

import { useState, useEffect, useMemo } from 'react';
import type { Meal } from '@/lib/types';
import useLocalStorage from '@/hooks/use-local-storage';
import { Header } from '@/components/layout/header';
import { DailySummary } from '@/components/dashboard/daily-summary';
import { MealList } from '@/components/meals/meal-list';
import { AddMealDialog } from '@/components/meals/add-meal-dialog';
import { FoodSearch } from '@/components/food/food-search';
import { getTodayDateString } from '@/lib/utils';

export default function Home() {
  const [meals, setMeals] = useLocalStorage<Meal[]>(`meals-${getTodayDateString()}`, []);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const addMeal = (meal: Meal) => {
    setMeals([...meals, meal]);
  };

  const removeMeal = (mealId: string) => {
    setMeals(meals.filter((meal) => meal.id !== mealId));
  };
  
  const updateMeal = (updatedMeal: Meal) => {
    setMeals(meals.map(meal => meal.id === updatedMeal.id ? updatedMeal : meal));
  }

  const dailyTotals = useMemo(() => {
    return meals.reduce(
      (totals, meal) => {
        meal.items.forEach((item) => {
          totals.calories += item.nutrients.calories;
          totals.protein += item.nutrients.protein;
          totals.sodium += item.nutrients.sodium;
          totals.potassium += item.nutrients.potassium;
          totals.phosphorus += item.nutrients.phosphorus;
        });
        return totals;
      },
      { calories: 0, protein: 0, sodium: 0, potassium: 0, phosphorus: 0 }
    );
  }, [meals]);

  if (!isClient) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <DailySummary totals={dailyTotals} />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold font-headline text-foreground">
                Today&apos;s Meals
              </h2>
              <AddMealDialog onAddMeal={addMeal} />
            </div>
            <MealList meals={meals} onRemoveMeal={removeMeal} onUpdateMeal={updateMeal} />
          </div>
          <div className="lg:col-span-1">
             <FoodSearch />
          </div>
        </div>
      </main>
    </div>
  );
}
