
'use client';

import { ArrowLeft, ExternalLink, AlertTriangle, ChevronDown, Info, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';
import Link from 'next/link';
import { DishedOut } from '@/components/icons/dished-out';

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

export default function FoodDetailPage({ params }: { params: { foodName: string } }) {
  const foodName = decodeURIComponent(params.foodName);

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
                    src="https://picsum.photos/seed/egg/600/400"
                    alt="Boiled Egg"
                    width={600}
                    height={400}
                    className="w-full h-auto"
                    data-ai-hint="boiled egg"
                />
                <div className="absolute top-2 right-2">
                    <Button variant="secondary" size="sm" className="rounded-full bg-black/50 text-white backdrop-blur-sm">
                        <RecipeIcon className="h-4 w-4 mr-2" />
                        Recipe
                    </Button>
                </div>
                <div className="absolute bottom-4 left-4">
                    <h1 className="text-2xl font-bold text-white" style={{textShadow: '1px 1px 3px rgba(0,0,0,0.7)'}}>Boiled Egg</h1>
                </div>
              </div>
          </Card>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Quantity</label>
              <div className="flex items-center mt-1">
                <Select defaultValue="2">
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
             <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center">Measure <Info className="h-3 w-3 ml-1 text-muted-foreground"/></label>
              <div className="flex items-center mt-1">
                <Select defaultValue="large">
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
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
                        <p className="text-3xl font-bold">155 Cal</p>
                    </div>
                    <div className="bg-muted px-3 py-1 rounded-md text-sm">
                        Net wt: 100.0 g
                    </div>
                </div>
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <ProteinsIcon className="h-5 w-5 text-muted-foreground"/>
                            <span>Proteins</span>
                        </div>
                        <span className="font-medium">12.6 g</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <FatsIcon className="h-5 w-5 text-muted-foreground"/>
                            <span>Fats</span>
                        </div>
                        <span className="font-medium">10.6 g</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <CarbsIcon className="h-5 w-5 text-muted-foreground"/>
                            <span>Carbs</span>
                        </div>
                        <span className="font-medium">1.1 g</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <FiberIcon className="h-5 w-5 text-muted-foreground"/>
                            <span>Fiber</span>
                        </div>
                        <span className="font-medium">0.0 g</span>
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
            <Button size="lg" className="w-full">Add to Breakfast</Button>
        </div>
      </footer>
    </div>
  );
}
