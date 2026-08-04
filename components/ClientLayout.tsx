'use client';

import React from "react";
import Navbar from "@/components/portfolio/Navbar";
import SiteHeader from "@/components/portfolio/SiteHeader";
import SmoothScrolling from "@/components/SmoothScrolling";
import SmoothCursor from "@/components/SmoothCursor";

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SmoothScrolling>
            <SmoothCursor />
            <SiteHeader />
            <Navbar />
            {children}
        </SmoothScrolling>
    );
}
