import { useState } from "react";
import { FeaturedMovies } from "./components/FeaturedMovies";
import { FeaturedTVShows } from "./components/FeaturedTVShows";
import { GenreCategories } from "./components/GenreCategories";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { NewReleases } from "./components/NewReleases";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import { CatalogPage } from "./pages/CatalogPage";
import { FavoritesPage } from "./pages/FavoritesPage";

type Page = "home" | "catalog" | "favorites";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");

  return (
    <FavoritesProvider>
      <div className="min-h-screen bg-background">
        <Header onNavigate={setCurrentPage} currentPage={currentPage} />

        {currentPage === "home" && (
          <main>
            <HeroSection />
            <FeaturedMovies />
            <GenreCategories />
            <FeaturedTVShows />
            <NewReleases />
          </main>
        )}

        {currentPage === "catalog" && <CatalogPage />}
        {currentPage === "favorites" && <FavoritesPage />}
      </div>
    </FavoritesProvider>
  );
}
