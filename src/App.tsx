import { useState } from "react";
import styled from 'styled-components';
import { FeaturedMovies } from "./components/FeaturedMovies";
import { FeaturedTVShows } from "./components/FeaturedTVShows";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { NewReleases } from "./components/NewReleases";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import { CatalogPage } from "./pages/CatalogPage";
import { FavoritesPage } from "./pages/FavoritesPage";

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: ${props => props.theme.colors.background};
`;

const MainContent = styled.main`
  width: 100%;
`;

type Page = "home" | "catalog" | "favorites";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");

  return (
    <FavoritesProvider>
      <AppContainer>
        <Header onNavigate={setCurrentPage} currentPage={currentPage} />

        {currentPage === "home" && (
          <MainContent>
            <HeroSection />
            <FeaturedMovies />
            <FeaturedTVShows />
            <NewReleases />
          </MainContent>
        )}

        {currentPage === "catalog" && <CatalogPage />}
        {currentPage === "favorites" && <FavoritesPage />}
      </AppContainer>
    </FavoritesProvider>
  );
}
