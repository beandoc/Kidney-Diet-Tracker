
'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, ExternalLink, AlertTriangle, Info, Plus, Utensils } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';
import Link from 'next/link';
import { getFoodNutrients } from '@/app/actions';
import type { FoodItem, Meal, Nutrient } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import useLocalStorage from '@/hooks/use-local-storage';
import { getTodayDateString } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';


function RecipeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <path d="M12 18h.01"></path>
      <path d="M16 18h.01"></path>
      <path d="M8 18h.01"></path>
    </svg>
  );
}

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
            <path d="M12.22 2h-4.44l-2 10-2-10H2l2 10-2 10h4.44l2-10 2 10h1.78l2-10-2-10Z" />
            <path d="M22 22h-4.44l-2-10-2 10H12l2-10-2-10h4.44l2 10 2-10h1.78l-2 10 2 10Z" />
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
            <path d="M20 12H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2z" />
            <path d="M20 12c0-4.42-3.58-8-8-8S4 7.58 4 12" />
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

const mealSettings = [
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
            <Button variant="ghost" size="icon">
                <ExternalLink className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
                <AlertTriangle className="h-5 w-5" />
            </Button>
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
                <div className="absolute top-2 right-2">
                    <Button variant="secondary" size="sm" className="rounded-full bg-black/50 text-white backdrop-blur-sm">
                        <RecipeIcon className="h-4 w-4 mr-2" />
                        Recipe
                    </Button>
                </div>
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
                            <span>Fats</span>
                        </div>
                         {isLoading || !nutrients ? <Skeleton className="h-5 w-16" /> : <span className="font-medium">{Math.round(nutrients.phosphorus)} g</span>}
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <CarbsIcon className="h-5 w-5 text-muted-foreground"/>
                            <span>Carbs</span>
                        </div>
                        {isLoading || !nutrients ? <Skeleton className="h-5 w-16" /> : <span className="font-medium">{Math.round(nutrients.potassium)} g</span>}
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <FiberIcon className="h-5 w-5 text-muted-foreground"/>
                            <span>Fiber</span>
                        </div>
                        <span className="font-medium">N/A</span>
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
                <Plus className="mr-2" /> Add to Meal
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
                        {mealSettings.filter(m => m.enabled).map(meal => (
                            <SelectItem key={meal.name} value={meal.name}>{meal.name}</SelectItem>
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

    