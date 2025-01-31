import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import DefaultLayout from "@/components/common/DefaultLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Carbonable dApp V3",
  description: "Nature-based Solutions DeFi. :amériques: Fund, Drive, and Monitor Provable Ecological Restoration. :coche_blanche:",
  authors: [{ name: "Carbonable", url: "https://carbonable.io" }],
  openGraph: {
    title: "Carbonable dApp V3",
    description: "Nature-based Solutions DeFi. :amériques: Fund, Drive, and Monitor Provable Ecological Restoration. :coche_blanche:",
    url: "https://app-v2.carbonable.io/launchpad",
    siteName: "Carbonable",
    images: [
      {
        url: "https://carbonable.github.io/socials/social.jpg",
        width: 1200,
        height: 630,
        alt: "Carbonable - Provable Nature Restoration",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@Carbonable_io",
    title: "Carbonable dApp V3",
    description: "Nature-based Solutions DeFi. :amériques: Fund, Drive, and Monitor Provable Ecological Restoration. :coche_blanche:",
    images: ["https://carbonable.github.io/socials/social.jpg"],
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100`}
      >
        <DefaultLayout>{children}</DefaultLayout>
      </body>
    </html>
  );
}
