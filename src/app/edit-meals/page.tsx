
'use client';

import { useState, useEffect } from 'react';
import useLocalStorage from '@/hooks/use-local-storage';
import { ArrowLeft, RefreshCw, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { DishedOut } from '@/components/icons/dished-out';
import Link from 'next/link';

export type MealSetting = {
  name: string;
  time: string;
  enabled: boolean;
};

const defaultMealSettings: MealSetting[] = [
  { name: 'Breakfast', time: '09:30 AM', enabled: true },
  { name: 'Morning Snack', time: '11:00 AM', enabled: true },
  { name: 'Lunch', time: '01:30 PM', enabled: true },
  { name: 'Evening Snack', time: '05:00 PM', enabled: true },
  { name: 'Dinner', time: '08:00 PM', enabled: true },
];

export default function EditMealsPage() {
  const [mealSettings, setMealSettings] = useLocalStorage<MealSetting[]>(
    'mealSettings',
    defaultMealSettings
  );
  
  const [otherMeals, setOtherMeals] = useLocalStorage<string[]>('otherMeals', []);
  const [newMealName, setNewMealName] = useState('');

  const handleSettingChange = (index: number, field: keyof MealSetting, value: string | boolean) => {
    const newSettings = [...mealSettings];
    (newSettings[index] as any)[field] = value;
    setMealSettings(newSettings);
  };
  
  const handleOtherMealChange = (index: number, value: string) => {
    const newOtherMeals = [...otherMeals];
    newOtherMeals[index] = value;
    setOtherMeals(newOtherMeals);
  };
  
  const addOtherMeal = () => {
    if (newMealName.trim() !== '') {
        setOtherMeals([...otherMeals, newMealName.trim()]);
        setNewMealName('');
    }
  }
  
  const removeOtherMeal = (index: number) => {
    setOtherMeals(otherMeals.filter((_, i) => i !== index));
  }

  const resetSettings = () => {
    setMealSettings(defaultMealSettings);
    setOtherMeals([]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Link href="/settings" passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <h1 className="text-xl font-bold font-headline">Edit Meals & Time</h1>
        <Button variant="ghost" onClick={resetSettings}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </header>

      <main className="flex-grow p-4 md:p-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <h2 className="text-lg font-semibold">Your daily meals/snacks</h2>
            <p className="text-sm text-muted-foreground">
              Add/remove a meal and edit time slot based on your needs.
            </p>
          </div>

          <div className="space-y-3 mb-8">
            {mealSettings.map((meal, index) => (
              <Card key={index}>
                <CardContent className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Checkbox
                      id={`meal-enabled-${index}`}
                      checked={meal.enabled}
                      onCheckedChange={(checked) => handleSettingChange(index, 'enabled', !!checked)}
                      className="h-5 w-5"
                    />
                    <label htmlFor={`meal-enabled-${index}`} className="font-medium">{meal.name}</label>
                  </div>
                  <Input
                    type="text"
                    value={meal.time}
                    onChange={(e) => handleSettingChange(index, 'time', e.target.value)}
                    className="w-28 text-center bg-muted/50"
                  />
                </CardContent>
              </Card>
            ))}
          </div>
          
          <h2 className="text-lg font-semibold mb-4">Other meals/snacks</h2>
          
           <div className="space-y-3">
             {otherMeals.map((meal, index) => (
                <Card key={index}>
                   <CardContent className="p-3 flex items-center gap-2">
                        <Input 
                            value={meal} 
                            onChange={(e) => handleOtherMealChange(index, e.target.value)}
                            placeholder="e.g. Pre-workout snack"
                            className="border-none focus-visible:ring-0 font-medium"
                        />
                        <Button variant="ghost" size="icon" onClick={() => removeOtherMeal(index)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                   </CardContent>
                </Card>
             ))}
              <Card>
                <CardContent className="p-3 flex items-center gap-2">
                    <Input 
                        value={newMealName} 
                        onChange={(e) => setNewMealName(e.target.value)}
                        placeholder="Add another meal..."
                        className="border-none focus-visible:ring-0"
                         onKeyDown={(e) => e.key === 'Enter' && addOtherMeal()}
                    />
                    <Button variant="ghost" size="icon" onClick={addOtherMeal}>
                        <Plus className="h-5 w-5 text-primary" />
                    </Button>
                </CardContent>
              </Card>
           </div>
           
          <div className="mt-12 flex justify-center">
            <DishedOut className="w-40 h-40 text-muted" />
          </div>
        </div>
      </main>
    </div>
  );
}
