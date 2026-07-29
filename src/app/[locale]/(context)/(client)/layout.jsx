"use client"

import React from "react";
import ClientLayoutContent from "@/components/layout/ClientLayoutContent";


export default function ClientLayout({children}) {
    return (
        <>
            <ClientLayoutContent>
                {children}
            </ClientLayoutContent>
        </>
    );
}
