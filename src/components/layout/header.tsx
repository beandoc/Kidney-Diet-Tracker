import { Leaf, Camera, Settings, LineChart } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="py-4 px-4 md:px-8 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
                <Leaf className="text-primary-foreground h-6 w-6" />
                <h1 className="text-xl font-bold font-headline text-primary-foreground">
                Kidney Diet Tracker
                </h1>
            </Link>
        </div>
        <div className="flex items-center gap-2">
             <Link href="/progress" passHref>
                <Button variant="outline">
                    <LineChart className="mr-2 h-4 w-4" />
                    View Progress
                </Button>
            </Link>
            <Link href="/snap" passHref>
                <Button variant="outline">
                    <Camera className="mr-2 h-4 w-4" />
                    Food Lens
                </Button>
            </Link>
             <Link href="/settings" passHref>
                <Button variant="outline" size="icon">
                    <Settings className="h-4 w-4" />
                    <span className="sr-only">Settings</span>
                </Button>
            </Link>
        </div>
      </div>
    </header>
  );
}
