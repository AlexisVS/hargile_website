"use client";

import React, {useEffect, useState} from "react";
import RootClientWrapper from "@/components/layout/RootClientWrapper";
import {ThemeProvider} from "@/components/providers/theme-provider";
import {OptimizedImage} from "@/components/optimizedImage";
import {ContactButton} from "@/components/ContactButton";
import Navbar from "@/components/navigation/navbar";
import LenisProvider from "@/components/providers/lenis-provider";
import ScrollToTop from "@/components/providers/scroll-to-top";
import '../../styles/global.scss'


export default function ContextLayout({children}) {
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setInitialLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <LenisProvider>
                <ScrollToTop/>
                <div className={`loading-container ${!initialLoading ? 'fade-out' : ''}`}>
                    <svg
                        className="loading-svg"
                        viewBox="0 0 100 100"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="transparent"
                            strokeWidth="1"
                        />
                        <path
                            className="loading-path"
                            d="M 50,50 m 0,-45 a 45,45 0 1,1 0,90 a 45,45 0 1,1 0,-90"
                            pathLength="100"
                            strokeDasharray="20 80"
                            strokeDashoffset="0"
                        />
                    </svg>
                    <OptimizedImage
                        style={{
                            width: '20vh',
                            height: 'auto',
                            mixBlendMode: "plus-lighter",
                            position: 'absolute',
                        }}
                        width={750}
                        height={348}
                        src="/images/brand/brand_large.png"
                        alt="Brand Logo"
                        priority={true}
                        fetchpriority={'high'}
                    />
                </div>

                <ThemeProvider>
                    <RootClientWrapper>
                        <Navbar/>

                        <div className={`page-content ${!initialLoading ? 'loaded' : ''}`}>
                            {children}
                        </div>
                        <ContactButton/>
                    </RootClientWrapper>
                </ThemeProvider>
            </LenisProvider>
        </>
    );
}
