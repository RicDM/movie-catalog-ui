import { Tv } from "lucide-react";
import { useEffect, useState } from "react";
import { useGenres } from "../hooks/useGenres";
import { getPopularTVShows } from "../services/tmdb";
import type { Movie, TVShow } from "../types/tmdb";
import { MovieCard } from "./MovieCard";
import { MovieDetailsModal } from "./MovieDetailsModal";

export function FeaturedTVShows() {
    const [shows, setShows] = useState<TVShow[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedShow, setSelectedShow] = useState<Movie | TVShow | null>(null);
    const { getGenreNames, loading: genresLoading } = useGenres();

    useEffect(() => {
        async function loadShows() {
            try {
                setLoading(true);
                const popularShows = await getPopularTVShows();
                setShows(popularShows.slice(0, 12));
            } catch (error) {
                console.error("Erro ao carregar séries populares:", error);
            } finally {
                setLoading(false);
            }
        }

        loadShows();
    }, []);

    if (loading || genresLoading) {
        return (
            <section className="py-16 lg:py-24 px-4 lg:px-8 relative">
                <div className="container mx-auto">
                    <div className="flex items-center justify-between mb-8 lg:mb-12">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Tv className="w-6 h-6 text-primary" />
                                <h2 className="text-2xl lg:text-4xl font-bold text-foreground">
                                    Séries Populares
                                </h2>
                            </div>
                            <p className="text-sm lg:text-base text-muted-foreground">
                                As séries mais assistidas
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4 lg:gap-6">
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className="aspect-[2/3] bg-accent rounded-xl animate-pulse" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 lg:py-24 px-4 lg:px-8 relative bg-accent/20">
            <div className="container mx-auto">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-8 lg:mb-12">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Tv className="w-6 h-6 text-primary" />
                            <h2 className="text-2xl lg:text-4xl font-bold text-foreground">
                                Séries Populares
                            </h2>
                        </div>
                        <p className="text-sm lg:text-base text-muted-foreground">
                            As séries mais assistidas
                        </p>
                    </div>
                    <button className="hidden md:block px-6 py-2 rounded-full glass border border-border hover:border-primary/50 text-foreground hover:text-primary transition-all duration-300">
                        Ver Todas
                    </button>
                </div>

                {/* TV Shows Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4 lg:gap-6">
                    {shows.map((show) => (
                        <MovieCard
                            key={show.id}
                            item={show}
                            onOpenDetails={setSelectedShow}
                        />
                    ))}
                </div>

                {/* Mobile See All Button */}
                <div className="md:hidden mt-8 flex justify-center">
                    <button className="w-full max-w-xs px-6 py-3 rounded-full glass border border-border hover:border-primary/50 text-foreground hover:text-primary transition-all duration-300">
                        Ver Todas
                    </button>
                </div>
            </div>

            {/* Details Modal */}
            {selectedShow && (
                <MovieDetailsModal
                    item={selectedShow}
                    isOpen={!!selectedShow}
                    onClose={() => setSelectedShow(null)}
                />
            )}
        </section>
    );
}
