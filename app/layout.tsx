import type { Metadata, Viewport } from "next";
import { Inter, Outfit, Space_Grotesk } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";
import JsonLd from "@/components/JsonLd";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const outfit = Outfit({ subsets: ["latin"], variable: '--font-outfit' });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: '--font-space' });

export const viewport: Viewport = {
  themeColor: "#000000",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://ayaan-alam.vercel.app'),
  title: {
    default: "Ayaan Alam | Software Engineer & Full Stack Developer",
    template: "%s | Ayaan Alam",
  },
  description: "Portfolio of Ayaan Alam, a Software Engineer and Full Stack Developer specializing in building exceptional digital experiences.",
  keywords: [
    "Ayaan Alam",
    "Software Engineer",
    "Full Stack Developer",
    "Web Developer",
    "React",
    "Next.js",
    "Portfolio",
    "Frontend Developer",
    "Backend Developer",
  ],
  authors: [{ name: "Ayaan Alam" }],
  creator: "Ayaan Alam",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://ayaan-alam.vercel.app',
    title: "Ayaan Alam | Software Engineer & Full Stack Developer",
    description: "Portfolio of Ayaan Alam, a Software Engineer and Full Stack Developer.",
    siteName: "Ayaan Alam Portfolio",
    images: [
      {
        url: "/og-image.jpg", // We might want to create a generate_image task for this later if it doesn't exist
        width: 1200,
        height: 630,
        alt: "Ayaan Alam Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ayaan Alam | Software Engineer",
    description: "Portfolio of Ayaan Alam, a Software Engineer and Full Stack Developer.",
    creator: "@ayaanalam", // Placeholder
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'nnt3gm5xKtC9rzKniZQbetMh9TU3aNpjrqK038yCLAA',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} ${spaceGrotesk.variable}`}>
      <head>
        <JsonLd />
      </head>
      <body className="bg-black text-white selection:bg-indigo-500/30 selection:text-white antialiased">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
