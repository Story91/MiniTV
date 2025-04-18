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

export async function generateMetadata(): Promise<Metadata> {
  const URL = process.env.NEXT_PUBLIC_URL || "https://mini-tv.app";
  const splashImageUrl = process.env.NEXT_PUBLIC_SPLASH_IMAGE_URL || "https://mini-tv.app/miniicon.png";
  const appName = process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME || "MiniTV";
  const bgColor = process.env.NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR || "FFFFFF";
  const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL || "https://mini-tv.app/splash.png";
  const buttonTitle = process.env.NEXT_PUBLIC_BUTTON_TITLE || "MiniTV : AI Video Creator";
  
  return {
    title: appName,
    description: 'Transform images into amazing videos using AI',
    other: {
      "fc:frame": JSON.stringify({
        version: process.env.NEXT_PUBLIC_VERSION || "next",
        imageUrl: imageUrl,
        button: {
          title: buttonTitle,
          action: {
            type: "launch_frame",
            name: appName,
            url: URL,
            splashImageUrl: splashImageUrl,
            splashBackgroundColor: `#${bgColor}`,
          },
        },
      }),
    },
  };
}

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
