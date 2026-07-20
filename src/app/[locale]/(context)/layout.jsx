"use client";

import React from "react";
import RootClientWrapper from "@/components/layout/RootClientWrapper";
import {ThemeProvider} from "@/components/providers/theme-provider";
import {ContactButton} from "@/components/ContactButton";
import Navbar from "@/components/navigation/navbar";
import LenisProvider from "@/components/providers/lenis-provider";
import ScrollToTop from "@/components/providers/scroll-to-top";
import HeroLoadingProvider from "@/components/providers/hero-loading-provider";
import '../../styles/global.scss'


export default function ContextLayout({children}) {
    return (
        <>
            <LenisProvider>
                <ScrollToTop/>
                <HeroLoadingProvider>
                    <ThemeProvider>
                        <RootClientWrapper>
                            <Navbar/>

                            <div className="page-content">
                                {children}
                            </div>
                            <ContactButton/>
                        </RootClientWrapper>
                    </ThemeProvider>
                </HeroLoadingProvider>
            </LenisProvider>
        </>
    );
}
