
'use client';

import { useState } from 'react';
import useLocalStorage from '@/hooks/use-local-storage';
import { ArrowLeft, Heart, Plus, Utensils, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LOCAL_FOOD_DATABASE } from '@/lib/food-database';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import type { FoodItem, Meal } from '@/lib/types';
import type { MealSetting } from '@/app/edit-meals/page';
import { getTodayDateString } from '@/lib/utils';
import { cn } from '@/lib/utils';

const defaultMealSettings: MealSetting[] = [
  { name: 'Breakfast', time: '09:30 AM', enabled: true },
  { name: 'Morning Snack', time: '11:00 AM', enabled: true },
  { name: 'Lunch', time: '01:30 PM', enabled: true },
  { name: 'Evening Snack', time: '05:00 PM', enabled: true },
  { name: 'Dinner', time: '08:00 PM', enabled: true },
];

export default function FavoriteFoodsPage() {
  const [favoriteFoods, setFavoriteFoods] = useLocalStorage<string[]>('favorite-foods', []);
  const { toast } = useToast();

  // State for logging a meal
  const [isLogDialogOpen, setIsLogDialogOpen] = useState(false);
  const [foodToLog, setFoodToLog] = useState<Omit<FoodItem, 'id'> | null>(null);
  const [selectedMealName, setSelectedMealName] = useState('');
  
  const [meals, setMeals] = useLocalStorage<Meal[]>(`meals-${getTodayDateString()}`, []);
  const [mealSettings] = useLocalStorage<MealSetting[]>('mealSettings', defaultMealSettings);
  const [otherMeals] = useLocalStorage<string[]>('otherMeals', []);
  const availableMeals = [...mealSettings.filter(m => m.enabled).map(m => m.name), ...otherMeals];


  const toggleFavorite = (foodName: string) => {
    setFavoriteFoods((prev) =>
      prev.includes(foodName)
        ? prev.filter((name) => name !== foodName)
        : [...prev, foodName]
    );
  };
  
  const openLogDialog = (food: Omit<FoodItem, 'id'>) => {
    setFoodToLog(food);
    setIsLogDialogOpen(true);
  }

  const handleLogMeal = () => {
    if (!foodToLog || !selectedMealName) {
        toast({ variant: 'destructive', title: 'Please select a meal.' });
        return;
    }

    const foodItem: FoodItem = {
        ...foodToLog,
        id: crypto.randomUUID(),
    };

    const existingMealIndex = meals.findIndex(m => m.name === selectedMealName);
    
    if (existingMealIndex > -1) {
        const updatedMeals = [...meals];
        updatedMeals[existingMealIndex].items.push(foodItem);
        setMeals(updatedMeals);
    } else {
        const newMeal: Meal = {
            id: crypto.randomUUID(),
            name: selectedMealName,
            items: [foodItem],
        };
        setMeals([...meals, newMeal]);
    }

    toast({ title: 'Item Added', description: `${foodItem.name} added to ${selectedMealName}.`});
    setIsLogDialogOpen(false);
    setFoodToLog(null);
    setSelectedMealName('');
  }

  return (
    <>
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 flex items-center justify-start p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Link href="/settings" passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <h1 className="text-xl font-bold font-headline ml-4">
          Favorite Foods
        </h1>
      </header>

      <main className="flex-grow p-4 md:p-6">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Manage Your Favorites</CardTitle>
              <CardDescription>
                Tap the heart to add or remove a food from your favorites.
                Favorites appear in the "Add Meal" dialog for quick logging.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[60vh]">
                <div className="space-y-3 pr-4">
                  {LOCAL_FOOD_DATABASE.map((food) => {
                    const isFavorite = favoriteFoods.includes(food.name);
                    return (
                      <div
                        key={food.name}
                        className="flex items-center justify-between p-3 rounded-lg border"
                      >
                        <div className="flex items-center gap-4">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleFavorite(food.name)}
                            className="h-9 w-9"
                          >
                            <Heart
                              className={cn('h-5 w-5 transition-colors', isFavorite ? 'text-red-500 fill-current' : 'text-muted-foreground')}
                            />
                            <span className="sr-only">Toggle Favorite</span>
                          </Button>
                          <div>
                            <p className="font-medium">{food.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {food.quantity} &middot; {food.nutrients.calories} Cal
                            </p>
                          </div>
                        </div>
                         <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openLogDialog(food)}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Log
                          </Button>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
    
     <Dialog open={isLogDialogOpen} onOpenChange={setIsLogDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Add to Today's Meal</DialogTitle>
                <DialogDescription>Select which meal to add "{foodToLog?.name}" to.</DialogDescription>
            </DialogHeader>
            <div className="py-4">
                <Select onValueChange={setSelectedMealName} value={selectedMealName}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a meal..." />
                    </SelectTrigger>
                    <SelectContent>
                        {availableMeals.map(mealName => (
                            <SelectItem key={mealName} value={mealName}>{mealName}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <DialogFooter>
                <Button onClick={handleLogMeal}>
                    <Utensils className="mr-2 h-4 w-4" />
                    Add Item
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
