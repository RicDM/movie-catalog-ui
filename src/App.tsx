import { FeaturedMovies } from "./components/FeaturedMovies";
import { FeaturedTVShows } from "./components/FeaturedTVShows";
import { GenreCategories } from "./components/GenreCategories";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { NewReleases } from "./components/NewReleases";

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FeaturedMovies />
        <GenreCategories />
        <FeaturedTVShows />
        <NewReleases />
      </main>
    </div>
  );
}
