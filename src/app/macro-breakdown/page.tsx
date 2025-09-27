
'use client';

import { useState, useEffect, useMemo } from 'react';
import useLocalStorage from '@/hooks/use-local-storage';
import { ArrowLeft, Lock, Info, Wheat, Beef } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';
import type { Nutrient } from '@/lib/types';
import { DAILY_GOALS } from '@/lib/constants';

function BreadIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
        >
        <path d="M20 12H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2z" />
        <path d="M20 12c0-4.42-3.58-8-8-8S4 7.58 4 12" />
        </svg>
    );
}

function FatIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
        >
        <path d="M12 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2Z" />
        <path d="M16 4h2a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2Z" />
        <path d="M6 4H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2Z" />
        </svg>
    );
}

const dietPlans = {
    balanced: { protein: 20, carbs: 50, fat: 30 },
    'low-carb': { protein: 30, carbs: 20, fat: 50 },
    'high-protein': { protein: 40, carbs: 30, fat: 30 },
};

export default function MacroBreakdownPage() {
  const [customGoals] = useLocalStorage<Partial<Record<Nutrient, number>>>('nutrient-goals', {});
  const calorieBudget = customGoals.calories || DAILY_GOALS.calories;
  
  const [dietPlan, setDietPlan] = useLocalStorage<'balanced' | 'low-carb' | 'high-protein'>('dietPlan', 'balanced');

  const macronutrients = useMemo(() => {
    const plan = dietPlans[dietPlan];
    return {
        protein: Math.round((calorieBudget * (plan.protein / 100)) / 4),
        carbs: Math.round((calorieBudget * (plan.carbs / 100)) / 4),
        fat: Math.round((calorieBudget * (plan.fat / 100)) / 9),
    };
  }, [calorieBudget, dietPlan]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 flex items-center justify-start p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Link href="/settings" passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <h1 className="text-xl font-bold font-headline ml-4">
          Macronutrient Breakdown
        </h1>
      </header>

      <main className="flex-grow p-4 md:p-6">
        <div className="max-w-2xl mx-auto">
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <span className="text-lg">Calorie Budget</span>
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">{calorieBudget}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                <Info className="h-4 w-4" />
                <span>Your daily calorie budget is set in Nutrient Goals.</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Macronutrient Split</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={dietPlan} onValueChange={(value: 'balanced' | 'low-carb' | 'high-protein') => setDietPlan(value)}>
                <SelectTrigger className="w-full mb-6">
                  <SelectValue placeholder="Select a diet plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="balanced">Balanced Diet</SelectItem>
                  <SelectItem value="low-carb">Low Carb</SelectItem>
                  <SelectItem value="high-protein">High Protein</SelectItem>
                </SelectContent>
              </Select>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Beef className="h-6 w-6 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Protein</p>
                      <p className="text-sm text-muted-foreground">{macronutrients.protein} g</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 px-4 border rounded-md">
                    <span>{dietPlans[dietPlan].protein}%</span>
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <BreadIcon className="h-6 w-6 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Carb</p>
                      <p className="text-sm text-muted-foreground">{macronutrients.carbs} g</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 px-4 border rounded-md">
                    <span>{dietPlans[dietPlan].carbs}%</span>
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FatIcon className="h-6 w-6 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Fat</p>
                      <p className="text-sm text-muted-foreground">{macronutrients.fat} g</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 px-4 border rounded-md">
                    <span>{dietPlans[dietPlan].fat}%</span>
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-6 pt-4 border-t">
                <p className="font-semibold">Macronutrient Total</p>
                <p className="font-bold">100%</p>
              </div>

              <div className="flex items-center justify-between mt-8">
                  <div className="flex items-center gap-3">
                    <Wheat className="h-6 w-6 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Fibre</p>
                      <p className="text-sm text-muted-foreground">30 g (Fixed based on profile)</p>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">Not Editable</span>
                </div>

            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
