

'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Info, Plus, Utensils } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';
import Link from 'next/link';
import { getFoodNutrients } from '@/app/actions';
import type { FoodItem, Meal, Nutrient } from '@/lib/types';
import type { MealSetting } from '@/app/edit-meals/page';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import useLocalStorage from '@/hooks/use-local-storage';
import { getTodayDateString } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';


function ProteinsIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
           <path d="M8.4 1.5A3.9 3.9 0 0 0 4.5 5.4a3.9 3.9 0 0 0 3.9 3.9h0a3.9 3.9 0 0 0 3.9-3.9A3.9 3.9 0 0 0 8.4 1.5Z" />
           <path d="M15.6 1.5a3.9 3.9 0 0 0-3.9 3.9 3.9 3.9 0 0 0 3.9 3.9h0a3.9 3.9 0 0 0 3.9-3.9A3.9 3.9 0 0 0 15.6 1.5Z" />
            <path d="M8.4 22.5a3.9 3.9 0 0 0-3.9-3.9 3.9 3.9 0 0 0-3.9 3.9h0a3.9 3.9 0 0 0 3.9 3.9 3.9 3.9 0 0 0 3.9-3.9Z" />
            <path d="m4.5 18.6 3.9-10.2" />
            <path d="M12.3 8.4 8.4 18.6" />
            <path d="M15.6 22.5a3.9 3.9 0 0 0 3.9-3.9 3.9 3.9 0 0 0-3.9-3.9h0a3.9 3.9 0 0 0-3.9 3.9 3.9 3.9 0 0 0 3.9 3.9Z" />
            <path d="m19.5 18.6-3.9-10.2" />
        </svg>
    )
}

function FatsIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2Z" />
            <path d="M16 4h2a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2Z" />
            <path d="M6 4H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2Z" />
        </svg>
    )
}

function CarbsIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M20.4 10.2c.1-.5.2-1 .2-1.5C20.6 4.4 16.7 1 12 1S3.4 4.4 3.4 8.7c0 .5.1 1 .2 1.5" />
            <path d="M4.3 12c.1.5.2 1 .2 1.5C4.5 17.6 7.9 21 12 21s7.5-3.4 7.5-7.5c0-.5-.1-1-.2-1.5" />
            <path d="M12 15a3 3 0 0 0 3-3c0-.5-.1-1-.2-1.5" />
            <path d="M12 9a3 3 0 0 1-3 3c0 .5.1 1 .2 1.5" />
            <path d="m12 12-4.5 4.5" />
            <path d="m12 12 4.5 4.5" />
            <path d="m12 12-4.5-4.5" />
            <path d="m12 12 4.5-4.5" />
        </svg>
    )
}

function FiberIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M4 6h16" />
            <path d="M4 12h16" />
            <path d="M4 18h16" />
        </svg>
    )
}

const defaultMealSettings: MealSetting[] = [
    { name: 'Breakfast', time: '09:30 AM', enabled: true },
    { name: 'Morning Snack', time: '11:00 AM', enabled: true },
    { name: 'Lunch', time: '01:30 PM', enabled: true },
    { name: 'Evening Snack', time: '05:00 PM', enabled: true },
    { name: 'Dinner', time: '08:00 PM', enabled: true },
  ];
  

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function FoodDetailPage({ params }: { params: { foodName: string } }) {
  const foodName = decodeURIComponent(params.foodName);
  const displayFoodName = capitalizeFirstLetter(foodName);

  const [quantity, setQuantity] = useState('1');
  const [measure, setMeasure] = useState('large');
  const [nutrients, setNutrients] = useState<Record<Nutrient, number> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState('');

  const [mealSettings] = useLocalStorage<MealSetting[]>('mealSettings', defaultMealSettings);
  const [otherMeals] = useLocalStorage<string[]>('otherMeals', []);
  const availableMeals = [...mealSettings.filter(m => m.enabled).map(m => m.name), ...otherMeals];


  const { toast } = useToast();
  const [meals, setMeals] = useLocalStorage<Meal[]>(`meals-${getTodayDateString()}`, []);
  

  useEffect(() => {
    const fetchNutrients = async () => {
      setIsLoading(true);
      try {
        const result = await getFoodNutrients(foodName, `${quantity} ${measure}`);
        setNutrients(result);
      } catch (error) {
        console.error("Failed to fetch nutrients", error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: `Could not fetch nutrient data for ${displayFoodName}.`,
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchNutrients();
  }, [foodName, quantity, measure, displayFoodName, toast]);

  const handleAddToMeal = () => {
    if (!selectedMeal) {
        toast({ variant: 'destructive', title: 'Please select a meal.'});
        return;
    }
    if (!nutrients) {
        toast({ variant: 'destructive', title: 'Nutrient data not available.'});
        return;
    }

    const foodItem: FoodItem = {
        id: crypto.randomUUID(),
        name: displayFoodName,
        quantity: `${quantity} ${measure}`,
        nutrients,
    };

    const existingMealIndex = meals.findIndex(m => m.name === selectedMeal);
    
    if (existingMealIndex > -1) {
        const updatedMeals = [...meals];
        updatedMeals[existingMealIndex].items.push(foodItem);
        setMeals(updatedMeals);
    } else {
        const newMeal: Meal = {
            id: crypto.randomUUID(),
            name: selectedMeal,
            items: [foodItem],
        };
        setMeals([...meals, newMeal]);
    }

    toast({ title: 'Item Added', description: `${displayFoodName} added to ${selectedMeal}.`});
    setIsDialogOpen(false);
    setSelectedMeal('');
  }

  const renderNutrientValue = (nutrient: Nutrient) => {
    if (isLoading || !nutrients) {
        return <Skeleton className="h-5 w-16" />;
    }
    return <span className="font-medium">{Math.round(nutrients[nutrient])} g</span>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-2">
            <Link href="/" passHref>
            <Button variant="ghost" size="icon">
                <ArrowLeft />
                <span className="sr-only">Back</span>
            </Button>
            </Link>
        </div>
        <div className="flex items-center gap-2">
        </div>
      </header>

      <main className="flex-grow p-4 md:p-6">
        <div className="max-w-md mx-auto">
          <Card className="overflow-hidden mb-4">
              <div className="relative">
                <Image
                    src={`https://picsum.photos/seed/${foodName}/600/400`}
                    alt={displayFoodName}
                    width={600}
                    height={400}
                    className="w-full h-auto"
                    data-ai-hint={foodName}
                />
                <div className="absolute bottom-4 left-4">
                    <h1 className="text-2xl font-bold text-white" style={{textShadow: '1px 1px 3px rgba(0,0,0,0.7)'}}>{displayFoodName}</h1>
                </div>
              </div>
          </Card>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Quantity</label>
              <div className="flex items-center mt-1">
                <Select value={quantity} onValueChange={setQuantity}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(10)].map((_, i) => (
                         <SelectItem key={i+1} value={String(i+1)}>{i+1}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
             <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center">Measure <Info className="h-3 w-3 ml-1 text-muted-foreground"/></label>
              <div className="flex items-center mt-1">
                <Select value={measure} onValueChange={setMeasure}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                    <SelectItem value="g">gram</SelectItem>
                    <SelectItem value="oz">ounce</SelectItem>
                    <SelectItem value="piece">piece</SelectItem>
                    <SelectItem value="slice">slice</SelectItem>
                    <SelectItem value="cup">cup</SelectItem>
                    <SelectItem value="teacup">teacup</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <h2 className="text-lg font-bold mb-4">Macronutrients Breakdown</h2>

          <Card className="mb-6">
            <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <p className="text-sm text-muted-foreground">Calories</p>
                        {isLoading || !nutrients ? <Skeleton className="h-8 w-24 mt-1" /> : <p className="text-3xl font-bold">{Math.round(nutrients.calories)} Cal</p> }
                    </div>
                     <div className="bg-muted px-3 py-1.5 rounded-md text-sm text-muted-foreground">
                        Net wt: 180.0 ml
                    </div>
                </div>
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <ProteinsIcon className="h-5 w-5 text-muted-foreground"/>
                            <span>Proteins</span>
                        </div>
                        {renderNutrientValue('protein')}
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <FatsIcon className="h-5 w-5 text-muted-foreground"/>
                            <span>Sodium</span>
                        </div>
                         {renderNutrientValue('sodium')}
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <CarbsIcon className="h-5 w-5 text-muted-foreground"/>
                            <span>Potassium</span>
                        </div>
                        {renderNutrientValue('potassium')}
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <FiberIcon className="h-5 w-5 text-muted-foreground"/>
                            <span>Phosphorus</span>
                        </div>
                        {renderNutrientValue('phosphorus')}
                    </div>
                </div>
            </CardContent>
          </Card>
          
          <h2 className="text-lg font-bold mb-4">Micronutrients Breakdown</h2>
            <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                    <p>Data not available</p>
                </CardContent>
            </Card>

        </div>
      </main>
      <footer className="sticky bottom-0 p-4 bg-background border-t">
        <div className="max-w-md mx-auto">
            <Button size="lg" className="w-full" onClick={() => setIsDialogOpen(true)} disabled={isLoading || !nutrients}>
                ADD
            </Button>
        </div>
      </footer>

       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Add to Meal</DialogTitle>
                <DialogDescription>Select which meal to add {displayFoodName} to.</DialogDescription>
            </DialogHeader>
            <div className="py-4">
                <Select onValueChange={setSelectedMeal} value={selectedMeal}>
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
                <Button onClick={handleAddToMeal}>
                    <Utensils className="mr-2 h-4 w-4" />
                    Add Item
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

    

    
