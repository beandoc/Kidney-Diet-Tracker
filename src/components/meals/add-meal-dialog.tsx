
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Search, Loader2, X, Utensils } from 'lucide-react';
import useLocalStorage from '@/hooks/use-local-storage';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { getFoodNutrients } from '@/app/actions';
import type { FoodItem, Meal } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { FREQUENTLY_TRACKED_FOODS } from '@/lib/food-database';
import { MealSetting } from '@/app/edit-meals/page';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';


interface AddMealDialogProps {
  onAddMeal: (meal: Meal) => void;
}

const foodSearchSchema = z.object({
  foodName: z.string().min(1, 'Food name is required.'),
  quantity: z.string().min(1, 'Quantity is required.'),
});

const defaultMealSettings: MealSetting[] = [
    { name: 'Breakfast', time: '09:30 AM', enabled: true },
    { name: 'Morning Snack', time: '11:00 AM', enabled: true },
    { name: 'Lunch', time: '01:30 PM', enabled: true },
    { name: 'Evening Snack', time: '05:00 PM', enabled: true },
    { name: 'Dinner', time: '08:00 PM', enabled: true },
];

export function AddMealDialog({ onAddMeal }: AddMealDialogProps) {
  const [open, setOpen] = useState(false);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedMealName, setSelectedMealName] = useState('');
  const { toast } = useToast();

  const [mealSettings] = useLocalStorage<MealSetting[]>('mealSettings', defaultMealSettings);
  const [otherMeals] = useLocalStorage<string[]>('otherMeals', []);
  const availableMeals = [...mealSettings.filter(m => m.enabled).map(m => m.name), ...otherMeals];

  const foodForm = useForm<z.infer<typeof foodSearchSchema>>({
    resolver: zodResolver(foodSearchSchema),
    defaultValues: { foodName: '', quantity: '' },
  });

  const handleAddFood = async (values: z.infer<typeof foodSearchSchema>) => {
    setIsSearching(true);
    try {
      const nutrients = await getFoodNutrients(values.foodName, values.quantity);
      if (Object.values(nutrients).every(v => v === 0)) {
         toast({
            variant: "destructive",
            title: "Could not find food",
            description: `We couldn't find nutrient data for "${values.foodName}". Please try a different name or be more specific.`,
          });
      } else {
        const newFoodItem: FoodItem = {
            id: crypto.randomUUID(),
            name: values.foodName,
            quantity: values.quantity,
            nutrients,
        };
        setFoodItems([...foodItems, newFoodItem]);
        foodForm.reset();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Search Failed",
        description: "An error occurred while searching for the food item.",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleRemoveFood = (id: string) => {
    setFoodItems(foodItems.filter((item) => item.id !== id));
  };

  const onSubmit = () => {
    if (!selectedMealName) {
      toast({
        variant: 'destructive',
        title: 'Meal name required',
        description: 'Please select a meal name.',
      });
      return;
    }
    if (foodItems.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No food items',
        description: 'Please add at least one food item to the meal.',
      });
      return;
    }
    const newMeal: Meal = {
      id: crypto.randomUUID(),
      name: selectedMealName,
      items: foodItems,
    };
    onAddMeal(newMeal);
    setOpen(false);
    setSelectedMealName('');
    setFoodItems([]);
  };

  const addFrequentFood = (food: Omit<FoodItem, 'id'>) => {
    const newFoodItem: FoodItem = {
      ...food,
      id: crypto.randomUUID(),
    };
    setFoodItems([...foodItems, newFoodItem]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="-ml-1 mr-2 h-5 w-5" />
          Add Meal
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px] grid-rows-[auto_minmax(0,1fr)_auto] p-0 max-h-[90vh]">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Add a New Meal</DialogTitle>
          <DialogDescription>Log a meal by adding food items and their quantities.</DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-full overflow-y-auto">
            <div className="space-y-4 px-6 py-4">
                <div className="space-y-2">
                    <FormLabel>Meal Name</FormLabel>
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
                
                <div className="space-y-4">
                    <h3 className="text-sm font-medium">Add Food Items</h3>
                    <Form {...foodForm}>
                        <form onSubmit={foodForm.handleSubmit(handleAddFood)} className="flex items-start gap-2">
                            <FormField control={foodForm.control} name="foodName" render={({ field }) => (
                                <FormItem className="flex-grow"><FormControl><Input placeholder="Search by Food Name/Dish" {...field} /></FormControl></FormItem>
                            )} />
                            <FormField control={foodForm.control} name="quantity" render={({ field }) => (
                                <FormItem className="w-32"><FormControl><Input placeholder="e.g., 1 medium" {...field} /></FormControl></FormItem>
                            )} />
                            <Button type="submit" disabled={isSearching}>
                                {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                                <span className="sr-only">Search</span>
                            </Button>
                        </form>
                    </Form>

                    {foodItems.length > 0 && (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Item</TableHead>
                                        <TableHead className="text-right">Cals</TableHead>
                                        <TableHead className="text-right">Prot.</TableHead>
                                        <TableHead className="w-[10px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                {foodItems.map(item => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">{item.name}</TableCell>
                                        <TableCell className="text-right">{Math.round(item.nutrients.calories)}</TableCell>
                                        <TableCell className="text-right">{Math.round(item.nutrients.protein)}g</TableCell>
                                        <TableCell>
                                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemoveFood(item.id)}>
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}

                    <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Frequently Tracked Foods</h4>
                    <div className="space-y-2">
                        {FREQUENTLY_TRACKED_FOODS.map((food) => (
                            <div key={food.name} className="flex items-center justify-between p-2 rounded-md border">
                            <div>
                                <p className="font-medium">{food.name}</p>
                                <p className="text-sm text-muted-foreground">{food.quantity}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-muted-foreground">{food.nutrients.calories} Cal</span>
                                <Button size="icon" variant="outline" className="h-8 w-8 rounded-full" onClick={() => addFrequentFood(food)}>
                                <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            </div>
                        ))}
                    </div>
                    </div>
                </div>
            </div>
        </ScrollArea>

        <DialogFooter className="p-6 pt-0">
          <Button type="button" onClick={onSubmit}>
            <Utensils className="mr-2 h-4 w-4" />
            Save Meal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
