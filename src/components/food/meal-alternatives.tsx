
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, RefreshCw, ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { getMealAlternatives } from '@/app/meal-alternatives';
import type { FoodItem, Meal, Nutrient } from '@/lib/types';
import Link from 'next/link';
import useLocalStorage from '@/hooks/use-local-storage';
import { DAILY_GOALS as DEFAULT_GOALS } from '@/lib/constants';

type MealAlternative = {
  original: FoodItem;
  alternative: Omit<FoodItem, 'id'>;
};

interface MealAlternativesProps {
    meals: Meal[];
    dailyTotals: Record<Nutrient, number>;
}

export function MealAlternatives({ meals, dailyTotals }: MealAlternativesProps) {
  const [alternatives, setAlternatives] = useState<MealAlternative[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [customGoals] = useLocalStorage<Partial<Record<Nutrient, number>>>('nutrient-goals', {});
  
  const goals = {
    ...DEFAULT_GOALS,
    ...customGoals,
  };


  useEffect(() => {
    const allItems = meals.flatMap(meal => meal.items);
    if (allItems.length > 0) {
      setIsLoading(true);
      getMealAlternatives(allItems, dailyTotals, goals)
        .then(setAlternatives)
        .finally(() => setIsLoading(false));
    } else {
        setAlternatives([]);
        setIsLoading(false);
    }
  }, [meals, dailyTotals, customGoals]);

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="font-headline">Meal Alternatives</CardTitle>
        <CardDescription>
          Consider these healthy swaps for items you've logged today.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
            <div className="space-y-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
            </div>
        ) : alternatives.length > 0 ? (
          <div className="space-y-3">
            {alternatives.map(({ original, alternative }) => (
              <Card key={original.id} className="p-3">
                 <p className="text-sm text-muted-foreground mb-2">Instead of <span className="font-semibold text-foreground">{original.name}</span>, try:</p>
                 <Link href={`/food/${encodeURIComponent(alternative.name)}`} className="block hover:bg-muted/50 rounded-md -mx-2 px-2 py-1.5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-bold">{alternative.name}</p>
                            <p className="text-xs text-muted-foreground">{Math.round(alternative.nutrients.calories)} Cal &middot; {Math.round(alternative.nutrients.protein)}g Protein</p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                </Link>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Lightbulb className="mx-auto h-8 w-8 mb-2" />
            <p>Log a meal to see alternative suggestions here!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
