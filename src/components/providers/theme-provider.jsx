"use client"

import {ThemeProvider as StyledThemeProvider} from "styled-components";
import themeTokens from "@/app/styles/theme-tokens";

export const ThemeProvider = ({children}) => {
    return (
        <StyledThemeProvider theme={themeTokens}>
            {children}
        </StyledThemeProvider>
    );
};
