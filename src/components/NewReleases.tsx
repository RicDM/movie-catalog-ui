import { Calendar, Clock, Star } from "lucide-react";
import { useEffect, useState } from "react";
import {
  getImageUrl,
  getMovieDetails,
  getUpcomingMovies,
  getYearFromDate
} from "../services/tmdb";
import type { Movie, MovieDetails } from "../types/tmdb";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface MovieWithDetails extends Movie {
  details?: MovieDetails;
}

export function NewReleases() {
  const [movies, setMovies] = useState<MovieWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNewReleases() {
      try {
        setLoading(true);
        const upcoming = await getUpcomingMovies();

        // Pegar os primeiros 8 filmes e buscar detalhes
        const moviesWithDetails = await Promise.all(
          upcoming.slice(0, 8).map(async (movie) => {
            try {
              const details = await getMovieDetails(movie.id);
              return { ...movie, details };
            } catch {
              return movie;
            }
          })
        );

        setMovies(moviesWithDetails);
      } catch (error) {
        console.error("Erro ao carregar lançamentos:", error);
      } finally {
        setLoading(false);
      }
    }

    loadNewReleases();
  }, []);

  const formatRuntime = (minutes: number | null | undefined): string => {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

  const formatReleaseDate = (dateString: string): string => {
    if (!dateString) return "Em breve";
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString('pt-BR', { month: 'short' });
    return `${day} ${month}`;
  };

  if (loading) {
    return (
      <section className="py-16 lg:py-20 px-4 lg:px-8 relative">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8 lg:mb-12">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-6 h-6 text-primary" />
                <h2 className="text-2xl lg:text-4xl font-bold text-foreground">
                  Lançamentos
                </h2>
              </div>
              <p className="text-sm lg:text-base text-muted-foreground">
                Estreias recentes que você não pode perder
              </p>
            </div>
          </div>
          <div className="flex gap-4 lg:gap-6 overflow-x-auto pb-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-72 lg:w-80 h-40 bg-accent rounded-2xl animate-pulse flex-shrink-0" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 lg:py-20 px-4 lg:px-8 relative">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8 lg:mb-12">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-6 h-6 text-primary" />
              <h2 className="text-2xl lg:text-4xl font-bold text-foreground">
                Lançamentos
              </h2>
            </div>
            <p className="text-sm lg:text-base text-muted-foreground">
              Estreias recentes que você não pode perder
            </p>
          </div>
        </div>

        {/* Releases Scroll Container */}
        <div className="relative">
          <div className="flex gap-4 lg:gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="group relative flex-shrink-0 w-72 lg:w-80 snap-start cursor-pointer"
              >
                <div className="glass rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-primary/20 transition-all duration-500 hover:scale-[1.02]">
                  <div className="flex gap-4 p-4">
                    {/* Poster */}
                    <div className="relative w-24 h-36 flex-shrink-0 rounded-lg overflow-hidden">
                      <ImageWithFallback
                        src={getImageUrl(movie.poster_path, "w200")}
                        alt={movie.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {/* New Badge */}
                      <div className="absolute top-2 left-2 px-2 py-1 rounded-md bg-primary text-primary-foreground text-xs font-medium">
                        NOVO
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div className="space-y-2">
                        <h3 className="text-base font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors duration-300">
                          {movie.title}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {movie.details?.genres.map(g => g.name).join(", ") || "Carregando..."}
                        </p>
                      </div>

                      <div className="space-y-2">
                        {/* Rating */}
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          <span className="text-xs text-foreground">
                            {movie.vote_average.toFixed(1)}
                          </span>
                          <span className="text-xs text-muted-foreground ml-1">
                            {getYearFromDate(movie.release_date)}
                          </span>
                        </div>

                        {/* Duration & Release */}
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatRuntime(movie.details?.runtime)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{formatReleaseDate(movie.release_date)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Gradient Fade on Right */}
          <div className="absolute top-0 right-0 bottom-4 w-16 bg-gradient-to-l from-background to-transparent pointer-events-none" />
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
