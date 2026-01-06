import { Heart, Play, Star } from "lucide-react";
import { useState } from "react";
import { useFavorites } from "../contexts/FavoritesContext";
import { getImageUrl } from "../services/tmdb";
import type { Movie, TVShow } from "../types/tmdb";

interface MovieCardProps {
  item: Movie | TVShow;
  onOpenDetails: (item: Movie | TVShow) => void;
}

function isMovie(item: Movie | TVShow): item is Movie {
  return "title" in item;
}

export function MovieCard({ item, onOpenDetails }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();
  const title = isMovie(item) ? item.title : item.name;
  const releaseDate = isMovie(item) ? item.release_date : item.first_air_date;
  const year = releaseDate?.split("-")[0] || "N/A";

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const mediaType = isMovie(item) ? "movie" : "tv";
    toggleFavorite(item, mediaType);
  };

  return (
    <div
      className="group relative rounded-xl overflow-hidden cursor-pointer transition-all duration-500 hover:scale-105 hover:z-10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onOpenDetails(item)}
    >
      {/* Image Container */}
      <div className="aspect-[2/3] relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
        <img
          src={getImageUrl(item.poster_path, "w500")}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          style={{ minHeight: '300px' }}
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

        {/* Favorite Badge - Top Right */}
        {isFavorite(item.id) && (
          <div className="absolute top-2 right-2 p-1.5 md:p-2 rounded-full bg-red-500/90 backdrop-blur-md z-10">
            <Heart className="w-3 h-3 md:w-4 md:h-4 text-white fill-current" />
          </div>
        )}

        {/* Play Button (shows on hover) */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary/50">
            <Play className="w-6 h-6 md:w-8 md:h-8 text-primary-foreground fill-current ml-0.5 md:ml-1" />
          </div>
        </div>

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 space-y-1.5 md:space-y-2">
          {/* Rating and Favorite Button */}
          <div className="flex items-center gap-1.5 md:gap-2">
            {/* Rating Badge */}
            {item.vote_average > 0 && (
              <div className="inline-flex items-center gap-1 px-1.5 md:px-2 py-0.5 md:py-1 rounded-md glass-strong">
                <Star className="w-2.5 h-2.5 md:w-3 md:h-3 text-yellow-400 fill-yellow-400" />
                <span className="text-[10px] md:text-xs text-foreground font-medium">{item.vote_average.toFixed(1)}</span>
              </div>
            )}

            {/* Favorite Button */}
            <button
              onClick={handleFavoriteClick}
              className="inline-flex items-center gap-1 px-1.5 md:px-2 py-0.5 md:py-1 rounded-md glass-strong hover:bg-white/20 transition-colors"
            >
              <Heart
                className={`w-2.5 h-2.5 md:w-3 md:h-3 ${isFavorite(item.id) ? "text-red-500 fill-current" : "text-foreground"
                  }`}
              />
            </button>

            {/* Year Badge */}
            <div className="inline-flex items-center gap-1 px-1.5 md:px-2 py-0.5 md:py-1 rounded-md glass-strong">
              <span className="text-[10px] md:text-xs text-muted-foreground">{year}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-sm md:text-base font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors duration-300 leading-tight">
            {title}
          </h3>

          {/* Type */}
          <p className="text-[10px] md:text-xs text-muted-foreground">{isMovie(item) ? "Filme" : "Série"}</p>
        </div>
      </div>

      {/* Glow Effect on Hover */}
      <div className={`absolute inset-0 rounded-xl transition-all duration-500 pointer-events-none ${isHovered ? 'shadow-xl shadow-primary/20' : ''}`} />
    </div>
  );
}
