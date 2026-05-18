// Theme tokens — JS source of truth shared with styled-components.
// Mirrors src/app/styles/sass/_theme.scss. Update both when changing values.
const themeTokens = {
    primary: "#2563eb",
    primaryLight: "rgba(37, 99, 235, 0.1)",
    primaryHover: "#1d4fd8",
    textDark: "#171717",
    textLight: "#ededed",
    "text-secondaryLight": "rgba(237, 237, 237, 0.7)",
    "text-secondaryDark": "rgba(23, 23, 23, 0.7)",
    backgroundLight: "#ffffff",
    backgroundDark: "#000000",
    "background-cardDark": "rgba(255, 255, 255, 0.05)",
    "background-cardLight": "rgba(15, 23, 42, 0.7)",
    accentAgves: "#4F46E5",
    accentIGo: "#0EA5E9",
    accentMultipass: "#8B5CF6",
    accentMihai: "#a855f7",
    accentBluePlanet: "#96b9fa",
} as const;

export type ThemeTokens = typeof themeTokens;
export default themeTokens;
