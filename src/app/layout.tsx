import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from "@/components/ui/toaster"
import { PT_Sans } from 'next/font/google';

export const metadata: Metadata = {
  title: 'Kidney Diet Tracker',
  description: 'A specialized food tracking app for kidney patients.',
};

const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-pt-sans',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('font-body antialiased min-h-screen', ptSans.variable)}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
