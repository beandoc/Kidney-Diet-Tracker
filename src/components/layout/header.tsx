
import { Leaf, Camera, Settings, LineChart } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';

export function Header() {
  return (
    <header className="py-4 px-4 md:px-8 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
            <SidebarTrigger className="md:hidden"/>
            <Link href="/" className="flex items-center gap-2">
                <Leaf className="text-primary-foreground h-6 w-6" />
                <h1 className="text-lg md:text-xl font-bold font-headline text-primary-foreground">
                Kidney Diet Tracker
                </h1>
            </Link>
        </div>
        <div className="flex items-center gap-2">
             <Link href="/progress" passHref>
                <Button variant="outline" size="sm">
                    <LineChart className="h-4 w-4 md:mr-2" />
                    <span className="hidden md:inline">View Progress</span>
                </Button>
            </Link>
            <Link href="/snap" passHref>
                <Button variant="outline" size="sm">
                    <Camera className="h-4 w-4 md:mr-2" />
                     <span className="hidden md:inline">Food Lens</span>
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
