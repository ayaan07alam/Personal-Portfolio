'use client';

import React from "react";
import Navbar from "@/components/portfolio/Navbar";
import SiteHeader from "@/components/portfolio/SiteHeader";
import SmoothScrolling from "@/components/SmoothScrolling";
import SmoothCursor from "@/components/SmoothCursor";
import { ThemeProvider } from "@/components/ThemeProvider";

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ThemeProvider>
            <SmoothScrolling>
                <SmoothCursor />
                <SiteHeader />
                <Navbar />
                {children}
            </SmoothScrolling>
        </ThemeProvider>
    );
}
