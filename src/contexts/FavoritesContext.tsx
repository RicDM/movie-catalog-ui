import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import type { Movie, TVShow } from "../types/tmdb";

type MediaItem = (Movie | TVShow) & { mediaType: "movie" | "tv" };

interface FavoritesContextType {
    favorites: MediaItem[];
    addFavorite: (item: Movie | TVShow, mediaType: "movie" | "tv") => void;
    removeFavorite: (id: number) => void;
    isFavorite: (id: number) => boolean;
    toggleFavorite: (item: Movie | TVShow, mediaType: "movie" | "tv") => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
    const [favorites, setFavorites] = useState<MediaItem[]>(() => {
        const saved = localStorage.getItem("cinemax-favorites");
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem("cinemax-favorites", JSON.stringify(favorites));
    }, [favorites]);

    const addFavorite = (item: Movie | TVShow, mediaType: "movie" | "tv") => {
        setFavorites((prev) => {
            if (prev.some((fav) => fav.id === item.id)) return prev;
            return [...prev, { ...item, mediaType }];
        });
    };

    const removeFavorite = (id: number) => {
        setFavorites((prev) => prev.filter((fav) => fav.id !== id));
    };

    const isFavorite = (id: number) => {
        return favorites.some((fav) => fav.id === id);
    };

    const toggleFavorite = (item: Movie | TVShow, mediaType: "movie" | "tv") => {
        if (isFavorite(item.id)) {
            removeFavorite(item.id);
        } else {
            addFavorite(item, mediaType);
        }
    };

    return (
        <FavoritesContext.Provider
            value={{ favorites, addFavorite, removeFavorite, isFavorite, toggleFavorite }}
        >
            {children}
        </FavoritesContext.Provider>
    );
}

export function useFavorites() {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error("useFavorites must be used within FavoritesProvider");
    }
    return context;
}
