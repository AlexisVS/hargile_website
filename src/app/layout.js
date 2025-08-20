import "./styles/global.scss";
import StyledComponentsRegistry from "@/components/StyledComponentsRegistry";

export default function RootLayout({children}) {
    return (
        <StyledComponentsRegistry>
            {children}
        </StyledComponentsRegistry>
    );
}
