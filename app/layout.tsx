'use client';

import { Inter, Outfit, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import Navbar from "@/components/portfolio/Navbar";
import BrandLogo from "@/components/portfolio/BrandLogo";
import SmoothScrolling from "@/components/SmoothScrolling";
import SmoothCursor from "@/components/SmoothCursor";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const outfit = Outfit({ subsets: ["latin"], variable: '--font-outfit' });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: '--font-space' });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} ${spaceGrotesk.variable}`}>
      <body className="bg-black text-white selection:bg-indigo-500/30 selection:text-white antialiased">
        <SmoothScrolling>
          <FilmGrain />
          <SmoothCursor />
          <Navbar />
          {children}
        </SmoothScrolling>
      </body>
    </html>
  );
}

function FilmGrain() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] mix-blend-overlay">
      <svg className="w-full h-full">
        <filter id="noiseFilter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.6"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>
    </div>
  );
}
