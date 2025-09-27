
'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { Utensils } from 'lucide-react';
import Link from 'next/link';

const foodCategories = [
  'Beans & Legumes',
  'Beverages',
  'Breads & Cereals',
  'Cheese, Milk & Dairy',
  'Eggs',
  'Fast Food',
  'Fish & Seafood',
  'Fruit',
  'Meat',
  'Nuts & Seeds',
  'Pasta, Rice & Noodles',
  'Salads',
  'Sauces, Spices & Spreads',
  'Snacks',
  'Soups',
  'Sweets, Candy & Desserts',
  'Vegetables',
  'Other',
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Utensils className="w-5 h-5 text-primary-foreground" />
            <h2 className="text-lg font-semibold font-headline text-primary-foreground">
              Foods
            </h2>
          </div>
        </SidebarHeader>
        <SidebarMenu>
          <SidebarGroup>
            {foodCategories.map((category, index) => (
              <SidebarMenuItem key={index}>
                <Link href={`/food/${encodeURIComponent(category.toLowerCase())}`} passHref>
                  <SidebarMenuButton className="h-8">
                    <span>{category}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarGroup>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
