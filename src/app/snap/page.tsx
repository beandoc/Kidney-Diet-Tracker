
import { Skeleton } from '@/components/ui/skeleton';
import dynamic from 'next/dynamic';

const FoodLensClient = dynamic(() => import('./food-lens-client'), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
       <header className="sticky top-0 z-10 flex items-center justify-start p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-6 w-32 ml-4" />
      </header>
      <main className="flex-grow p-4 md:p-6 flex flex-col items-center">
        <Skeleton className="w-full max-w-2xl aspect-video" />
      </main>
      <footer className="sticky bottom-0 bg-background border-t p-4">
        <div className="max-w-2xl mx-auto flex gap-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </footer>
    </div>
  ),
});

export default function FoodLensPage() {
  return <FoodLensClient />;
}
