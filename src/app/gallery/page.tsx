
'use client';

import { useState } from 'react';
import { ArrowLeft, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export default function SnapGalleryPage() {
  const [autoTrack, setAutoTrack] = useState(false);
  const [snaps, setSnaps] = useState([]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Link href="/" passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <h1 className="text-xl font-bold font-headline">Snap Gallery</h1>
        <div className="flex items-center space-x-2">
          <Label htmlFor="auto-track-switch" className="text-sm font-medium">Auto-Track</Label>
          <Switch
            id="auto-track-switch"
            checked={autoTrack}
            onCheckedChange={setAutoTrack}
          />
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-4 text-center">
        {snaps.length === 0 ? (
          <div>
            <h2 className="text-xl font-semibold">No Snaps Found</h2>
            <p className="text-muted-foreground mt-2">
              Start snapping your meals to log them. They&apos;ll appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Snaps will be rendered here */}
          </div>
        )}
      </main>

      <div className="fixed bottom-8 right-8">
        <Button size="icon" className="w-16 h-16 rounded-full shadow-lg">
          <Camera className="w-8 h-8" />
          <span className="sr-only">Take Photo</span>
        </Button>
      </div>
    </div>
  );
}
