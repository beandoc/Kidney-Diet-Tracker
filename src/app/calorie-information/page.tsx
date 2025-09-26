
'use client';

import { ArrowLeft, Lock, Info, ChevronDown, Wheat, Beef } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';

function BreadIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
        >
        <path d="M20 12H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2z" />
        <path d="M20 12c0-4.42-3.58-8-8-8S4 7.58 4 12" />
        </svg>
    );
}

function FatIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
        >
        <path d="M12 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2Z" />
        <path d="M16 4h2a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2Z" />
        <path d="M6 4H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2Z" />
        </svg>
    );
}


export default function CalorieInformationPage() {
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
          Calorie Information
        </h1>
      </header>

      <main className="flex-grow p-4 md:p-6">
        <div className="max-w-2xl mx-auto">
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <span className="text-lg">Calorie Budget</span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">2,300</span>
                  <Lock className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                <Info className="h-4 w-4" />
                <span>This is your recommended daily budget</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Macronutrient Budget</CardTitle>
            </CardHeader>
            <CardContent>
              <Select defaultValue="balanced">
                <SelectTrigger className="w-full mb-6">
                  <SelectValue placeholder="Select a diet" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="balanced">Balanced Diet</SelectItem>
                  <SelectItem value="low-carb">Low Carb</SelectItem>
                  <SelectItem value="high-protein">High Protein</SelectItem>
                </SelectContent>
              </Select>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Beef className="h-6 w-6 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Protein</p>
                      <p className="text-sm text-muted-foreground">115 g</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 px-4 border rounded-md">
                    <span>20%</span>
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <BreadIcon className="h-6 w-6 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Carb</p>
                      <p className="text-sm text-muted-foreground">287 g</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 px-4 border rounded-md">
                    <span>50%</span>
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FatIcon className="h-6 w-6 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Fat</p>
                      <p className="text-sm text-muted-foreground">76 g</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 px-4 border rounded-md">
                    <span>30%</span>
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-6 pt-4 border-t">
                <p className="font-semibold">Macronutrient Total</p>
                <p className="font-bold">100%</p>
              </div>

              <div className="flex items-center justify-between mt-8">
                  <div className="flex items-center gap-3">
                    <Wheat className="h-6 w-6 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Fibre</p>
                      <p className="text-sm text-muted-foreground">30 g (Fixed based on profile)</p>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">Not Editable</span>
                </div>

            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
