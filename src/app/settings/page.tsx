
'use client';

import {
  ArrowLeft,
  ChevronRight,
  Target,
  Share2,
  Soup,
  Flame,
  Camera,
  Heart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const settingsGroups = [
  {
    title: 'Calories & Nutrition Settings',
    items: [
      {
        icon: Target,
        title: 'Nutrient Goals',
        description: 'Set your daily calorie and nutrient targets',
        href: '/nutrient-goals',
      },
      {
        icon: Share2,
        title: 'Macronutrient Budget',
        description: 'Protein: 115g • Fats: 76g • Carbs: 287g • Fibre: 30g',
        href: '/macro-breakdown',
      },
    ],
  },
  {
    title: 'Meal Settings',
    items: [
      {
        icon: Soup,
        title: 'Add/Remove Meals & Time',
        description: 'Breakfast • Morning Snack • Lunch • Evening Snack • Dinner',
        href: '/edit-meals',
      },
      {
        icon: Flame,
        title: 'Edit Meal Calories',
        description: 'Edit calorie budget for each meal',
        href: '#',
      },
    ],
  },
  {
    title: 'Snap Settings',
    items: [
      {
        icon: Camera,
        title: 'Food Lens',
        description: 'Use your camera to identify and log meals',
        href: '/snap',
      },
    ],
  },
  {
    title: 'Food Preferences',
    items: [
      {
        icon: Heart,
        title: 'Favorite Foods',
        description: 'Add favourite foods to your diet plan',
        href: '#',
      },
    ],
  },
];

export default function SettingsPage() {
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
          Food Tracker Settings
        </h1>
      </header>

      <main className="flex-grow p-4 md:p-6">
        <div className="max-w-2xl mx-auto space-y-8">
          {settingsGroups.map((group) => (
            <div key={group.title}>
              <h2 className="text-lg font-semibold mb-4 px-2">{group.title}</h2>
              <div className="space-y-2">
                {group.items.map((item) => (
                  <Link href={item.href} key={item.title} passHref>
                    <div className="flex items-center p-4 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                      <div className="flex items-center gap-4 flex-grow">
                        <div className="p-3 bg-muted rounded-lg">
                          <item.icon className="h-6 w-6 text-foreground" />
                        </div>
                        <div className="flex-grow">
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-muted-foreground truncate">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
