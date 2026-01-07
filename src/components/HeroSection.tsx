'use client';

import { Clock, Info, Play, Star } from "lucide-react";
import { useEffect, useState } from "react";
import styled from 'styled-components';
import {
  formatRuntime,
  getBackdropUrl,
  getMovieDetails,
  getMovieVideos,
  getTrailerKey,
  getTrendingMovies,
  getYearFromDate
} from "../services/tmdb";
import { glassEffect } from "../styles/components";
import type { Movie, MovieDetails } from "../types/tmdb";
import { ImageWithFallback } from "./ImageWithFallback";
import { MovieDetailsModal } from "./MovieDetailsModal";

const HeroContainer = styled.section`
  position: relative;
  height: 90vh;
  width: 100%;
  overflow: hidden;

  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    height: 100vh;
  }
`;

const LoadingContainer = styled(HeroContainer)`
  background-color: ${props => props.theme.colors.background};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoadingText = styled.div`
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  color: ${props => props.theme.colors.foregroundMuted};
`;

const BackgroundWrapper = styled.div`
  position: absolute;
  inset: 0;
`;

const BackgroundImage = styled(ImageWithFallback)`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const GradientOverlay = styled.div<{ $direction: 'vertical' | 'horizontal' }>`
  position: absolute;
  inset: 0;
  background: ${props => props.$direction === 'vertical'
    ? props.theme.gradients.dark
    : props.theme.gradients.darkHorizontal};
`;

const ContentWrapper = styled.div`
  position: relative;
  max-width: 1536px;
  margin: 0 auto;
  padding: 0 1rem;
  height: 100%;
  display: flex;
  align-items: center;

  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    padding: 0 2rem;
  }
`;

const Content = styled.div`
  max-width: 42rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-top: 4rem;

  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    padding-top: 0;
  }
`;

const FeaturedBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.full};
  ${glassEffect}
  border: 1px solid ${props => props.theme.colors.primary}4D;
  width: fit-content;

  svg {
    width: 1rem;
    height: 1rem;
    color: ${props => props.theme.colors.yellow};
    fill: ${props => props.theme.colors.yellow};
  }

  span {
    font-size: ${props => props.theme.fontSize.sm};
    color: ${props => props.theme.colors.foreground};
  }
`;

const Title = styled.h1`
  font-size: 2.25rem;
  font-weight: ${props => props.theme.fontWeight.bold};
  line-height: 1.1;

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    font-size: 3rem;
  }

  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    font-size: 4.5rem;
  }

  span {
    background: linear-gradient(to right, ${props => props.theme.colors.foreground}, ${props => props.theme.colors.foreground}, ${props => props.theme.colors.primary});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const Description = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.foregroundMuted};
  line-height: 1.6;
  max-width: 36rem;

  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    font-size: ${props => props.theme.fontSize.lg};
  }
`;

const InfoContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  font-size: ${props => props.theme.fontSize.sm};
  color: ${props => props.theme.colors.foregroundMuted};
`;

const InfoBadge = styled.div<{ $highlighted?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: 0.25rem 0.75rem;
  border-radius: ${props => props.theme.borderRadius.full};
  ${glassEffect}
  ${props => props.$highlighted && `
    border: 1px solid ${props.theme.colors.primary}4D;
  `}

  svg {
    width: 1rem;
    height: 1rem;
  }

  span {
    ${props => props.$highlighted && `
      color: ${props.theme.colors.foreground};
    `}
  }
`;

const RatingBadge = styled(InfoBadge)`
  svg {
    color: ${props => props.theme.colors.yellow};
    fill: ${props => props.theme.colors.yellow};
  }

  span {
    color: ${props => props.theme.colors.foreground};
  }
`;

const ActionButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  padding-top: 1rem;
`;

const PlayButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: 0.75rem 2rem;
  border-radius: ${props => props.theme.borderRadius.full};
  background: ${props => props.theme.gradients.primary};
  color: ${props => props.theme.colors.primaryForeground};
  transition: all ${props => props.theme.transitions.normal};

  &:hover:not(:disabled) {
    box-shadow: ${props => props.theme.shadows.xl}, ${props => props.theme.shadows.primaryStrong};
    transform: scale(1.05);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
    fill: currentColor;
  }
`;

const DetailsButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: 0.75rem 2rem;
  border-radius: ${props => props.theme.borderRadius.full};
  ${glassEffect}
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.foreground};
  transition: all ${props => props.theme.transitions.normal};

  &:hover {
    border-color: ${props => props.theme.colors.primary}80;
    background: ${props => props.theme.colors.accent};
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

const BottomFade = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 8rem;
  background: ${props => props.theme.gradients.darkReverse};
`;

export function HeroSection() {
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);

  useEffect(() => {
    async function loadFeaturedMovie() {
      try {
        setLoading(true);
        const movies = await getTrendingMovies("week");
        if (movies.length > 0) {
          const movie = movies[0];
          setFeaturedMovie(movie);

          // Buscar detalhes e vídeos
          const [details, videos] = await Promise.all([
            getMovieDetails(movie.id),
            getMovieVideos(movie.id)
          ]);
          setMovieDetails(details);

          // Buscar trailer
          const trailer = getTrailerKey(videos);
          setTrailerKey(trailer);
        }
      } catch (error) {
        console.error("Erro ao carregar filme em destaque:", error);
      } finally {
        setLoading(false);
      }
    }

    loadFeaturedMovie();
  }, []);

  if (loading || !featuredMovie) {
    return (
      <LoadingContainer>
        <LoadingText>Carregando...</LoadingText>
      </LoadingContainer>
    );
  }

  const backdropUrl = getBackdropUrl(featuredMovie.backdrop_path);
  const year = getYearFromDate(featuredMovie.release_date);
  const genres = movieDetails?.genres.map(g => g.name).join(", ") || "Carregando...";
  const runtime = movieDetails ? formatRuntime(movieDetails.runtime) : "...";

  const handleWatchTrailer = () => {
    if (trailerKey) {
      window.open(`https://www.youtube.com/watch?v=${trailerKey}`, '_blank');
    }
  };

  return (
    <HeroContainer>
      <BackgroundWrapper>
        <BackgroundImage
          src={backdropUrl}
          alt={featuredMovie.title}
        />
        <GradientOverlay $direction="vertical" />
        <GradientOverlay $direction="horizontal" />
      </BackgroundWrapper>

      <ContentWrapper>
        <Content>
          <FeaturedBadge>
            <Star />
            <span>Em Destaque</span>
          </FeaturedBadge>

          <Title>
            <span>{featuredMovie.title}</span>
          </Title>

          <Description>
            {featuredMovie.overview || "Descrição não disponível."}
          </Description>

          <InfoContainer>
            <InfoBadge>
              <span>{year}</span>
            </InfoBadge>
            <InfoBadge>
              <span>{genres}</span>
            </InfoBadge>
            <InfoBadge>
              <Clock />
              <span>{runtime}</span>
            </InfoBadge>
            <RatingBadge $highlighted>
              <Star />
              <span>{featuredMovie.vote_average.toFixed(1)}</span>
            </RatingBadge>
          </InfoContainer>

          <ActionButtons>
            <PlayButton onClick={handleWatchTrailer} disabled={!trailerKey}>
              <Play />
              <span>Assistir Trailer</span>
            </PlayButton>
            <DetailsButton onClick={() => setShowDetailsModal(true)}>
              <Info />
              <span>Ver Detalhes</span>
            </DetailsButton>
          </ActionButtons>
        </Content>
      </ContentWrapper>

      <BottomFade />

      {showDetailsModal && featuredMovie && (
        <MovieDetailsModal
          item={featuredMovie}
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
        />
      )}
    </HeroContainer>
  );
}
