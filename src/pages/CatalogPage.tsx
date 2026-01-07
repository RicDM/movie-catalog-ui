import styled from 'styled-components';
import { Film, Tv, TrendingUp, FilmIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Filters } from "../components/Filters";
import { MovieCard } from "../components/MovieCard";
import { MovieDetailsModal } from "../components/MovieDetailsModal";
import { Pagination } from "../components/Pagination";
import { useGenres } from "../hooks/useGenres";
import {
    discoverMoviesAdvanced,
    discoverTVShowsAdvanced,
    getPopularMovies,
    getPopularTVShows
} from "../services/tmdb";
import type { Movie, TVShow } from "../types/tmdb";
import { glassEffect } from "../styles/components";

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: ${props => props.theme.colors.background};
  padding-top: 6rem;
  padding-bottom: 4rem;
`;

const Container = styled.div`
  max-width: 1536px;
  margin: 0 auto;
  padding: 0 1rem;

  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    padding: 0 2rem;
  }
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const HeaderRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 0.5rem;

  @media (min-width: ${props => props.theme.breakpoints.sm}) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const TitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;

  svg {
    width: 2rem;
    height: 2rem;
    color: ${props => props.theme.colors.primary};
  }
`;

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: ${props => props.theme.fontWeight.bold};
  color: ${props => props.theme.colors.foreground};

  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    font-size: 2.25rem;
  }
`;

const ToggleContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 0.25rem;
  border-radius: ${props => props.theme.borderRadius.full};
  ${glassEffect}
  border: 1px solid ${props => props.theme.colors.border};
`;

const ToggleButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: ${props => props.theme.borderRadius.full};
  transition: all ${props => props.theme.transitions.slow};

  svg {
    width: 1rem;
    height: 1rem;
  }

  span {
    display: none;

    @media (min-width: ${props => props.theme.breakpoints.sm}) {
      display: inline;
    }
  }

  ${props => props.$active ? `
    background-color: ${props.theme.colors.primary};
    color: ${props.theme.colors.primaryForeground};
    box-shadow: ${props.theme.shadows.lg};
  ` : `
    color: ${props.theme.colors.foregroundMuted};

    &:hover {
      color: ${props.theme.colors.foreground};
    }
  `}
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.foregroundMuted};
  font-size: ${props => props.theme.fontSize.sm};
`;

const ResultsCount = styled.div`
  margin-bottom: 1.5rem;
  font-size: ${props => props.theme.fontSize.sm};
  color: ${props => props.theme.colors.foregroundMuted};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin-bottom: 2rem;

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

const EmptyState = styled.div`
  text-align: center;
  padding: 5rem 0;

  svg {
    width: 4rem;
    height: 4rem;
    color: ${props => props.theme.colors.foregroundMuted};
    margin: 0 auto 1rem;
    opacity: 0.5;
  }

  h3 {
    font-size: ${props => props.theme.fontSize.xl};
    font-weight: ${props => props.theme.fontWeight.semibold};
    color: ${props => props.theme.colors.foreground};
    margin-bottom: 0.5rem;
  }

  p {
    color: ${props => props.theme.colors.foregroundMuted};
  }
`;

const ITEMS_PER_PAGE = 24;

type MediaType = "movie" | "tv";

export function CatalogPage() {
    const [mediaType, setMediaType] = useState<MediaType>("movie");
    const [allMovies, setAllMovies] = useState<Movie[]>([]);
    const [allTVShows, setAllTVShows] = useState<TVShow[]>([]);
    const [displayedMovies, setDisplayedMovies] = useState<Movie[]>([]);
    const [displayedTVShows, setDisplayedTVShows] = useState<TVShow[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedMovie, setSelectedMovie] = useState<Movie | TVShow | null>(null);

    const { movieGenres, tvGenres, getGenreNames, loading: genresLoading } = useGenres();

    const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
    const [sortBy, setSortBy] = useState("popularity.desc");
    const [yearFrom, setYearFrom] = useState("");
    const [yearTo, setYearTo] = useState("");
    const [ratingMin, setRatingMin] = useState(0);

    useEffect(() => {
        async function loadContent() {
            try {
                setLoading(true);
                setCurrentPage(1);

                const hasFilters =
                    selectedGenres.length > 0 ||
                    yearFrom ||
                    yearTo ||
                    ratingMin > 0 ||
                    sortBy !== "popularity.desc";

                if (mediaType === "movie") {
                    let results: Movie[] = [];

                    if (hasFilters) {
                        const { results: filteredMovies } = await discoverMoviesAdvanced({
                            genres: selectedGenres,
                            sortBy,
                            yearFrom,
                            yearTo,
                            ratingMin,
                        }, 5);

                        results = filteredMovies;
                    } else {
                        const promises = [];
                        for (let i = 1; i <= 5; i++) {
                            promises.push(getPopularMovies(i));
                        }
                        const pages = await Promise.all(promises);
                        results = pages.flat();
                    }

                    setAllMovies(results);
                    setTotalPages(Math.ceil(results.length / ITEMS_PER_PAGE));
                } else {
                    let results: TVShow[] = [];

                    if (hasFilters) {
                        const { results: filteredTVShows } = await discoverTVShowsAdvanced({
                            genres: selectedGenres,
                            sortBy,
                            yearFrom,
                            yearTo,
                            ratingMin,
                        }, 5);

                        results = filteredTVShows;
                    } else {
                        const promises = [];
                        for (let i = 1; i <= 5; i++) {
                            promises.push(getPopularTVShows(i));
                        }
                        const pages = await Promise.all(promises);
                        results = pages.flat();
                    }

                    setAllTVShows(results);
                    setTotalPages(Math.ceil(results.length / ITEMS_PER_PAGE));
                }
            } catch (error) {
                console.error(`Erro ao carregar ${mediaType === "movie" ? "filmes" : "séries"}:`, error);
            } finally {
                setLoading(false);
            }
        }

        if (!genresLoading) {
            loadContent();
        }
    }, [mediaType, selectedGenres, sortBy, yearFrom, yearTo, ratingMin, genresLoading]);

    useEffect(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        
        if (mediaType === "movie") {
            setDisplayedMovies(allMovies.slice(startIndex, endIndex));
        } else {
            setDisplayedTVShows(allTVShows.slice(startIndex, endIndex));
        }
    }, [currentPage, allMovies, allTVShows, mediaType]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const currentGenres = mediaType === "movie" ? movieGenres : tvGenres;
    const displayedItems = mediaType === "movie" ? displayedMovies : displayedTVShows;
    const allItems = mediaType === "movie" ? allMovies : allTVShows;

    return (
        <PageContainer>
            <Container>
                <Header>
                    <HeaderRow>
                        <TitleSection>
                            {mediaType === "movie" ? <Film /> : <Tv />}
                            <Title>
                                {mediaType === "movie" ? "Catálogo de Filmes" : "Catálogo de Séries"}
                            </Title>
                        </TitleSection>
                        
                        <ToggleContainer>
                            <ToggleButton
                                onClick={() => {
                                    setMediaType("movie");
                                    setSelectedGenres([]);
                                    setCurrentPage(1);
                                }}
                                $active={mediaType === "movie"}
                            >
                                <Film />
                                <span>Filmes</span>
                            </ToggleButton>
                            <ToggleButton
                                onClick={() => {
                                    setMediaType("tv");
                                    setSelectedGenres([]);
                                    setCurrentPage(1);
                                }}
                                $active={mediaType === "tv"}
                            >
                                <Tv />
                                <span>Séries</span>
                            </ToggleButton>
                        </ToggleContainer>
                    </HeaderRow>
                    <Subtitle>
                        {mediaType === "movie" 
                            ? "Explore nossa coleção completa de filmes"
                            : "Explore nossa coleção completa de séries"
                        }
                    </Subtitle>
                </Header>

                {!genresLoading && (
                    <Filters
                        genres={currentGenres}
                        selectedGenres={selectedGenres}
                        onGenreChange={setSelectedGenres}
                        sortBy={sortBy}
                        onSortChange={setSortBy}
                        yearFrom={yearFrom}
                        yearTo={yearTo}
                        onYearChange={(from, to) => {
                            setYearFrom(from);
                            setYearTo(to);
                        }}
                        ratingMin={ratingMin}
                        onRatingChange={setRatingMin}
                    />
                )}

                {!loading && (
                    <ResultsCount>
                        Mostrando {displayedItems.length} de {allItems.length} resultados
                    </ResultsCount>
                )}

                {loading && (
                    <Grid>
                        {[...Array(24)].map((_, i) => (
                            <LoadingCard key={i} />
                        ))}
                    </Grid>
                )}

                {!loading && displayedItems.length > 0 && (
                    <>
                        <Grid>
                            {displayedItems.map((item) => (
                                <MovieCard
                                    key={item.id}
                                    item={item}
                                    onOpenDetails={setSelectedMovie}
                                />
                            ))}
                        </Grid>

                        {totalPages > 1 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        )}
                    </>
                )}

                {!loading && displayedItems.length === 0 && (
                    <EmptyState>
                        <TrendingUp />
                        <h3>Nenhum resultado encontrado</h3>
                        <p>Tente ajustar os filtros para ver mais opções</p>
                    </EmptyState>
                )}
            </Container>

            {selectedMovie && (
                <MovieDetailsModal
                    item={selectedMovie}
                    isOpen={!!selectedMovie}
                    onClose={() => setSelectedMovie(null)}
                />
            )}
        </PageContainer>
    );
}
