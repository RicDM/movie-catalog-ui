import { Clock, Info, Play, Star } from "lucide-react";
import { useEffect, useState } from "react";
import {
  formatRuntime,
  getBackdropUrl,
  getMovieDetails,
  getTrendingMovies,
  getYearFromDate
} from "../services/tmdb";
import type { Movie, MovieDetails } from "../types/tmdb";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function HeroSection() {
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeaturedMovie() {
      try {
        setLoading(true);
        const movies = await getTrendingMovies("week");
        if (movies.length > 0) {
          const movie = movies[0];
          setFeaturedMovie(movie);

          // Buscar detalhes para runtime e gêneros
          const details = await getMovieDetails(movie.id);
          setMovieDetails(details);
        }
      } catch (error) {
        console.error("Erro ao carregar filme em destaque:", error);
      } finally {
        setLoading(false);
      }
    }

    loadFeaturedMovie();
  }, []);

  if (loading || !featuredMovie) {
    return (
      <section className="relative h-[90vh] lg:h-screen w-full overflow-hidden bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Carregando...</div>
      </section>
    );
  }

  const backdropUrl = getBackdropUrl(featuredMovie.backdrop_path);
  const year = getYearFromDate(featuredMovie.release_date);
  const genres = movieDetails?.genres.map(g => g.name).join(", ") || "Carregando...";
  const runtime = movieDetails ? formatRuntime(movieDetails.runtime) : "...";

  return (
    <section className="relative h-[90vh] lg:h-screen w-full overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src={backdropUrl}
          alt={featuredMovie.title}
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background/50" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 lg:px-8 h-full flex items-center">
        <div className="max-w-2xl space-y-6 pt-16 lg:pt-0">
          {/* Glass Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/30">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm text-foreground">Em Destaque</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">
              {featuredMovie.title}
            </span>
          </h1>

          {/* Description */}
          <p className="text-base lg:text-lg text-muted-foreground leading-relaxed max-w-xl">
            {featuredMovie.overview || "Descrição não disponível."}
          </p>

          {/* Movie Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full glass">
              <span>{year}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full glass">
              <span>{genres}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full glass">
              <Clock className="w-4 h-4" />
              <span>{runtime}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full glass border border-primary/30">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-foreground">{featuredMovie.vote_average.toFixed(1)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button className="flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-primary to-cyan-500 text-primary-foreground hover:shadow-xl hover:shadow-primary/50 transition-all duration-300 hover:scale-105">
              <Play className="w-5 h-5 fill-current" />
              <span>Assistir Trailer</span>
            </button>
            <button className="flex items-center gap-2 px-8 py-3 rounded-full glass border border-border hover:border-primary/50 text-foreground hover:bg-accent transition-all duration-300">
              <Info className="w-5 h-5" />
              <span>Ver Detalhes</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
