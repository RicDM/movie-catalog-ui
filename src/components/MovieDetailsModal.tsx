import { Bookmark, Calendar, Clock, Heart, Play, Share2, Star, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useFavorites } from "../contexts/FavoritesContext";
import {
    formatRuntime,
    getBackdropUrl,
    getMovieDetails,
    getMovieVideos,
    getTrailerKey,
    getTVShowDetails,
    getTVShowVideos,
    getYearFromDate
} from "../services/tmdb";
import type { Movie, MovieDetails, TVShow, TVShowDetails, VideosResponse } from "../types/tmdb";
import { ImageWithFallback } from "./figma/ImageWithFallback";

function isMovie(item: Movie | TVShow): item is Movie {
    return "title" in item;
}

interface MovieDetailsModalProps {
    item: Movie | TVShow;
    isOpen: boolean;
    onClose: () => void;
}

export function MovieDetailsModal({ item, isOpen, onClose }: MovieDetailsModalProps) {
    const [details, setDetails] = useState<MovieDetails | TVShowDetails | null>(null);
    const [videos, setVideos] = useState<VideosResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [showTrailer, setShowTrailer] = useState(false);
    const { isFavorite, toggleFavorite } = useFavorites();

    const mediaType = isMovie(item) ? "movie" : "tv";
    const id = item.id;

    useEffect(() => {
        async function loadDetails() {
            try {
                setLoading(true);
                const [detailsData, videosData] = await Promise.all([
                    mediaType === "movie" ? getMovieDetails(id) : getTVShowDetails(id),
                    mediaType === "movie" ? getMovieVideos(id) : getTVShowVideos(id),
                ]);
                setDetails(detailsData);
                setVideos(videosData);
            } catch (error) {
                console.error("Erro ao carregar detalhes:", error);
            } finally {
                setLoading(false);
            }
        }

        if (isOpen) {
            loadDetails();
        }
    }, [id, mediaType, isOpen]);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, []);

    if (loading || !details) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                <div className="animate-pulse text-white text-xl">Carregando...</div>
            </div>
        );
    }

    const isMovieType = "title" in details;
    const title = isMovieType ? details.title : details.name;
    const releaseDate = isMovieType ? details.release_date : details.first_air_date;
    const runtime = isMovieType ? formatRuntime(details.runtime) : `${details.number_of_seasons} temporadas`;
    const trailerKey = videos ? getTrailerKey(videos) : null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-2 md:p-4">
            <div className="w-full h-full max-w-7xl max-h-[95vh] overflow-hidden">
                <div className="relative bg-background/95 rounded-2xl md:rounded-3xl shadow-2xl flex flex-col md:flex-row gap-4 md:gap-6 w-full h-full overflow-hidden border border-border/30 p-4 md:p-6 lg:p-8">
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-2 right-2 md:top-4 md:right-4 z-50 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors shadow-lg"
                        aria-label="Fechar"
                    >
                        <X className="w-5 h-5 md:w-6 md:h-6" />
                    </button>

                    {/* Video Section */}
                    <div className="w-full md:flex-1 flex items-center justify-center min-h-[200px] md:min-h-[300px] lg:min-h-[400px] max-h-[40vh] lg:max-h-full">
                        <div className="relative rounded-xl md:rounded-2xl md:w-1/2 overflow-hidden shadow-xl border border-border/20">
                            {showTrailer && trailerKey ? (
                                <iframe
                                    className="w-full h-full min-h-[200px] aspect-video md:min-h-[300px] lg:min-h-[400px] rounded-xl md:rounded-2xl"
                                    style={{
                                        height: "50vh",      
                                        width: "auto",        
                                        aspectRatio: "16 / 9", 
                                        border: "none"
                                    }}
                                    src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&modestbranding=1`}
                                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            ) : (
                                <>
                                    <ImageWithFallback
                                        src={getBackdropUrl(details.backdrop_path, "w1280")}
                                        alt={title}
                                        className="w-full h-1/2 object-cover rounded-xl md:rounded-2xl"
                                        style={{ minHeight: "200px" }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                                    {trailerKey && (
                                        <button
                                            onClick={() => setShowTrailer(true)}
                                            className="absolute inset-0 flex items-center justify-center group"
                                            aria-label="Assistir trailer"
                                        >
                                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xl shadow-primary/50">
                                                <Play className="w-8 h-8 md:w-10 md:h-10 text-white fill-current ml-1" />
                                            </div>
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Info Card */}
                    <div className="flex-1 w-full md:w-[400px] xl:w-[450px] glass-strong rounded-xl md:rounded-2xl flex flex-col p-4 md:p-6 shadow-xl border border-border/20 overflow-y-auto max-h-[50vh] lg:max-h-full">
                        {/* Title and Actions */}
                        <div className="flex items-start justify-between gap-2 mb-4">
                            <div className="flex-1 min-w-0">
                                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-1 md:mb-2 leading-tight truncate">
                                    {title}
                                </h1>
                                {details.tagline && (
                                    <p className="text-xs md:text-sm text-muted-foreground italic mb-1 line-clamp-2">"{details.tagline}"</p>
                                )}
                            </div>

                            <div className="flex gap-1 md:gap-2 flex-shrink-0">
                                <button
                                    onClick={() => toggleFavorite(item, mediaType)}
                                    className={`p-4 md:p-3 rounded-full glass border transition-all duration-300 ${isFavorite(id)
                                        ? "border-red-500 text-red-500 bg-red-500/10"
                                        : "border-border text-muted-foreground hover:text-foreground bg-background/60 p-4"
                                        }`}
                                    aria-label="Favoritar"
                                >
                                    <Heart className={`w-4 h-4 md:w-5 md:h-5 ${isFavorite(id) ? "fill-current" : ""}`} />
                                </button>
                                <button className="p-2 md:p-3 rounded-full glass border border-border text-muted-foreground hover:text-foreground transition-colors bg-background/60 p-4" aria-label="Salvar">
                                    <Bookmark className="w-4 h-4 md:w-5 md:h-5" />
                                </button>
                                <button className="p-2 md:p-3 rounded-full glass border border-border text-muted-foreground hover:text-foreground transition-colors bg-background/60 p-4" aria-label="Compartilhar">
                                    <Share2 className="w-4 h-4 md:w-5 md:h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Meta Info */}
                        <div className="flex flex-wrap gap-2 mb-3 md:mb-4">
                            <div className="flex items-center gap-1.5 px-2.5 md:px-3 py-1 md:py-1.5 rounded-full glass border border-primary/30 bg-background/60 p-2">
                                <Star className="w-5 h-5 md:w-4 md:h-4 text-yellow-400 fill-yellow-400" />
                                <span className="text-foreground font-semibold text-s md:text-sm">{details.vote_average.toFixed(1)}</span>
                            </div>
                            <div className="flex items-center gap-1.5 px-2.5 md:px-3 py-1 md:py-1.5 rounded-full glass bg-background/60 p-2">
                                <Calendar className="w-5 h-5 md:w-4 md:h-4 text-muted-foreground" />
                                <span className="text-foreground text-s md:text-sm">{getYearFromDate(releaseDate)}</span>
                            </div>
                            <div className="flex items-center gap-1.5 px-2.5 md:px-3 py-1 md:py-1.5 rounded-full glass bg-background/60 p-2">
                                <Clock className="w-5 h-5 md:w-4 md:h-4 text-muted-foreground" />
                                <span className="text-foreground text-s md:text-sm">{runtime}</span>
                            </div>
                        </div>

                        {/* Genres */}
                        <div className="flex flex-wrap gap-1.5 md:gap-2 mb-3 md:mb-4">
                            {details.genres.map((genre) => (
                                <span
                                    key={genre.id}
                                    className="px-2.5 md:px-3 py-0.5 md:py-1 rounded-full bg-primary/10 text-primary text-xs font-medium"
                                >
                                    {genre.name}
                                </span>
                            ))}
                        </div>

                        {/* Overview */}
                        <div className="mb-3 md:mb-4">
                            <h2 className="text-base md:text-lg font-semibold text-foreground mb-1 md:mb-2">Sinopse</h2>
                            <p className="text-muted-foreground text-s md:text-sm leading-relaxed">{details.overview}</p>
                        </div>

                        {/* Informações */}
                        <div className="mb-3 md:mb-4">
                            <h3 className="text-base md:text-lg font-semibold text-foreground mb-1 md:mb-2">Informações</h3>
                            <div className="space-y-1 text-s md:text-sm">
                                <div>
                                    <span className="text-muted-foreground">Idioma: </span>
                                    <span className="text-foreground">{details.original_language.toUpperCase()}</span>
                                </div>
                                {isMovieType && 'budget' in details && details.budget > 0 && (
                                    <div>
                                        <span className="text-muted-foreground">Orçamento: </span>
                                        <span className="text-foreground">
                                            ${details.budget.toLocaleString()}
                                        </span>
                                    </div>
                                )}
                                {isMovieType && 'revenue' in details && details.revenue > 0 && (
                                    <div>
                                        <span className="text-muted-foreground">Receita: </span>
                                        <span className="text-foreground">
                                            ${details.revenue.toLocaleString()}
                                        </span>
                                    </div>
                                )}
                                {!isMovieType && 'number_of_episodes' in details && (
                                    <div>
                                        <span className="text-muted-foreground">Episódios: </span>
                                        <span className="text-foreground">{details.number_of_episodes}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Production Info */}
                        {details.production_companies.length > 0 && (
                            <div>
                                <h3 className="text-base md:text-lg font-semibold text-foreground mb-1 md:mb-2">Produção</h3>
                                <div className="flex flex-wrap gap-2">
                                    {details.production_companies.slice(0, 4).map((company) => (
                                        <span key={company.id} className="text-s text-muted-foreground font-medium">
                                            {company.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
