import { SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import type { Genre } from "../types/tmdb";

interface FiltersProps {
    genres: Genre[];
    selectedGenres: number[];
    onGenreChange: (genreIds: number[]) => void;
    sortBy: string;
    onSortChange: (sort: string) => void;
    yearFrom: string;
    yearTo: string;
    onYearChange: (from: string, to: string) => void;
    ratingMin: number;
    onRatingChange: (rating: number) => void;
}

export function Filters({
    genres,
    selectedGenres,
    onGenreChange,
    sortBy,
    onSortChange,
    yearFrom,
    yearTo,
    onYearChange,
    ratingMin,
    onRatingChange,
}: FiltersProps) {
    const [showFilters, setShowFilters] = useState(false);

    const toggleGenre = (genreId: number) => {
        if (selectedGenres.includes(genreId)) {
            onGenreChange(selectedGenres.filter((id) => id !== genreId));
        } else {
            onGenreChange([...selectedGenres, genreId]);
        }
    };

    const clearFilters = () => {
        onGenreChange([]);
        onSortChange("popularity.desc");
        onYearChange("", "");
        onRatingChange(0);
    };

    const hasActiveFilters =
        selectedGenres.length > 0 ||
        sortBy !== "popularity.desc" ||
        yearFrom ||
        yearTo ||
        ratingMin > 0;

    return (
        <div className="mb-8">
            {/* Filter Toggle Button */}
            <div className="flex items-center gap-4 mb-4">
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full glass border border-border hover:border-primary/50 transition-colors"
                >
                    <SlidersHorizontal className="w-4 h-4" />
                    <span>Filtros</span>
                    {hasActiveFilters && (
                        <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs">
                            {selectedGenres.length + (yearFrom ? 1 : 0) + (ratingMin > 0 ? 1 : 0)}
                        </span>
                    )}
                </button>

                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="flex items-center gap-2 px-4 py-2 rounded-full glass border border-border text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X className="w-4 h-4" />
                        <span>Limpar</span>
                    </button>
                )}
            </div>

            {/* Filters Panel */}
            {showFilters && (
                <div className="glass-strong rounded-2xl px-6 animate-in slide-in-from-top-4 duration-300 mt-4 py-6 space-y-6">
                    {/* Sort By */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-3">
                            Ordenar por
                        </label>
                        <select
                            value={sortBy}
                            onChange={(e) => onSortChange(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg glass border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="popularity.desc">Mais Populares</option>
                            <option value="popularity.asc">Menos Populares</option>
                            <option value="vote_average.desc">Melhor Avaliados</option>
                            <option value="vote_average.asc">Pior Avaliados</option>
                            <option value="release_date.desc">Mais Recentes</option>
                            <option value="release_date.asc">Mais Antigos</option>
                            <option value="title.asc">Título (A-Z)</option>
                            <option value="title.desc">Título (Z-A)</option>
                        </select>
                    </div>

                    {/* Genres */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-3">
                            Gêneros
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {genres.map((genre) => (
                                <button
                                    key={genre.id}
                                    onClick={() => toggleGenre(genre.id)}
                                    className={`px-3 py-1.5 rounded-full text-sm transition-all duration-200 ${selectedGenres.includes(genre.id)
                                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                                            : "glass border border-border text-foreground hover:border-primary/50"
                                        }`}
                                >
                                    {genre.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Year Range */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-3">
                                Ano de
                            </label>
                            <input
                                type="number"
                                value={yearFrom}
                                onChange={(e) => onYearChange(e.target.value, yearTo)}
                                placeholder="1900"
                                min="1900"
                                max={new Date().getFullYear()}
                                className="w-full px-4 py-2 rounded-lg glass border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-3">
                                Ano até
                            </label>
                            <input
                                type="number"
                                value={yearTo}
                                onChange={(e) => onYearChange(yearFrom, e.target.value)}
                                placeholder={new Date().getFullYear().toString()}
                                min="1900"
                                max={new Date().getFullYear()}
                                className="w-full px-4 py-2 rounded-lg glass border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>

                    {/* Rating */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-3">
                            Avaliação mínima: {ratingMin.toFixed(1)}
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="10"
                            step="0.5"
                            value={ratingMin}
                            onChange={(e) => onRatingChange(parseFloat(e.target.value))}
                            className="w-full accent-primary"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>0.0</span>
                            <span>5.0</span>
                            <span>10.0</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
