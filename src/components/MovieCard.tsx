import styled from 'styled-components';
import { Heart, Play, Star } from "lucide-react";
import { useState } from "react";
import { useFavorites } from "../contexts/FavoritesContext";
import { getImageUrl } from "../services/tmdb";
import type { Movie, TVShow } from "../types/tmdb";
import { glassEffectStrong } from "../styles/components";

const CardContainer = styled.div`
  position: relative;
  border-radius: ${props => props.theme.borderRadius.xl};
  overflow: hidden;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.slow};

  &:hover {
    transform: scale(1.05);
    z-index: 10;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  aspect-ratio: 2/3;
  overflow: hidden;
  background: linear-gradient(to bottom right, #1f2937, #111827);
`;

const PosterImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  min-height: 300px;
  transition: transform ${props => props.theme.transitions.slow} ease;
  
  ${CardContainer}:hover & {
    transform: scale(1.1);
  }

  &[style*="display: none"] {
    display: none !important;
  }
`;

const GradientOverlay = styled.div<{ $isHovered: boolean }>`
  position: absolute;
  inset: 0;
  background: ${props => props.theme.gradients.overlay};
  opacity: ${props => props.$isHovered ? 0.8 : 0.6};
  transition: opacity ${props => props.theme.transitions.normal};
`;

const FavoriteBadge = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  padding: 0.375rem 0.5rem;
  border-radius: ${props => props.theme.borderRadius.full};
  background: ${props => props.theme.colors.red}E6;
  backdrop-filter: blur(10px);
  z-index: 10;

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    padding: 0.5rem;
  }

  svg {
    width: 0.75rem;
    height: 0.75rem;
    color: white;
    fill: currentColor;

    @media (min-width: ${props => props.theme.breakpoints.md}) {
      width: 1rem;
      height: 1rem;
    }
  }
`;

const PlayButtonOverlay = styled.div<{ $visible: boolean }>`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${props => props.$visible ? 1 : 0};
  transition: all ${props => props.theme.transitions.normal};
`;

const PlayButtonCircle = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: ${props => props.theme.borderRadius.full};
  background: ${props => props.theme.colors.primary}E6;
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${props => props.theme.shadows.lg}, ${props => props.theme.shadows.primary};
  transition: transform ${props => props.theme.transitions.normal};

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    width: 4rem;
    height: 4rem;
  }

  &:hover {
    transform: scale(1.1);
  }

  svg {
    width: 1.5rem;
    height: 1.5rem;
    color: ${props => props.theme.colors.primaryForeground};
    fill: currentColor;
    margin-left: 0.125rem;

    @media (min-width: ${props => props.theme.breakpoints.md}) {
      width: 2rem;
      height: 2rem;
      margin-left: 0.25rem;
    }
  }
`;

const ContentOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.75rem;

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    padding: 1rem;
  }
`;

const BadgesRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.375rem;

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }
`;

const SmallBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.125rem 0.375rem;
  border-radius: ${props => props.theme.borderRadius.md};
  ${glassEffectStrong}
  border: 1px solid ${props => props.theme.colors.glassBorder};

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    padding: 0.25rem 0.5rem;
  }

  svg {
    width: 0.625rem;
    height: 0.625rem;

    @media (min-width: ${props => props.theme.breakpoints.md}) {
      width: 0.75rem;
      height: 0.75rem;
    }
  }

  span {
    font-size: 0.625rem;
    font-weight: ${props => props.theme.fontWeight.medium};

    @media (min-width: ${props => props.theme.breakpoints.md}) {
      font-size: ${props => props.theme.fontSize.xs};
    }
  }
`;

const RatingBadge = styled(SmallBadge)`
  svg {
    color: ${props => props.theme.colors.yellow};
    fill: ${props => props.theme.colors.yellow};
  }

  span {
    color: ${props => props.theme.colors.foreground};
  }
`;

const FavoriteButton = styled.button<{ $isFavorite: boolean }>`
  ${glassEffectStrong}
  padding: 0.125rem 0.375rem;
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid ${props => props.theme.colors.glassBorder};
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  transition: background-color ${props => props.theme.transitions.fast};

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    padding: 0.25rem 0.5rem;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  svg {
    width: 0.625rem;
    height: 0.625rem;
    color: ${props => props.$isFavorite ? props.theme.colors.red : props.theme.colors.foreground};
    ${props => props.$isFavorite && 'fill: currentColor;'}

    @media (min-width: ${props => props.theme.breakpoints.md}) {
      width: 0.75rem;
      height: 0.75rem;
    }
  }
`;

const YearBadge = styled(SmallBadge)`
  span {
    color: ${props => props.theme.colors.foregroundMuted};
  }
`;

const Title = styled.h3`
  font-size: 0.875rem;
  font-weight: ${props => props.theme.fontWeight.semibold};
  color: ${props => props.theme.colors.foreground};
  line-height: 1.2;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color ${props => props.theme.transitions.normal};

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    font-size: ${props => props.theme.fontSize.base};
  }

  ${CardContainer}:hover & {
    color: ${props => props.theme.colors.primary};
  }
`;

const MediaType = styled.p`
  font-size: 0.625rem;
  color: ${props => props.theme.colors.foregroundMuted};

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    font-size: ${props => props.theme.fontSize.xs};
  }
`;

const GlowEffect = styled.div<{ $isHovered: boolean }>`
  position: absolute;
  inset: 0;
  border-radius: ${props => props.theme.borderRadius.xl};
  transition: all ${props => props.theme.transitions.slow};
  pointer-events: none;
  box-shadow: ${props => props.$isHovered ? `${props.theme.shadows.xl} ${props.theme.colors.primary}33` : 'none'};
`;

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
    <CardContainer
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onOpenDetails(item)}
    >
      <ImageContainer>
        <PosterImage
          src={getImageUrl(item.poster_path, "w500")}
          alt={title}
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />

        <GradientOverlay $isHovered={isHovered} />

        {isFavorite(item.id) && (
          <FavoriteBadge>
            <Heart />
          </FavoriteBadge>
        )}

        <PlayButtonOverlay $visible={isHovered}>
          <PlayButtonCircle>
            <Play />
          </PlayButtonCircle>
        </PlayButtonOverlay>

        <ContentOverlay>
          <BadgesRow>
            {item.vote_average > 0 && (
              <RatingBadge>
                <Star />
                <span>{item.vote_average.toFixed(1)}</span>
              </RatingBadge>
            )}

            <FavoriteButton
              onClick={handleFavoriteClick}
              $isFavorite={isFavorite(item.id)}
            >
              <Heart />
            </FavoriteButton>

            <YearBadge>
              <span>{year}</span>
            </YearBadge>
          </BadgesRow>

          <Title>{title}</Title>

          <MediaType>{isMovie(item) ? "Filme" : "Série"}</MediaType>
        </ContentOverlay>
      </ImageContainer>

      <GlowEffect $isHovered={isHovered} />
    </CardContainer>
  );
}
