
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { DAILY_GOALS as DEFAULT_GOALS, NUTRIENT_ICONS, NUTRIENT_LABELS, NUTRIENT_UNITS } from '@/lib/constants';
import type { Nutrient } from '@/lib/types';
import useLocalStorage from '@/hooks/use-local-storage';

interface DailySummaryProps {
  totals: Record<Nutrient, number>;
}

export function DailySummary({ totals }: DailySummaryProps) {
  const [calorieBudget] = useLocalStorage('calorieBudget', DEFAULT_GOALS.calories);
  // We only need to dynamically adjust the macronutrients based on calorie budget.
  // The daily goals for sodium, potassium, phosphorus remain constant as per the app's design.
  const dynamicGoals = {
      ...DEFAULT_GOALS,
      calories: calorieBudget,
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="font-headline">Daily Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-6">
          {(Object.keys(totals) as Nutrient[]).map((nutrient) => {
            const Icon = NUTRIENT_ICONS[nutrient];
            const value = Math.round(totals[nutrient]);
            const goal = dynamicGoals[nutrient];
            const progress = goal > 0 ? (value / goal) * 100 : 0;

            return (
              <div key={nutrient} className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Icon className="h-5 w-5 text-primary-foreground" />
                  <span>{NUTRIENT_LABELS[nutrient]}</span>
                </div>
                <div className="flex items-baseline gap-1 md:gap-2 flex-wrap">
                  <span className="text-xl md:text-2xl font-bold text-foreground">
                    {value.toLocaleString()}
                  </span>
                  <span className="text-xs md:text-sm text-muted-foreground">
                    / {goal.toLocaleString()} {NUTRIENT_UNITS[nutrient]}
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
