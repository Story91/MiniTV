import '@coinbase/onchainkit/styles.css';
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from './providers';
import { Analytics } from "@vercel/analytics/react";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
};

// Konfiguracja dla Farcaster Frames
const frameMetadata = {
  version: "next",
  imageUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/splash.png`, 
  button: {
    title: "MiniTV : AI Video Creator",
    action: {
      type: "launch_frame",
      url: process.env.NEXT_PUBLIC_BASE_URL || "https://mini-tv.app",
      name: process.env.NEXT_PUBLIC_FARCASTER_APP_NAME || "MiniTV",
      splashImageUrl: process.env.NEXT_PUBLIC_FARCASTER_SPLASH_IMAGE || "https://mini-tv.app/miniicon.png",
      splashBackgroundColor: process.env.NEXT_PUBLIC_FARCASTER_SPLASH_BG_COLOR || "#FFFFFF"
    }
  }
};

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME || "MiniTV",
  description: 'Transform images into amazing videos using AI',
  other: {
    // Dodajemy meta tag dla Farcaster Frames
    'fc:frame': JSON.stringify(frameMetadata),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-background dark">
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
