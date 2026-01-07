'use client';

import { TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import styled from 'styled-components';
import { useGenres } from "../hooks/useGenres";
import { getPopularMovies } from "../services/tmdb";
import { glassEffect } from "../styles/components";
import type { Movie } from "../types/tmdb";
import { MovieCard } from "./MovieCard";
import { MovieDetailsModal } from "./MovieDetailsModal";

const Section = styled.section`
  padding: 4rem 1rem;
  position: relative;

  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    padding: 6rem 2rem;
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

const ViewAllButton = styled.button`
  display: none;
  padding: 0.5rem 1.5rem;
  border-radius: ${props => props.theme.borderRadius.full};
  ${glassEffect}
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.foreground};
  transition: all ${props => props.theme.transitions.normal};

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    display: block;
  }

  &:hover {
    border-color: ${props => props.theme.colors.primary}80;
    color: ${props => props.theme.colors.primary};
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;

  @media (min-width: ${props => props.theme.breakpoints.sm}) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
  }

  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    grid-template-columns: repeat(5, 1fr);
    gap: 1.5rem;
  }

  @media (min-width: ${props => props.theme.breakpoints.xl}) {
    grid-template-columns: repeat(6, 1fr);
  }
`;

const LoadingCard = styled.div`
  aspect-ratio: 2/3;
  background-color: ${props => props.theme.colors.accent};
  border-radius: ${props => props.theme.borderRadius.xl};
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
`;

const MobileViewAll = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    display: none;
  }

  button {
    width: 100%;
    max-width: 24rem;
    padding: 0.75rem 1.5rem;
    border-radius: ${props => props.theme.borderRadius.full};
    ${glassEffect}
    border: 1px solid ${props => props.theme.colors.border};
    color: ${props => props.theme.colors.foreground};
    transition: all ${props => props.theme.transitions.normal};

    &:hover {
      border-color: ${props => props.theme.colors.primary}80;
      color: ${props => props.theme.colors.primary};
    }
  }
`;

export function FeaturedMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const { getGenreNames, loading: genresLoading } = useGenres();

  useEffect(() => {
    async function loadMovies() {
      try {
        setLoading(true);
        const popularMovies = await getPopularMovies();
        setMovies(popularMovies.slice(0, 12));
      } catch (error) {
        console.error("Erro ao carregar filmes populares:", error);
      } finally {
        setLoading(false);
      }
    }

    loadMovies();
  }, []);

  if (loading || genresLoading) {
    return (
      <Section>
        <Container>
          <Header>
            <HeaderContent>
              <TitleRow>
                <TrendingUp />
                <Title>Em Alta Agora</Title>
              </TitleRow>
              <Subtitle>Os filmes mais populares do momento</Subtitle>
            </HeaderContent>
          </Header>
          <Grid>
            {[...Array(12)].map((_, i) => (
              <LoadingCard key={i} />
            ))}
          </Grid>
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
              <TrendingUp />
              <Title>Em Alta Agora</Title>
            </TitleRow>
            <Subtitle>Os filmes mais populares do momento</Subtitle>
          </HeaderContent>
          <ViewAllButton>Ver Todos</ViewAllButton>
        </Header>

        <Grid>
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              item={movie}
              onOpenDetails={(item) => setSelectedMovie(item as Movie)}
            />
          ))}
        </Grid>

        <MobileViewAll>
          <button>Ver Todos</button>
        </MobileViewAll>
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
