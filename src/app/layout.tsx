import type { Metadata } from "next";
import { DM_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pratyaksha - See Your Mind. Clearly.",
  description:
    "AI-powered cognitive journal that visualizes emotional patterns, energy states, and mental insights. Built on CBT principles.",
  keywords: [
    "cognitive journal",
    "mental health",
    "AI insights",
    "emotional patterns",
    "CBT",
    "self-reflection",
  ],
  authors: [{ name: "Pratyaksha Team" }],
  creator: "Pratyaksha",
  openGraph: {
    title: "Pratyaksha - See Your Mind. Clearly.",
    description: "AI-powered cognitive journal that visualizes your mind.",
    url: "https://pratyaksha.app",
    siteName: "Pratyaksha",
    images: [
      {
        url: "https://pratyaksha.app/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Pratyaksha - Mind Visualization Dashboard",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pratyaksha - See Your Mind. Clearly.",
    description: "AI-powered cognitive journal that visualizes your mind.",
    images: ["https://pratyaksha.app/images/og-image.png"],
    creator: "@PratyakshaApp",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
