'use client';

import { Calendar, ChevronLeft, ChevronRight, Clock, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import styled from 'styled-components';
import {
  getImageUrl,
  getMovieDetails,
  getUpcomingMovies,
  getYearFromDate
} from "../services/tmdb";
import { glassEffect } from "../styles/components";
import type { Movie, MovieDetails } from "../types/tmdb";
import { ImageWithFallback } from "./ImageWithFallback";
import { MovieDetailsModal } from "./MovieDetailsModal";

const Section = styled.section`
  padding: 4rem 1rem;
  position: relative;

  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    padding: 5rem 2rem;
  }
`;

const Container = styled.div`
  max-width: 1536px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;

  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    margin-bottom: 3rem;
  }
`;

const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    width: 1.5rem;
    height: 1.5rem;
    color: ${props => props.theme.colors.primary};
  }
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: ${props => props.theme.fontWeight.bold};
  color: ${props => props.theme.colors.foreground};

  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    font-size: 2.25rem;
  }
`;

const Subtitle = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.foregroundMuted};

  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    font-size: ${props => props.theme.fontSize.base};
  }
`;

const ScrollWrapper = styled.div`
  position: relative;
`;

const NavButton = styled.button<{ $direction: 'left' | 'right' }>`
  display: none;
  position: absolute;
  top: 50%;
  ${props => props.$direction === 'left' ? 'left: -1rem;' : 'right: -1rem;'}
  transform: translateY(-50%);
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  ${glassEffect}
  border: 1px solid ${props => props.theme.colors.border};
  background-color: ${props => props.theme.colors.background}cc;
  color: ${props => props.theme.colors.foreground};
  cursor: pointer;
  z-index: 10;
  transition: all ${props => props.theme.transitions.normal};
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primaryForeground};
    border-color: ${props => props.theme.colors.primary};
    box-shadow: ${props => props.theme.shadows.lg}, 0 0 20px ${props => props.theme.colors.primary}66;
    transform: translateY(-50%) scale(1.1);
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    
    &:hover {
      background-color: ${props => props.theme.colors.background}cc;
      color: ${props => props.theme.colors.foreground};
      border-color: ${props => props.theme.colors.border};
      box-shadow: none;
      transform: translateY(-50%) scale(1);
    }
  }

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }

  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    display: flex;
  }
`;

const ScrollContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  overflow-x: auto;
  padding-bottom: 1rem;
  scroll-snap-type: x mandatory;

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    gap: 1rem;
  }

  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    gap: 1.5rem;
  }

  &::-webkit-scrollbar {
    height: 0;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: transparent;
  }
`;

const MovieCard = styled.div`
  flex-shrink: 0;
  width: 16rem;
  scroll-snap-align: start;
  cursor: pointer;

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    width: 18rem;
  }

  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    width: 20rem;
  }
`;

const CardInner = styled.div`
  ${glassEffect}
  border-radius: ${props => props.theme.borderRadius['2xl']};
  overflow: hidden;
  transition: all ${props => props.theme.transitions.slow};

  &:hover {
    box-shadow: ${props => props.theme.shadows.xl}, 0 0 30px ${props => props.theme.colors.primary}33;
    transform: scale(1.02);
  }
`;

const CardContent = styled.div`
  display: flex;
  gap: 0.75rem;
  padding: 0.75rem;

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    gap: 1rem;
    padding: 1rem;
  }
`;

const PosterWrapper = styled.div`
  position: relative;
  width: 6rem;
  height: 8rem;
  flex-shrink: 0;
  border-radius: ${props => props.theme.borderRadius.lg};
  overflow: hidden;

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    width: 6rem;
    height: 9rem;
  }
`;

const PosterImage = styled(ImageWithFallback)`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform ${props => props.theme.transitions.slow};

  ${CardInner}:hover & {
    transform: scale(1.1);
  }
`;

const NewBadge = styled.div`
  position: absolute;
  top: 0.25rem;
  left: 0.25rem;
  padding: 0.125rem 0.5rem;
  border-radius: ${props => props.theme.borderRadius.md};
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.primaryForeground};
  font-size: 0.625rem;
  font-weight: ${props => props.theme.fontWeight.medium};

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    top: 0.5rem;
    left: 0.5rem;
    padding: 0.25rem 0.5rem;
    font-size: ${props => props.theme.fontSize.xs};
  }
`;

const InfoSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0.25rem 0;
`;

const InfoTop = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    gap: 0.5rem;
  }
`;

const MovieTitle = styled.h3`
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

  ${CardInner}:hover & {
    color: ${props => props.theme.colors.primary};
  }
`;

const Genres = styled.p`
  font-size: 0.625rem;
  color: ${props => props.theme.colors.foregroundMuted};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    font-size: ${props => props.theme.fontSize.xs};
  }
`;

const InfoBottom = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    gap: 0.5rem;
  }
`;

const RatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;

  svg {
    width: 0.625rem;
    height: 0.625rem;
    color: ${props => props.theme.colors.yellow};
    fill: ${props => props.theme.colors.yellow};

    @media (min-width: ${props => props.theme.breakpoints.md}) {
      width: 0.75rem;
      height: 0.75rem;
    }
  }

  span:first-of-type {
    font-size: 0.625rem;
    color: ${props => props.theme.colors.foreground};
    font-weight: ${props => props.theme.fontWeight.medium};

    @media (min-width: ${props => props.theme.breakpoints.md}) {
      font-size: ${props => props.theme.fontSize.xs};
    }
  }

  span:last-of-type {
    font-size: 0.625rem;
    color: ${props => props.theme.colors.foregroundMuted};
    margin-left: 0.25rem;

    @media (min-width: ${props => props.theme.breakpoints.md}) {
      font-size: ${props => props.theme.fontSize.xs};
    }
  }
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.625rem;
  color: ${props => props.theme.colors.foregroundMuted};

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    gap: 0.75rem;
    font-size: ${props => props.theme.fontSize.xs};
  }
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;

  svg {
    width: 0.625rem;
    height: 0.625rem;

    @media (min-width: ${props => props.theme.breakpoints.md}) {
      width: 0.75rem;
      height: 0.75rem;
    }
  }
`;

const ScrollFade = styled.div`
  display: none;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 1rem;
  width: 3rem;
  background: linear-gradient(to left, ${props => props.theme.colors.background}, transparent);
  pointer-events: none;

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    display: block;
    width: 4rem;
  }
`;

const LoadingCard = styled(MovieCard)`
  ${CardInner} {
    height: 9rem;
    background-color: ${props => props.theme.colors.accent};
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;

    @media (min-width: ${props => props.theme.breakpoints.md}) {
      height: 10rem;
    }
  }
`;

interface MovieWithDetails extends Movie {
  details?: MovieDetails;
}

export function NewReleases() {
  const [movies, setMovies] = useState<MovieWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    async function loadNewReleases() {
      try {
        setLoading(true);
        const upcoming = await getUpcomingMovies();

        const moviesWithDetails = await Promise.all(
          upcoming.slice(0, 8).map(async (movie) => {
            try {
              const details = await getMovieDetails(movie.id);
              return { ...movie, details };
            } catch {
              return movie;
            }
          })
        );

        setMovies(moviesWithDetails);
      } catch (error) {
        console.error("Erro ao carregar lançamentos:", error);
      } finally {
        setLoading(false);
      }
    }

    loadNewReleases();
  }, []);

  useEffect(() => {
    updateScrollButtons();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', updateScrollButtons);
      window.addEventListener('resize', updateScrollButtons);
      return () => {
        container.removeEventListener('scroll', updateScrollButtons);
        window.removeEventListener('resize', updateScrollButtons);
      };
    }
  }, [movies]);

  const formatRuntime = (minutes: number | null | undefined): string => {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

  const formatReleaseDate = (dateString: string): string => {
    if (!dateString) return "Em breve";
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString('pt-BR', { month: 'short' });
    return `${day} ${month}`;
  };

  if (loading) {
    return (
      <Section>
        <Container>
          <Header>
            <HeaderContent>
              <TitleRow>
                <Calendar />
                <Title>Lançamentos</Title>
              </TitleRow>
              <Subtitle>Estreias recentes que você não pode perder</Subtitle>
            </HeaderContent>
          </Header>
          <ScrollContainer>
            {[...Array(5)].map((_, i) => (
              <LoadingCard key={i}>
                <CardInner />
              </LoadingCard>
            ))}
          </ScrollContainer>
        </Container>
      </Section>
    );
  }

  return (
    <Section>
      <Container>
        <Header>
          <HeaderContent>
            <TitleRow>
              <Calendar />
              <Title>Lançamentos</Title>
            </TitleRow>
            <Subtitle>Estreias recentes que você não pode perder</Subtitle>
          </HeaderContent>
        </Header>

        <ScrollWrapper>
          <NavButton
            $direction="left"
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            aria-label="Rolar para esquerda"
          >
            <ChevronLeft />
          </NavButton>

          <ScrollContainer ref={scrollContainerRef}>
            {movies.map((movie) => (
              <MovieCard key={movie.id} onClick={() => setSelectedMovie(movie)}>
                <CardInner>
                  <CardContent>
                    <PosterWrapper>
                      <PosterImage
                        src={getImageUrl(movie.poster_path, "w200")}
                        alt={movie.title}
                      />
                      <NewBadge>NOVO</NewBadge>
                    </PosterWrapper>

                    <InfoSection>
                      <InfoTop>
                        <MovieTitle>{movie.title}</MovieTitle>
                        <Genres>
                          {movie.details?.genres.map(g => g.name).join(", ") || "Carregando..."}
                        </Genres>
                      </InfoTop>

                      <InfoBottom>
                        <RatingRow>
                          <Star />
                          <span>{movie.vote_average.toFixed(1)}</span>
                          <span>{getYearFromDate(movie.release_date)}</span>
                        </RatingRow>

                        <MetaRow>
                          <MetaItem>
                            <Clock />
                            <span>{formatRuntime(movie.details?.runtime)}</span>
                          </MetaItem>
                          <MetaItem>
                            <Calendar />
                            <span>{formatReleaseDate(movie.release_date)}</span>
                          </MetaItem>
                        </MetaRow>
                      </InfoBottom>
                    </InfoSection>
                  </CardContent>
                </CardInner>
              </MovieCard>
            ))}
          </ScrollContainer>

          <NavButton
            $direction="right"
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            aria-label="Rolar para direita"
          >
            <ChevronRight />
          </NavButton>

          <ScrollFade />
        </ScrollWrapper>
      </Container>

      {selectedMovie && (
        <MovieDetailsModal
          item={selectedMovie}
          isOpen={!!selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </Section>
  );
}
