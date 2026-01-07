import { Metadata } from "next";
import { Providers } from "./providers";
import StyledComponentsRegistry from "./registry";

export const metadata: Metadata = {
    title: "Movie Catalog UI Design",
    description: "Catálogo de filmes e séries",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="pt-BR">
            <body>
                <StyledComponentsRegistry>
                    <Providers>{children}</Providers>
                </StyledComponentsRegistry>
            </body>
        </html>
    );
}
