import { TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useGenres } from "../hooks/useGenres";
import { getImageUrl, getPopularMovies, getYearFromDate } from "../services/tmdb";
import type { Movie } from "../types/tmdb";
import { MovieCard } from "./MovieCard";

export function FeaturedMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const { getGenreNames, loading: genresLoading } = useGenres();

  useEffect(() => {
    async function loadMovies() {
      try {
        setLoading(true);
        const popularMovies = await getPopularMovies();
        setMovies(popularMovies.slice(0, 12));
      } catch (error) {
        console.error("Erro ao carregar filmes populares:", error);
      } finally {
        setLoading(false);
      }
    }

    loadMovies();
  }, []);

  if (loading || genresLoading) {
    return (
      <section className="py-16 lg:py-24 px-4 lg:px-8 relative">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8 lg:mb-12">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-primary" />
                <h2 className="text-2xl lg:text-4xl font-bold text-foreground">
                  Em Alta Agora
                </h2>
              </div>
              <p className="text-sm lg:text-base text-muted-foreground">
                Os filmes mais populares do momento
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 lg:gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-accent rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 lg:py-24 px-4 lg:px-8 relative">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8 lg:mb-12">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary" />
              <h2 className="text-2xl lg:text-4xl font-bold text-foreground">
                Em Alta Agora
              </h2>
            </div>
            <p className="text-sm lg:text-base text-muted-foreground">
              Os filmes mais populares do momento
            </p>
          </div>
          <button className="hidden md:block px-6 py-2 rounded-full glass border border-border hover:border-primary/50 text-foreground hover:text-primary transition-all duration-300">
            Ver Todos
          </button>
        </div>

        {/* Movies Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 lg:gap-6">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              title={movie.title}
              genre={getGenreNames(movie.genre_ids, "movie")}
              rating={parseFloat(movie.vote_average.toFixed(1))}
              year={getYearFromDate(movie.release_date)}
              image={getImageUrl(movie.poster_path)}
            />
          ))}
        </div>

        {/* Mobile See All Button */}
        <div className="md:hidden mt-8 flex justify-center">
          <button className="w-full max-w-xs px-6 py-3 rounded-full glass border border-border hover:border-primary/50 text-foreground hover:text-primary transition-all duration-300">
            Ver Todos
          </button>
        </div>
      </div>
    </section>
  );
}
