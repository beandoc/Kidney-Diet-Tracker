
'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Camera, Loader2, Plus, Utensils, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { identifyFoodFromPhoto } from '@/ai/flows/identify-food-from-photo';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getFoodNutrients } from '@/app/actions';
import useLocalStorage from '@/hooks/use-local-storage';
import { getTodayDateString } from '@/lib/utils';
import type { FoodItem, Meal } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type IdentifiedFoodItem = {
    foodName: string;
    quantity: string;
}

export default function FoodLensPage() {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [identifiedItems, setIdentifiedItems] = useState<IdentifiedFoodItem[]>([]);
  const [mealName, setMealName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const [meals, setMeals] = useLocalStorage<Meal[]>(`meals-${getTodayDateString()}`, []);

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error('Camera API not available in this browser.');
        setHasCameraPermission(false);
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
      }
    };
    getCameraPermission();
    
    return () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    }
  }, []);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUri = canvas.toDataURL('image/jpeg');
        setCapturedImage(dataUri);
        handleImageAnalysis(dataUri);
      }
    }
  };

  const handleImageAnalysis = async (imageUri: string) => {
    setIsProcessing(true);
    setIdentifiedItems([]);
    try {
      const result = await identifyFoodFromPhoto({ photoDataUri: imageUri });
      if (result.foodItems.length === 0) {
        toast({
            variant: 'default',
            title: 'No food detected',
            description: "We couldn't find any food items in the photo. Try again with a clearer picture.",
        });
      } else {
        setIdentifiedItems(result.foodItems);
      }
    } catch (error) {
      console.error('Error identifying food:', error);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: 'We had trouble analyzing the photo. Please try again.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLogMeal = async () => {
    if (!mealName.trim()) {
      toast({ variant: 'destructive', title: 'Meal name required' });
      return;
    }
    if (identifiedItems.length === 0) {
        toast({ variant: 'destructive', title: 'No items to log' });
        return;
    }
    
    setIsProcessing(true);
    try {
        const foodItems: FoodItem[] = await Promise.all(
            identifiedItems.map(async (item) => {
                const nutrients = await getFoodNutrients(item.foodName, item.quantity);
                return {
                    id: crypto.randomUUID(),
                    name: item.foodName,
                    quantity: item.quantity,
                    nutrients,
                };
            })
        );
        
        const newMeal: Meal = {
            id: crypto.randomUUID(),
            name: mealName,
            items: foodItems,
        };

        setMeals([...meals, newMeal]);
        toast({
            title: 'Meal Logged!',
            description: `${mealName} has been added to your daily meals.`,
        });
        resetState();

    } catch(error) {
        toast({ variant: 'destructive', title: 'Failed to log meal', description: 'Could not fetch nutrient data for all items.' });
    } finally {
        setIsProcessing(false);
        setIsDialogOpen(false);
    }
  };
  
  const resetState = () => {
    setCapturedImage(null);
    setIdentifiedItems([]);
    setIsProcessing(false);
    setMealName('');
  }
  
  const removeItem = (index: number) => {
    setIdentifiedItems(items => items.filter((_, i) => i !== index));
  }


  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 flex items-center justify-start p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Link href="/" passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <h1 className="text-xl font-bold font-headline ml-4">Food Lens</h1>
      </header>

      <main className="flex-grow p-4 md:p-6 flex flex-col items-center">
        <canvas ref={canvasRef} className="hidden" />

        {!capturedImage ? (
            <Card className="w-full max-w-2xl overflow-hidden">
                <CardContent className="p-2">
                    <div className="relative aspect-video">
                        <video ref={videoRef} className="w-full h-full rounded-md" autoPlay muted playsInline />
                        {hasCameraPermission === false && (
                            <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                               <Alert variant="destructive" className="max-w-sm">
                                  <AlertTitle>Camera Access Required</AlertTitle>
                                  <AlertDescription>
                                    Please enable camera permissions in your browser settings to use this feature.
                                  </AlertDescription>
                              </Alert>
                            </div>
                        )}
                         {hasCameraPermission === null && (
                            <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                                <Loader2 className="h-8 w-8 animate-spin text-white" />
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        ) : (
            <div className="w-full max-w-2xl">
                 <Card className="overflow-hidden">
                    <CardContent className="p-2">
                        <img src={capturedImage} alt="Captured meal" className="rounded-md w-full h-auto"/>
                    </CardContent>
                </Card>
                
                <div className="mt-6">
                    {isProcessing && (
                         <div className="flex items-center justify-center text-lg gap-2">
                            <Loader2 className="h-6 w-6 animate-spin" />
                            <span>Analyzing your meal...</span>
                        </div>
                    )}
                    
                    {identifiedItems.length > 0 && (
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold font-headline">Identified Items</h2>
                             <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Food</TableHead>
                                        <TableHead>Quantity</TableHead>
                                        <TableHead className="w-[50px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {identifiedItems.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium">{item.foodName}</TableCell>
                                            <TableCell>{item.quantity}</TableCell>
                                            <TableCell>
                                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeItem(index)}>
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>
            </div>
        )}

      </main>

      <footer className="sticky bottom-0 bg-background border-t p-4">
        <div className="max-w-2xl mx-auto flex gap-4">
            {!capturedImage ? (
                <Button size="lg" className="w-full" onClick={capturePhoto} disabled={!hasCameraPermission}>
                    <Camera className="mr-2" />
                    Snap Meal
                </Button>
            ) : (
                <>
                <Button size="lg" variant="outline" className="w-full" onClick={resetState}>Retake</Button>
                <Button size="lg" className="w-full" onClick={() => setIsDialogOpen(true)} disabled={identifiedItems.length === 0 || isProcessing}>
                    {isProcessing ? <Loader2 className="animate-spin" /> : <Plus />}
                    Log as Meal
                </Button>
                </>
            )}
        </div>
      </footer>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Log Meal</DialogTitle>
                <DialogDescription>Give this meal a name to log the identified items.</DialogDescription>
            </DialogHeader>
            <div className="py-4">
                <Input 
                    placeholder="e.g., My delicious lunch"
                    value={mealName}
                    onChange={(e) => setMealName(e.target.value)}
                />
            </div>
            <DialogFooter>
                <Button onClick={handleLogMeal} disabled={isProcessing}>
                    {isProcessing ? <Loader2 className="animate-spin" /> : <Utensils className="mr-2 h-4 w-4" />}
                    Save Meal
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
