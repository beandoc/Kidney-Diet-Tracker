'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/search-food-database.ts';
import '@/ai/flows/identify-food-from-photo.ts';
import '@/ai/flows/resolve-food-name.ts';
