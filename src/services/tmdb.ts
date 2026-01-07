import type {
    CreditsResponse,
    Genre,
    GenresResponse,
    Movie,
    MovieDetails,
    TMDBResponse,
    TVShow,
    TVShowDetails,
    VideosResponse,
} from "../types/tmdb";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

if (!API_KEY) {
    console.error(
        "TMDB API Key não encontrada. Configure a variável NEXT_PUBLIC_TMDB_API_KEY no arquivo .env"
    );
}

// Função auxiliar para fazer requisições à API
async function fetchFromTMDB<T>(endpoint: string): Promise<T> {
    const url = `${BASE_URL}${endpoint}${endpoint.includes("?") ? "&" : "?"}api_key=${API_KEY}&language=pt-BR`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`TMDB API Error: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Erro ao buscar dados do TMDB:", error);
        throw error;
    }
}

// ============ FILMES ============

export async function getTrendingMovies(
    timeWindow: "day" | "week" = "week"
): Promise<Movie[]> {
    const data = await fetchFromTMDB<TMDBResponse<Movie>>(
        `/trending/movie/${timeWindow}`
    );
    return data.results;
}

export async function getPopularMovies(page: number = 1): Promise<Movie[]> {
    const data = await fetchFromTMDB<TMDBResponse<Movie>>(
        `/movie/popular?page=${page}`
    );
    return data.results;
}

export async function getTopRatedMovies(page: number = 1): Promise<Movie[]> {
    const data = await fetchFromTMDB<TMDBResponse<Movie>>(
        `/movie/top_rated?page=${page}`
    );
    return data.results;
}

export async function getUpcomingMovies(page: number = 1): Promise<Movie[]> {
    const data = await fetchFromTMDB<TMDBResponse<Movie>>(
        `/movie/upcoming?page=${page}`
    );
    return data.results;
}

export async function getNowPlayingMovies(page: number = 1): Promise<Movie[]> {
    const data = await fetchFromTMDB<TMDBResponse<Movie>>(
        `/movie/now_playing?page=${page}`
    );
    return data.results;
}

export async function getMovieDetails(movieId: number): Promise<MovieDetails> {
    return await fetchFromTMDB<MovieDetails>(`/movie/${movieId}`);
}

export async function getMovieVideos(movieId: number): Promise<VideosResponse> {
    return await fetchFromTMDB<VideosResponse>(`/movie/${movieId}/videos`);
}

export async function getMovieCredits(movieId: number): Promise<CreditsResponse> {
    return await fetchFromTMDB<CreditsResponse>(`/movie/${movieId}/credits`);
}

export async function searchMovies(query: string, page: number = 1): Promise<Movie[]> {
    const data = await fetchFromTMDB<TMDBResponse<Movie>>(
        `/search/movie?query=${encodeURIComponent(query)}&page=${page}`
    );
    return data.results;
}

// ============ SÉRIES ============

export async function getTrendingTVShows(
    timeWindow: "day" | "week" = "week"
): Promise<TVShow[]> {
    const data = await fetchFromTMDB<TMDBResponse<TVShow>>(
        `/trending/tv/${timeWindow}`
    );
    return data.results;
}

export async function getPopularTVShows(page: number = 1): Promise<TVShow[]> {
    const data = await fetchFromTMDB<TMDBResponse<TVShow>>(
        `/tv/popular?page=${page}`
    );
    return data.results;
}

export async function getTopRatedTVShows(page: number = 1): Promise<TVShow[]> {
    const data = await fetchFromTMDB<TMDBResponse<TVShow>>(
        `/tv/top_rated?page=${page}`
    );
    return data.results;
}

export async function getOnTheAirTVShows(page: number = 1): Promise<TVShow[]> {
    const data = await fetchFromTMDB<TMDBResponse<TVShow>>(
        `/tv/on_the_air?page=${page}`
    );
    return data.results;
}

export async function getAiringTodayTVShows(page: number = 1): Promise<TVShow[]> {
    const data = await fetchFromTMDB<TMDBResponse<TVShow>>(
        `/tv/airing_today?page=${page}`
    );
    return data.results;
}

export async function getTVShowDetails(tvId: number): Promise<TVShowDetails> {
    return await fetchFromTMDB<TVShowDetails>(`/tv/${tvId}`);
}

export async function getTVShowCredits(tvId: number): Promise<CreditsResponse> {
    return await fetchFromTMDB<CreditsResponse>(`/tv/${tvId}/credits`);
}

export async function getTVShowVideos(tvId: number): Promise<VideosResponse> {
    return await fetchFromTMDB<VideosResponse>(`/tv/${tvId}/videos`);
}

export async function searchTVShows(query: string, page: number = 1): Promise<TVShow[]> {
    const data = await fetchFromTMDB<TMDBResponse<TVShow>>(
        `/search/tv?query=${encodeURIComponent(query)}&page=${page}`
    );
    return data.results;
}

// ============ GÊNEROS ============

export async function getMovieGenres(): Promise<Genre[]> {
    const data = await fetchFromTMDB<GenresResponse>(`/genre/movie/list`);
    return data.genres;
}

export async function getTVGenres(): Promise<Genre[]> {
    const data = await fetchFromTMDB<GenresResponse>(`/genre/tv/list`);
    return data.genres;
}

export async function discoverMoviesByGenre(
    genreId: number,
    page: number = 1
): Promise<Movie[]> {
    const data = await fetchFromTMDB<TMDBResponse<Movie>>(
        `/discover/movie?with_genres=${genreId}&page=${page}&sort_by=popularity.desc`
    );
    return data.results;
}

export async function discoverTVShowsByGenre(
    genreId: number,
    page: number = 1
): Promise<TVShow[]> {
    const data = await fetchFromTMDB<TMDBResponse<TVShow>>(
        `/discover/tv?with_genres=${genreId}&page=${page}&sort_by=popularity.desc`
    );
    return data.results;
}

// ============ BUSCA AVANÇADA COM FILTROS ============

export interface DiscoverFilters {
    genres?: number[];
    sortBy?: string;
    yearFrom?: string;
    yearTo?: string;
    ratingMin?: number;
}

export async function discoverMoviesAdvanced(
    filters: DiscoverFilters,
    maxPages: number = 5
): Promise<{ results: Movie[]; totalResults: number }> {
    const {
        genres = [],
        sortBy = "popularity.desc",
        yearFrom,
        yearTo,
        ratingMin,
    } = filters;

    // Construir parâmetros da query
    let params = `sort_by=${sortBy}`;

    if (genres.length > 0) {
        params += `&with_genres=${genres.join(",")}`;
    }

    if (yearFrom) {
        params += `&primary_release_date.gte=${yearFrom}-01-01`;
    }

    if (yearTo) {
        params += `&primary_release_date.lte=${yearTo}-12-31`;
    }

    if (ratingMin && ratingMin > 0) {
        params += `&vote_average.gte=${ratingMin}`;
    }

    // Buscar múltiplas páginas
    const allResults: Movie[] = [];
    let totalResults = 0;

    for (let page = 1; page <= maxPages; page++) {
        try {
            const data = await fetchFromTMDB<TMDBResponse<Movie>>(
                `/discover/movie?${params}&page=${page}`
            );

            allResults.push(...data.results);
            totalResults = data.total_results;

            // Parar se não houver mais páginas
            if (page >= data.total_pages) {
                break;
            }
        } catch (error) {
            console.error(`Erro ao buscar página ${page}:`, error);
            break;
        }
    }

    return { results: allResults, totalResults };
}

export async function discoverTVShowsAdvanced(
    filters: DiscoverFilters,
    maxPages: number = 5
): Promise<{ results: TVShow[]; totalResults: number }> {
    const {
        genres = [],
        sortBy = "popularity.desc",
        yearFrom,
        yearTo,
        ratingMin,
    } = filters;

    // Construir parâmetros da query
    let params = `sort_by=${sortBy}`;

    if (genres.length > 0) {
        params += `&with_genres=${genres.join(",")}`;
    }

    if (yearFrom) {
        params += `&first_air_date.gte=${yearFrom}-01-01`;
    }

    if (yearTo) {
        params += `&first_air_date.lte=${yearTo}-12-31`;
    }

    if (ratingMin && ratingMin > 0) {
        params += `&vote_average.gte=${ratingMin}`;
    }

    // Buscar múltiplas páginas
    const allResults: TVShow[] = [];
    let totalResults = 0;

    for (let page = 1; page <= maxPages; page++) {
        try {
            const data = await fetchFromTMDB<TMDBResponse<TVShow>>(
                `/discover/tv?${params}&page=${page}`
            );

            allResults.push(...data.results);
            totalResults = data.total_results;

            // Parar se não houver mais páginas
            if (page >= data.total_pages) {
                break;
            }
        } catch (error) {
            console.error(`Erro ao buscar página ${page}:`, error);
            break;
        }
    }

    return { results: allResults, totalResults };
}

// ============ BUSCA MULTI ============

export async function searchMulti(
    query: string,
    page: number = 1
): Promise<(Movie | TVShow)[]> {
    const data = await fetchFromTMDB<TMDBResponse<Movie | TVShow>>(
        `/search/multi?query=${encodeURIComponent(query)}&page=${page}`
    );
    return data.results;
}

// ============ IMAGENS ============

export function getImageUrl(
    path: string | null,
    size: "w200" | "w300" | "w500" | "w780" | "w1280" | "original" = "w500"
): string {
    if (!path) {
        return "https://via.placeholder.com/500x750?text=Sem+Imagem";
    }
    return `${IMAGE_BASE_URL}/${size}${path}`;
}

export function getBackdropUrl(
    path: string | null,
    size: "w300" | "w780" | "w1280" | "original" = "original"
): string {
    if (!path) {
        return "https://via.placeholder.com/1280x720?text=Sem+Imagem";
    }
    return `${IMAGE_BASE_URL}/${size}${path}`;
}

export function getProfileUrl(
    path: string | null,
    size: "w45" | "w185" | "h632" | "original" = "w185"
): string {
    if (!path) {
        return "https://via.placeholder.com/185x278?text=Sem+Foto";
    }
    return `${IMAGE_BASE_URL}/${size}${path}`;
}

// ============ UTILITÁRIOS ============

export function getYearFromDate(date: string | undefined): string {
    if (!date) return "N/A";
    return new Date(date).getFullYear().toString();
}

export function formatRuntime(minutes: number | null): string {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
}

export function getTrailerKey(videos: VideosResponse): string | null {
    // Prioridade 1: Trailer oficial em português (dublado)
    const ptBRTrailer = videos.results.find(
        (video) =>
            video.site === "YouTube" &&
            video.type === "Trailer" &&
            video.official &&
            (video.iso_639_1 === "pt" || video.iso_639_1 === "pt-BR")
    );
    if (ptBRTrailer) return ptBRTrailer.key;

    // Prioridade 2: Qualquer vídeo em português
    const ptVideo = videos.results.find(
        (video) =>
            video.site === "YouTube" &&
            (video.iso_639_1 === "pt" || video.iso_639_1 === "pt-BR")
    );
    if (ptVideo) return ptVideo.key;

    // Prioridade 3: Trailer oficial em inglês (legendado)
    const enTrailer = videos.results.find(
        (video) =>
            video.site === "YouTube" &&
            video.type === "Trailer" &&
            video.official &&
            video.iso_639_1 === "en"
    );
    if (enTrailer) return enTrailer.key;

    // Prioridade 4: Qualquer trailer oficial
    const officialTrailer = videos.results.find(
        (video) =>
            video.site === "YouTube" &&
            video.type === "Trailer" &&
            video.official
    );
    if (officialTrailer) return officialTrailer.key;

    // Último recurso: primeiro vídeo disponível
    return videos.results[0]?.key || null;
}
