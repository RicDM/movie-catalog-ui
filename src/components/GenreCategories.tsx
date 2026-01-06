import { Camera, Film, Ghost, Globe, Heart, Laugh, Sparkles, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { getMovieGenres } from "../services/tmdb";
import type { Genre } from "../types/tmdb";

// Mapeamento de ícones e cores para gêneros
const genreIcons: Record<string, { icon: typeof Film; color: string }> = {
  Ação: { icon: Zap, color: "from-orange-500 to-red-500" },
  Terror: { icon: Ghost, color: "from-purple-500 to-pink-500" },
  Romance: { icon: Heart, color: "from-pink-500 to-rose-500" },
  Comédia: { icon: Laugh, color: "from-yellow-500 to-orange-500" },
  "Ficção científica": { icon: Sparkles, color: "from-cyan-500 to-blue-500" },
  Aventura: { icon: Globe, color: "from-green-500 to-emerald-500" },
  Drama: { icon: Film, color: "from-indigo-500 to-purple-500" },
  Documentário: { icon: Camera, color: "from-teal-500 to-cyan-500" },
  Animação: { icon: Sparkles, color: "from-pink-400 to-purple-400" },
  Crime: { icon: Zap, color: "from-red-600 to-orange-600" },
  Família: { icon: Heart, color: "from-blue-400 to-cyan-400" },
  Fantasia: { icon: Sparkles, color: "from-purple-400 to-pink-400" },
  História: { icon: Film, color: "from-amber-600 to-yellow-600" },
  Música: { icon: Film, color: "from-pink-500 to-rose-400" },
  Mistério: { icon: Ghost, color: "from-indigo-600 to-purple-600" },
  Thriller: { icon: Zap, color: "from-red-500 to-pink-500" },
  Guerra: { icon: Zap, color: "from-gray-600 to-red-700" },
  Faroeste: { icon: Globe, color: "from-amber-700 to-orange-700" },
};

export function GenreCategories() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGenres() {
      try {
        setLoading(true);
        const movieGenres = await getMovieGenres();
        setGenres(movieGenres);
      } catch (error) {
        console.error("Erro ao carregar gêneros:", error);
      } finally {
        setLoading(false);
      }
    }

    loadGenres();
  }, []);

  if (loading) {
    return (
      <section className="py-16 lg:py-20 px-4 lg:px-8 relative">
        <div className="container mx-auto">
          <div className="mb-8 lg:mb-12">
            <h2 className="text-2xl lg:text-4xl font-bold text-foreground mb-2">
              Explorar por Gênero
            </h2>
            <p className="text-sm lg:text-base text-muted-foreground">
              Encontre seu próximo filme favorito
            </p>
          </div>
          <div className="flex gap-3 md:gap-4 overflow-x-auto pb-4 hide-scrollbar">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-28 h-36 md:w-32 md:h-40 lg:w-40 lg:h-48 bg-accent rounded-2xl animate-pulse flex-shrink-0" />
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
        <div className="mb-8 lg:mb-12">
          <h2 className="text-2xl lg:text-4xl font-bold text-foreground mb-2">
            Explorar por Gênero
          </h2>
          <p className="text-sm lg:text-base text-muted-foreground">
            Encontre seu próximo filme favorito
          </p>
        </div>

        {/* Genres Scroll Container */}
        <div className="relative">
          <div className="flex gap-3 md:gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory hide-scrollbar">
            {genres.map((genre) => {
              const genreConfig = genreIcons[genre.name] || { icon: Film, color: "from-gray-500 to-slate-500" };
              const Icon = genreConfig.icon;
              return (
                <button
                  key={genre.id}
                  className="group relative flex-shrink-0 snap-start"
                >
                  <div className="relative w-28 h-36 md:w-32 md:h-40 lg:w-40 lg:h-48 rounded-2xl glass border border-border hover:border-primary/50 overflow-hidden transition-all duration-300 hover:scale-105">
                    {/* Background Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${genreConfig.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />

                    {/* Content */}
                    <div className="relative h-full flex flex-col items-center justify-center gap-3 p-4">
                      <div className={`w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-gradient-to-br ${genreConfig.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                      </div>
                      <span className="text-sm lg:text-base font-medium text-foreground text-center">
                        {genre.name}
                      </span>
                    </div>

                    {/* Hover Glow */}
                    <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-xl shadow-primary/20`} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Gradient Fade on Sides */}
          <div className="absolute top-0 right-0 bottom-4 w-16 bg-gradient-to-l from-background to-transparent pointer-events-none" />
        </div>
      </div>

      <style>{`
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
