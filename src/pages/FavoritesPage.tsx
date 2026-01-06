import { Heart, Trash2 } from "lucide-react";
import { useState } from "react";
import { MovieCard } from "../components/MovieCard";
import { MovieDetailsModal } from "../components/MovieDetailsModal";
import { useFavorites } from "../contexts/FavoritesContext";
import { useGenres } from "../hooks/useGenres";
import type { Movie, TVShow } from "../types/tmdb";

export function FavoritesPage() {
    const { favorites, removeFavorite } = useFavorites();
    const { getGenreNames } = useGenres();
    const [selectedItem, setSelectedItem] = useState<(Movie | TVShow) | null>(null);

    const isMovie = (item: any): boolean => {
        return "title" in item;
    };

    return (
        <div className="min-h-screen bg-background pt-24 pb-16">
            <div className="container mx-auto px-4 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <Heart className="w-8 h-8 text-red-500 fill-current" />
                        <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
                            Meus Favoritos
                        </h1>
                    </div>
                    <p className="text-muted-foreground">
                        {favorites.length} {favorites.length === 1 ? "item salvo" : "itens salvos"}
                    </p>
                </div>

                {/* Empty State */}
                {favorites.length === 0 && (
                    <div className="text-center py-20">
                        <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                        <h3 className="text-xl font-semibold text-foreground mb-2">
                            Nenhum favorito ainda
                        </h3>
                        <p className="text-muted-foreground">
                            Adicione filmes e séries aos favoritos para vê-los aqui
                        </p>
                    </div>
                )}

                {/* Favorites Grid */}
                {favorites.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4 lg:gap-6">
                        {favorites.map((item) => {
                            return (
                                <div key={item.id} className="relative group">
                                    <MovieCard
                                        item={item}
                                        onOpenDetails={setSelectedItem}
                                    />

                                    {/* Remove Button */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeFavorite(item.id);
                                        }}
                                        className="absolute top-2 right-2 z-10 p-2 rounded-full bg-black/70 hover:bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-all duration-300"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Details Modal */}
            {selectedItem && (
                <MovieDetailsModal
                    item={selectedItem}
                    isOpen={!!selectedItem}
                    onClose={() => setSelectedItem(null)}
                />
            )}
        </div>
    );
}