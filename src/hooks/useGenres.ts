// Hook para gerenciar e mapear gêneros do TMDB
import { useEffect, useState } from "react";
import { getMovieGenres, getTVGenres } from "../services/tmdb";
import type { Genre } from "../types/tmdb";

export function useGenres() {
    const [movieGenres, setMovieGenres] = useState<Genre[]>([]);
    const [tvGenres, setTVGenres] = useState<Genre[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadGenres() {
            try {
                setLoading(true);
                const [movies, tv] = await Promise.all([
                    getMovieGenres(),
                    getTVGenres(),
                ]);
                setMovieGenres(movies);
                setTVGenres(tv);
            } catch (error) {
                console.error("Erro ao carregar gêneros:", error);
            } finally {
                setLoading(false);
            }
        }

        loadGenres();
    }, []);

    // Função para obter nomes dos gêneros a partir dos IDs
    const getGenreNames = (genreIds: number[], type: "movie" | "tv" = "movie"): string => {
        const genres = type === "movie" ? movieGenres : tvGenres;
        const names = genreIds
            .map((id) => genres.find((g) => g.id === id)?.name)
            .filter(Boolean);
        return names.join(", ") || "Sem gênero";
    };

    return {
        movieGenres,
        tvGenres,
        loading,
        getGenreNames,
    };
}
