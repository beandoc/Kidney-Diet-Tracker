
'use client';

import { useState, useEffect } from 'react';
import useLocalStorage from '@/hooks/use-local-storage';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import type { Nutrient } from '@/lib/types';
import { DAILY_GOALS, NUTRIENT_UNITS, NUTRIENT_LABELS } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';

type NutrientGoals = Partial<Record<Nutrient, number>>;

export default function NutrientGoalsPage() {
  const [goals, setGoals] = useLocalStorage<NutrientGoals>('nutrient-goals', {});
  const [tempGoals, setTempGoals] = useState<NutrientGoals>({});
  const { toast } = useToast();

  useEffect(() => {
    // Initialize tempGoals with stored goals or defaults
    const initialGoals: NutrientGoals = {};
    (Object.keys(DAILY_GOALS) as Nutrient[]).forEach(nutrient => {
      initialGoals[nutrient] = goals[nutrient] ?? DAILY_GOALS[nutrient];
    });
    setTempGoals(initialGoals);
  }, [goals]);

  const handleGoalChange = (nutrient: Nutrient, value: string) => {
    const numericValue = parseInt(value, 10);
    setTempGoals(prev => ({
      ...prev,
      [nutrient]: isNaN(numericValue) ? 0 : numericValue,
    }));
  };

  const saveGoals = () => {
    setGoals(tempGoals);
    toast({
      title: 'Goals Saved!',
      description: 'Your daily nutrient targets have been updated.',
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center">
            <Link href="/settings" passHref>
            <Button variant="ghost" size="icon">
                <ArrowLeft />
                <span className="sr-only">Back</span>
            </Button>
            </Link>
            <h1 className="text-xl font-bold font-headline ml-4">
            Nutrient Goals
            </h1>
        </div>
        <Button onClick={saveGoals}>
            <Save className="mr-2 h-4 w-4" />
            Save
        </Button>
      </header>

      <main className="flex-grow p-4 md:p-6">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Set Your Daily Targets</CardTitle>
              <CardDescription>
                Customize your daily nutrient goals based on your dietary needs or doctor's recommendations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {(Object.keys(DAILY_GOALS) as Nutrient[]).map(nutrient => (
                <div key={nutrient} className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor={nutrient} className="text-right">
                    {NUTRIENT_LABELS[nutrient]}
                  </Label>
                  <Input
                    id={nutrient}
                    type="number"
                    value={tempGoals[nutrient] || ''}
                    onChange={(e) => handleGoalChange(nutrient, e.target.value)}
                    className="col-span-2"
                  />
                  <span className="col-start-2 col-span-2 text-xs text-muted-foreground ml-1">
                    Unit: {NUTRIENT_UNITS[nutrient]}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

