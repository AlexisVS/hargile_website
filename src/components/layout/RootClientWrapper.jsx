"use client"

import {SiteNavigationProvider} from "@/components/providers/site-navigation-provider";

export default function RootClientWrapper({children}) {
    return (
        <SiteNavigationProvider>
            {children}
        </SiteNavigationProvider>
    );
}
