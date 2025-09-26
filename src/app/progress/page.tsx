
'use client';

import { useState, useEffect, useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { subDays, format, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { formatDate } from '@/lib/utils';
import type { Meal } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

type DailyData = {
    date: string;
    calories: number;
    protein: number;
};

type WeeklyData = {
    week: string;
    calories: number;
    protein: number;
}

function getWeekDataForDate(date: Date): DailyData[] {
    const start = startOfWeek(date, { weekStartsOn: 1 });
    const end = endOfWeek(date, { weekStartsOn: 1 });
    const weekDays = eachDayOfInterval({ start, end });
    
    const weekData = weekDays.map(day => {
        const dateString = formatDate(day);
        let meals: Meal[] = [];
        try {
            if (typeof window !== 'undefined') {
                const storedMeals = localStorage.getItem(`meals-${dateString}`);
                if (storedMeals) {
                    meals = JSON.parse(storedMeals);
                }
            }
        } catch (error) {
            console.error("Could not parse meals from local storage for date: ", dateString, error);
        }

        const totals = meals.reduce(
            (acc, meal) => {
                meal.items.forEach(item => {
                    acc.calories += item.nutrients.calories || 0;
                    acc.protein += item.nutrients.protein || 0;
                });
                return acc;
            }, { calories: 0, protein: 0 }
        );

        return {
            date: format(day, 'EEE'),
            calories: Math.round(totals.calories),
            protein: Math.round(totals.protein)
        };
    });

    return weekData;
}


function getMonthData(): WeeklyData[] {
    const today = new Date();
    const monthData: WeeklyData[] = [];

    for (let i = 3; i >= 0; i--) {
        const weekStart = startOfWeek(subDays(today, i * 7), { weekStartsOn: 1 });
        const weekEnd = endOfWeek(subDays(today, i * 7), { weekStartsOn: 1 });
        const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
        
        let totalCalories = 0;
        let totalProtein = 0;
        let daysWithData = 0;

        weekDays.forEach(day => {
             const dateString = formatDate(day);
            let meals: Meal[] = [];
             try {
                if (typeof window !== 'undefined') {
                    const storedMeals = localStorage.getItem(`meals-${dateString}`);
                    if (storedMeals) {
                        meals = JSON.parse(storedMeals);
                        if (meals.length > 0 && meals.some(m => m.items.length > 0)) {
                           daysWithData++;
                           meals.forEach(meal => {
                                meal.items.forEach(item => {
                                    totalCalories += item.nutrients.calories || 0;
                                    totalProtein += item.nutrients.protein || 0;
                                })
                            })
                        }
                    }
                }
            } catch (error) {
                 console.error("Could not parse meals from local storage for date: ", dateString, error);
            }
        });

        monthData.push({
            week: `Week of ${format(weekStart, 'MMM d')}`,
            calories: daysWithData > 0 ? Math.round(totalCalories / daysWithData) : 0,
            protein: daysWithData > 0 ? Math.round(totalProtein / daysWithData) : 0,
        });
    }

    return monthData;
}

export default function ProgressPage() {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const weeklyData = useMemo(() => {
        if (!isClient) return Array(7).fill({}).map((_, i) => ({date: format(subDays(new Date(), 6-i), 'EEE'), calories: 0, protein: 0}));
        return getWeekDataForDate(new Date());
    }, [isClient]);

    const monthlyData = useMemo(() => {
        if (!isClient) return Array(4).fill({}).map((_,i) => ({week: `Week ${i+1}`, calories: 0, protein: 0}));
        return getMonthData();
    }, [isClient]);
    
    if (!isClient) {
        return (
             <div className="flex flex-col min-h-screen bg-background text-foreground">
              <header className="sticky top-0 z-10 flex items-center justify-start p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <Skeleton className="h-10 w-10" />
                <Skeleton className="h-6 w-32 ml-4" />
              </header>
              <main className="flex-grow p-4 md:p-6">
                <div className="max-w-4xl mx-auto space-y-8">
                  <Card>
                    <CardHeader>
                      <Skeleton className="h-6 w-48" />
                      <Skeleton className="h-4 w-64 mt-2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-[300px] w-full" />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <Skeleton className="h-6 w-48" />
                      <Skeleton className="h-4 w-64 mt-2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-[300px] w-full" />
                    </CardContent>
                  </Card>
                </div>
              </main>
            </div>
        );
    }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 flex items-center justify-start p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Link href="/" passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <h1 className="text-xl font-bold font-headline ml-4">
          Your Progress
        </h1>
      </header>

      <main className="flex-grow p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>This Week's Summary</CardTitle>
                    <CardDescription>Daily calorie and protein intake for the current week.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={weeklyData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--primary))" />
                            <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--chart-2))" />
                            <Tooltip />
                            <Legend />
                            <Bar yAxisId="left" dataKey="calories" fill="hsl(var(--primary))" name="Calories (kcal)" />
                            <Bar yAxisId="right" dataKey="protein" fill="hsl(var(--chart-2))" name="Protein (g)" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Last 4 Weeks Summary</CardTitle>
                    <CardDescription>Average daily calorie and protein intake per week.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="week" />
                            <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--primary))" />
                            <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--chart-2))" />
                            <Tooltip />
                            <Legend />
                            <Bar yAxisId="left" dataKey="calories" fill="hsl(var(--primary))" name="Avg Calories (kcal)" />
                            <Bar yAxisId="right" dataKey="protein" fill="hsl(var(--chart-2))" name="Avg Protein (g)" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}
