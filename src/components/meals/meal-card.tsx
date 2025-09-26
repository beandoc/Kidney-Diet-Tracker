import type { Meal, Nutrient } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2, X } from 'lucide-react';
import { NUTRIENT_LABELS, NUTRIENT_UNITS } from '@/lib/constants';

interface MealCardProps {
  meal: Meal;
  onRemoveMeal: (mealId: string) => void;
  onUpdateMeal: (meal: Meal) => void;
}

export function MealCard({ meal, onRemoveMeal, onUpdateMeal }: MealCardProps) {
  const mealTotals = meal.items.reduce(
    (totals, item) => {
      (Object.keys(item.nutrients) as Nutrient[]).forEach((nutrient) => {
        totals[nutrient] = (totals[nutrient] || 0) + item.nutrients[nutrient];
      });
      return totals;
    },
    {} as Record<Nutrient, number>
  );

  const handleRemoveItem = (itemId: string) => {
    const updatedMeal = {
      ...meal,
      items: meal.items.filter(item => item.id !== itemId),
    };
    onUpdateMeal(updatedMeal);
  };

  return (
    <Card className="shadow-md transition-all hover:shadow-lg">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="font-headline">{meal.name}</CardTitle>
          <CardDescription>{meal.items.length} item(s)</CardDescription>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onRemoveMeal(meal.id)}>
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Remove Meal</span>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Food Item</TableHead>
              <TableHead className="text-right">Calories</TableHead>
              <TableHead className="text-right">Protein</TableHead>
              <TableHead className="text-right">Sodium</TableHead>
              <TableHead className="text-right">Potassium</TableHead>
              <TableHead className="text-right">Phosphorus</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {meal.items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name} <span className="text-muted-foreground">({item.quantity})</span></TableCell>
                <TableCell className="text-right">{Math.round(item.nutrients.calories)}</TableCell>
                <TableCell className="text-right">{Math.round(item.nutrients.protein)}g</TableCell>
                <TableCell className="text-right">{Math.round(item.nutrients.sodium)}mg</TableCell>
                <TableCell className="text-right">{Math.round(item.nutrients.potassium)}mg</TableCell>
                <TableCell className="text-right">{Math.round(item.nutrients.phosphorus)}mg</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemoveItem(item.id)}>
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove item</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="bg-muted/50 p-4 flex flex-wrap gap-x-4 gap-y-2 text-sm justify-end">
        <strong className="mr-auto">Meal Totals:</strong>
        {(Object.keys(mealTotals) as Nutrient[]).map(nutrient => (
          <div key={nutrient}>
            <span className="font-semibold">{NUTRIENT_LABELS[nutrient]}: </span>
            <span>{Math.round(mealTotals[nutrient])}{NUTRIENT_UNITS[nutrient]}</span>
          </div>
        ))}
      </CardFooter>
    </Card>
  );
}
