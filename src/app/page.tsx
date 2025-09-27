
'use client';

import { useState, useMemo, memo } from 'react';
import type { Meal } from '@/lib/types';
import useLocalStorage from '@/hooks/use-local-storage';
import { Header } from '@/components/layout/header';
import { DailySummary } from '@/components/dashboard/daily-summary';
import { MealList } from '@/components/meals/meal-list';
import { AddMealDialog } from '@/components/meals/add-meal-dialog';
import { formatDate, getTodayDateString } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { addDays, subDays, format } from 'date-fns';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { MealAlternatives } from '@/components/food/meal-alternatives';

const MemoizedHeader = memo(Header);
const MemoizedDailySummary = memo(DailySummary);
const MemoizedMealList = memo(MealList);


export default function Home() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const dateString = useMemo(() => formatDate(currentDate), [currentDate]);

  const [meals, setMeals] = useLocalStorage<Meal[]>(`meals-${dateString}`, []);

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

  const handleDateChange = (direction: 'prev' | 'next' | 'today') => {
    if (direction === 'today') {
      setCurrentDate(new Date());
    } else {
      const newDate = direction === 'prev' ? subDays(currentDate, 1) : addDays(currentDate, 1);
      setCurrentDate(newDate);
    }
  };

  const isToday = useMemo(() => getTodayDateString() === dateString, [dateString]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <MemoizedHeader />
      <main className="flex-grow container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <MemoizedDailySummary totals={dailyTotals} />
            <div className="mt-8">
              <div>
                <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-4">
                  <div className='flex items-center gap-2 md:gap-4'>
                    <h2 className="text-xl md:text-2xl font-bold font-headline text-foreground">
                      Meals for {format(currentDate, 'MMM d, yyyy')}
                    </h2>
                     <div className="flex items-center gap-1 md:gap-2">
                        <Button variant="outline" size="icon" onClick={() => handleDateChange('prev')}>
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleDateChange('next')}>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                        {!isToday && <Button variant="outline" size="sm" onClick={() => handleDateChange('today')}>Today</Button>}
                    </div>
                  </div>
                  <AddMealDialog onAddMeal={addMeal} />
                </div>
                <MemoizedMealList meals={meals} onRemoveMeal={removeMeal} onUpdateMeal={updateMeal} />
              </div>
            </div>
          </div>
          <aside className="space-y-8 lg:col-span-1">
             <MealAlternatives meals={meals} />
          </aside>
        </div>
      </main>
    </div>
  );
}
