import { config } from 'dotenv';
config();

import '@/ai/flows/search-food-database.ts';
import '@/ai/flows/generate-food-suggestions.ts';
import '@/ai/flows/analyze-meal-friendliness.ts';