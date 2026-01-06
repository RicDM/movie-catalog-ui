import { Play, Star } from "lucide-react";
import { useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface MovieCardProps {
  title: string;
  genre: string;
  rating: number;
  year: number | string;
  image: string;
  onClick?: () => void;
}

export function MovieCard({ title, genre, rating, year, image, onClick }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative rounded-xl overflow-hidden cursor-pointer transition-all duration-500 hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Image Container */}
      <div className="aspect-[2/3] relative overflow-hidden">
        <ImageWithFallback
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

        {/* Play Button (shows on hover) */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="w-16 h-16 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary/50">
            <Play className="w-8 h-8 text-primary-foreground fill-current ml-1" />
          </div>
        </div>

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
          {/* Rating Badge */}
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md glass-strong">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <span className="text-xs text-foreground">{rating}</span>
            </div>
            <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md glass-strong">
              <span className="text-xs text-muted-foreground">{year}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-base font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors duration-300">
            {title}
          </h3>

          {/* Genre */}
          <p className="text-xs text-muted-foreground">{genre}</p>
        </div>
      </div>

      {/* Glow Effect on Hover */}
      <div className={`absolute inset-0 rounded-xl transition-all duration-500 ${isHovered ? 'shadow-xl shadow-primary/20' : ''}`} />
    </div>
  );
}
