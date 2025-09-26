'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Search } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { analyzeMealForKidneyFriendliness } from '@/ai/flows/analyze-meal-friendliness';

const formSchema = z.object({
  query: z.string().min(3, 'Please enter at least 3 characters.'),
});

export function FoodSearch() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ concerns: string[], isKidneyFriendly: boolean, suggestions: string } | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { query: '' },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setResult(null);
    try {
      const analysis = await analyzeMealForKidneyFriendliness({ mealDescription: values.query });
      setResult(analysis);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to analyze meal. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="font-headline">Meal Friendliness Analyzer</CardTitle>
        <CardDescription>
          Enter a meal or food item to check if it&apos;s kidney-friendly.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
            <FormField
              control={form.control}
              name="query"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormLabel className="sr-only">Food or Meal</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., grilled chicken with broccoli" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              <span className="sr-only">Search</span>
            </Button>
          </form>
        </Form>

        {isLoading && (
          <div className="mt-4 flex items-center justify-center text-sm text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing...
          </div>
        )}
        
        {result && (
          <div className="mt-6 space-y-4 text-sm">
            <div className={`p-3 rounded-md ${result.isKidneyFriendly ? 'bg-green-100 dark:bg-green-900/50' : 'bg-red-100 dark:bg-red-900/50'}`}>
                <p className="font-bold">{result.isKidneyFriendly ? 'Generally Kidney-Friendly' : 'Potential Concerns'}</p>
            </div>

            {result.concerns && result.concerns.length > 0 && (
                <div>
                    <h4 className="font-semibold mb-2">Concerns:</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        {result.concerns.map((concern, i) => <li key={i}>{concern}</li>)}
                    </ul>
                </div>
            )}
            
            {result.suggestions && (
                <div>
                    <h4 className="font-semibold mb-2">Suggestions:</h4>
                    <p className="text-muted-foreground">{result.suggestions}</p>
                </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
