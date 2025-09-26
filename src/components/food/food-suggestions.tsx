
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Sparkles, Lightbulb } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { generateFoodSuggestions } from '@/ai/flows/generate-food-suggestions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NUTRIENT_LABELS } from '@/lib/constants';
import type { Nutrient } from '@/lib/types';

const formSchema = z.object({
  nutrient: z.enum(['sodium', 'potassium', 'phosphorus']),
  dietaryRestrictions: z.string().optional(),
});

export function FoodSuggestions() {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { nutrient: 'potassium', dietaryRestrictions: '' },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setSuggestions([]);
    try {
      const result = await generateFoodSuggestions({
        nutrient: values.nutrient,
        dietaryRestrictions: values.dietaryRestrictions || 'none',
        numberOfSuggestions: 5,
      });
      setSuggestions(result.suggestions);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to get suggestions. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="font-headline">Food Suggestions</CardTitle>
        <CardDescription>
          Get ideas for foods that are low in specific nutrients.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nutrient"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nutrient to Minimize</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a nutrient" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(Object.keys(NUTRIENT_LABELS) as Nutrient[])
                        .filter(n => n !== 'calories' && n !== 'protein')
                        .map(nutrient => (
                          <SelectItem key={nutrient} value={nutrient}>
                            {NUTRIENT_LABELS[nutrient]}
                          </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="dietaryRestrictions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Other Dietary Needs (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., vegetarian, gluten-free" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              <span className="ml-2">Get Suggestions</span>
            </Button>
          </form>
        </Form>

        {isLoading && (
          <div className="mt-4 flex items-center justify-center text-sm text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating ideas...
          </div>
        )}
        
        {suggestions.length > 0 && (
          <div className="mt-6 space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-400"/>
                Here are a few ideas:
            </h4>
            <ul className="list-disc list-inside space-y-2 rounded-md border p-4 bg-muted/50">
                {suggestions.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
