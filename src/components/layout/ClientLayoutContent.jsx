"use client";

import Footer from "@/components/footer/Footer";
import OptimizedSvgFilter from "@/components/navigation/opitmized-svg-filter";


export default function ClientLayoutContent({children}) {
    return (
        <div className="content-container">
            <OptimizedSvgFilter/>
            {children}
            <Footer/>
        </div>
    );
}
