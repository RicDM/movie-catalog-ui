import { Film, Tv, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Filters } from "../components/Filters";
import { MovieCard } from "../components/MovieCard";
import { MovieDetailsModal } from "../components/MovieDetailsModal";
import { Pagination } from "../components/Pagination";
import { useGenres } from "../hooks/useGenres";
import {
    discoverMoviesAdvanced,
    discoverTVShowsAdvanced,
    getPopularMovies,
    getPopularTVShows
} from "../services/tmdb";
import type { Movie, TVShow } from "../types/tmdb";

const ITEMS_PER_PAGE = 24;

type MediaType = "movie" | "tv";

export function CatalogPage() {
    const [mediaType, setMediaType] = useState<MediaType>("movie");
    const [allMovies, setAllMovies] = useState<Movie[]>([]);
    const [allTVShows, setAllTVShows] = useState<TVShow[]>([]);
    const [displayedMovies, setDisplayedMovies] = useState<Movie[]>([]);
    const [displayedTVShows, setDisplayedTVShows] = useState<TVShow[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedMovie, setSelectedMovie] = useState<Movie | TVShow | null>(null);

    const { movieGenres, tvGenres, getGenreNames, loading: genresLoading } = useGenres();

    // Filtros
    const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
    const [sortBy, setSortBy] = useState("popularity.desc");
    const [yearFrom, setYearFrom] = useState("");
    const [yearTo, setYearTo] = useState("");
    const [ratingMin, setRatingMin] = useState(0);

    // Carregar filmes ou séries com os filtros
    useEffect(() => {
        async function loadContent() {
            try {
                setLoading(true);
                setCurrentPage(1); // Resetar para primeira página ao mudar filtros

                const hasFilters =
                    selectedGenres.length > 0 ||
                    yearFrom ||
                    yearTo ||
                    ratingMin > 0 ||
                    sortBy !== "popularity.desc";

                if (mediaType === "movie") {
                    let results: Movie[] = [];

                    if (hasFilters) {
                        // Usar busca avançada com filtros
                        const { results: filteredMovies } = await discoverMoviesAdvanced({
                            genres: selectedGenres,
                            sortBy,
                            yearFrom,
                            yearTo,
                            ratingMin,
                        }, 5);

                        results = filteredMovies;
                    } else {
                        // Sem filtros, buscar filmes populares de múltiplas páginas
                        const promises = [];
                        for (let i = 1; i <= 5; i++) {
                            promises.push(getPopularMovies(i));
                        }
                        const pages = await Promise.all(promises);
                        results = pages.flat();
                    }

                    setAllMovies(results);
                    setTotalPages(Math.ceil(results.length / ITEMS_PER_PAGE));
                } else {
                    let results: TVShow[] = [];

                    if (hasFilters) {
                        // Usar busca avançada com filtros
                        const { results: filteredTVShows } = await discoverTVShowsAdvanced({
                            genres: selectedGenres,
                            sortBy,
                            yearFrom,
                            yearTo,
                            ratingMin,
                        }, 5);

                        results = filteredTVShows;
                    } else {
                        // Sem filtros, buscar séries populares de múltiplas páginas
                        const promises = [];
                        for (let i = 1; i <= 5; i++) {
                            promises.push(getPopularTVShows(i));
                        }
                        const pages = await Promise.all(promises);
                        results = pages.flat();
                    }

                    setAllTVShows(results);
                    setTotalPages(Math.ceil(results.length / ITEMS_PER_PAGE));
                }
            } catch (error) {
                console.error(`Erro ao carregar ${mediaType === "movie" ? "filmes" : "séries"}:`, error);
            } finally {
                setLoading(false);
            }
        }

        if (!genresLoading) {
            loadContent();
        }
    }, [mediaType, selectedGenres, sortBy, yearFrom, yearTo, ratingMin, genresLoading]);

    // Atualizar conteúdo exibido quando a página mudar
    useEffect(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        
        if (mediaType === "movie") {
            setDisplayedMovies(allMovies.slice(startIndex, endIndex));
        } else {
            setDisplayedTVShows(allTVShows.slice(startIndex, endIndex));
        }
    }, [currentPage, allMovies, allTVShows, mediaType]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const currentGenres = mediaType === "movie" ? movieGenres : tvGenres;
    const displayedItems = mediaType === "movie" ? displayedMovies : displayedTVShows;
    const allItems = mediaType === "movie" ? allMovies : allTVShows;

    return (
        <div className="min-h-screen bg-background mt-64 pt-32 pb-16">
            <div className="container mx-auto px-4 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
                        <div className="flex items-center gap-3">
                            {mediaType === "movie" ? (
                                <Film className="w-8 h-8 text-primary" />
                            ) : (
                                <Tv className="w-8 h-8 text-primary" />
                            )}
                            <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
                                {mediaType === "movie" ? "Catálogo de Filmes" : "Catálogo de Séries"}
                            </h1>
                        </div>
                        
                        {/* Toggle Filmes/Séries */}
                        <div className="flex gap-2 p-1 rounded-full glass border border-border">
                            <button
                                onClick={() => {
                                    setMediaType("movie");
                                    setSelectedGenres([]);
                                    setCurrentPage(1);
                                }}
                                className={`px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-2 ${
                                    mediaType === "movie"
                                        ? "bg-primary text-primary-foreground shadow-lg"
                                        : "text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                <Film className="w-4 h-4" />
                                <span className="hidden sm:inline">Filmes</span>
                            </button>
                            <button
                                onClick={() => {
                                    setMediaType("tv");
                                    setSelectedGenres([]);
                                    setCurrentPage(1);
                                }}
                                className={`px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-2 ${
                                    mediaType === "tv"
                                        ? "bg-primary text-primary-foreground shadow-lg"
                                        : "text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                <Tv className="w-4 h-4" />
                                <span className="hidden sm:inline">Séries</span>
                            </button>
                        </div>
                    </div>
                    <p className="text-muted-foreground">
                        {mediaType === "movie" 
                            ? "Explore nossa coleção completa de filmes"
                            : "Explore nossa coleção completa de séries"
                        }
                    </p>
                </div>

                {/* Filters */}
                {!genresLoading && (
                    <Filters
                        genres={currentGenres}
                        selectedGenres={selectedGenres}
                        onGenreChange={setSelectedGenres}
                        sortBy={sortBy}
                        onSortChange={setSortBy}
                        yearFrom={yearFrom}
                        yearTo={yearTo}
                        onYearChange={(from, to) => {
                            setYearFrom(from);
                            setYearTo(to);
                        }}
                        ratingMin={ratingMin}
                        onRatingChange={setRatingMin}
                    />
                )}

                {/* Results Count */}
                {!loading && (
                    <div className="mb-6 text-sm text-muted-foreground">
                        Mostrando {displayedItems.length} de {allItems.length} resultados
                    </div>
                )}

                {/* Loading */}
                {loading && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4 lg:gap-6">
                        {[...Array(24)].map((_, i) => (
                            <div key={i} className="aspect-[2/3] bg-accent rounded-xl animate-pulse" />
                        ))}
                    </div>
                )}

                {/* Content Grid */}
                {!loading && displayedItems.length > 0 && (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4 lg:gap-6 mb-8">
                            {displayedItems.map((item) => (
                                <MovieCard
                                    key={item.id}
                                    item={item}
                                    onOpenDetails={setSelectedMovie}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        )}
                    </>
                )}

                {/* No Results */}
                {!loading && displayedItems.length === 0 && (
                    <div className="text-center py-20">
                        <TrendingUp className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                        <h3 className="text-xl font-semibold text-foreground mb-2">
                            Nenhum resultado encontrado
                        </h3>
                        <p className="text-muted-foreground">
                            Tente ajustar os filtros para ver mais opções
                        </p>
                    </div>
                )}
            </div>

            {/* Details Modal */}
            {selectedMovie && (
                <MovieDetailsModal
                    item={selectedMovie}
                    isOpen={!!selectedMovie}
                    onClose={() => setSelectedMovie(null)}
                />
            )}
        </div>
    );
}
