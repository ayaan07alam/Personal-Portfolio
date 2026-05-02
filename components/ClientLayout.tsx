'use client';

import React from "react";
import Navbar from "@/components/portfolio/Navbar";
import SmoothScrolling from "@/components/SmoothScrolling";
import SmoothCursor from "@/components/SmoothCursor";

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SmoothScrolling>
            <div className="fixed inset-0 z-[9999] opacity-[0.03] mix-blend-overlay bg-noise" />
            <SmoothCursor />
            <Navbar />
            {children}
        </SmoothScrolling>
    );
}
