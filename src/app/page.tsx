
'use client';

import { useState, useMemo, memo } from 'react';
import type { Meal } from '@/lib/types';
import useLocalStorage from '@/hooks/use-local-storage';
import { Header } from '@/components/layout/header';
import { DailySummary } from '@/components/dashboard/daily-summary';
import { MealList } from '@/components/meals/meal-list';
import { AddMealDialog } from '@/components/meals/add-meal-dialog';
import { getTodayDateString } from '@/lib/utils';

const MemoizedHeader = memo(Header);
const MemoizedDailySummary = memo(DailySummary);
const MemoizedMealList = memo(MealList);


export default function Home() {
  const [meals, setMeals] = useLocalStorage<Meal[]>(`meals-${getTodayDateString()}`, []);

  const addMeal = (meal: Meal) => {
    setMeals(prevMeals => {
        // Check if a meal with the same name already exists
        const existingMealIndex = prevMeals.findIndex(m => m.name === meal.name);
        if (existingMealIndex > -1) {
            // Merge items into the existing meal
            const updatedMeals = [...prevMeals];
            const existingMeal = updatedMeals[existingMealIndex];
            existingMeal.items = [...existingMeal.items, ...meal.items];
            return updatedMeals;
        } else {
            // Add as a new meal
            return [...prevMeals, meal];
        }
    });
  };

  const removeMeal = (mealId: string) => {
    setMeals(prevMeals => prevMeals.filter((meal) => meal.id !== mealId));
  };
  
  const updateMeal = (updatedMeal: Meal) => {
    setMeals(prevMeals => prevMeals.map(meal => meal.id === updatedMeal.id ? updatedMeal : meal));
  }

  const dailyTotals = useMemo(() => {
    return meals.reduce(
      (totals, meal) => {
        meal.items.forEach((item) => {
          totals.calories += item.nutrients.calories || 0;
          totals.protein += item.nutrients.protein || 0;
          totals.sodium += item.nutrients.sodium || 0;
          totals.potassium += item.nutrients.potassium || 0;
          totals.phosphorus += item.nutrients.phosphorus || 0;
        });
        return totals;
      },
      { calories: 0, protein: 0, sodium: 0, potassium: 0, phosphorus: 0 }
    );
  }, [meals]);


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <MemoizedHeader />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <MemoizedDailySummary totals={dailyTotals} />

        <div className="mt-8">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold font-headline text-foreground">
                Today&apos;s Meals
              </h2>
              <AddMealDialog onAddMeal={addMeal} />
            </div>
            <MemoizedMealList meals={meals} onRemoveMeal={removeMeal} onUpdateMeal={updateMeal} />
          </div>
        </div>
      </main>
    </div>
  );
}
