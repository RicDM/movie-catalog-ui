// Tipos para a API do TMDB

export interface Movie {
    id: number;
    title: string;
    original_title: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    release_date: string;
    vote_average: number;
    vote_count: number;
    genre_ids: number[];
    adult: boolean;
    popularity: number;
    original_language: string;
    video: boolean;
}

export interface TVShow {
    id: number;
    name: string;
    original_name: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    first_air_date: string;
    vote_average: number;
    vote_count: number;
    genre_ids: number[];
    popularity: number;
    original_language: string;
    origin_country: string[];
}

export interface Genre {
    id: number;
    name: string;
}

export interface MovieDetails extends Movie {
    genres: Genre[];
    runtime: number | null;
    status: string;
    tagline: string;
    budget: number;
    revenue: number;
    homepage: string;
    imdb_id: string | null;
    production_companies: ProductionCompany[];
    production_countries: ProductionCountry[];
    spoken_languages: SpokenLanguage[];
}

export interface TVShowDetails extends TVShow {
    genres: Genre[];
    episode_run_time: number[];
    status: string;
    tagline: string;
    homepage: string;
    number_of_episodes: number;
    number_of_seasons: number;
    production_companies: ProductionCompany[];
    production_countries: ProductionCountry[];
    spoken_languages: SpokenLanguage[];
    created_by: Creator[];
    networks: Network[];
}

export interface ProductionCompany {
    id: number;
    name: string;
    logo_path: string | null;
    origin_country: string;
}

export interface ProductionCountry {
    iso_3166_1: string;
    name: string;
}

export interface SpokenLanguage {
    iso_639_1: string;
    name: string;
    english_name: string;
}

export interface Creator {
    id: number;
    name: string;
    profile_path: string | null;
}

export interface Network {
    id: number;
    name: string;
    logo_path: string | null;
    origin_country: string;
}

export interface TMDBResponse<T> {
    page: number;
    results: T[];
    total_pages: number;
    total_results: number;
}

export interface GenresResponse {
    genres: Genre[];
}

export interface Video {
    id: string;
    key: string;
    name: string;
    site: string;
    type: string;
    official: boolean;
    published_at: string;
}

export interface VideosResponse {
    id: number;
    results: Video[];
}

export interface Cast {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
    order: number;
}

export interface Crew {
    id: number;
    name: string;
    job: string;
    department: string;
    profile_path: string | null;
}

export interface CreditsResponse {
    id: number;
    cast: Cast[];
    crew: Crew[];
}
