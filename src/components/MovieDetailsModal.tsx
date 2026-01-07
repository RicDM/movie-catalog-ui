'use client';

import { Bookmark, Calendar, ChevronLeft, ChevronRight, Clock, Heart, Play, Share2, Star, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import styled from 'styled-components';
import { useFavorites } from "../contexts/FavoritesContext";
import {
  formatRuntime,
  getBackdropUrl,
  getMovieCredits,
  getMovieDetails,
  getMovieVideos,
  getProfileUrl,
  getTrailerKey,
  getTVShowCredits,
  getTVShowDetails,
  getTVShowVideos,
  getYearFromDate
} from "../services/tmdb";
import { glassEffect, glassEffectStrong } from "../styles/components";
import type { Cast, Crew, Movie, MovieDetails, TVShow, TVShowDetails, VideosResponse } from "../types/tmdb";
import { ImageWithFallback } from "./ImageWithFallback";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: ${props => props.theme.zIndex.modal};
  ${glassEffectStrong}
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 0.5rem;

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    padding: 1rem;
  }
`;

const LoadingOverlay = styled(Overlay)`
  background-color: rgba(0, 0, 0, 0.8);
`;

const LoadingText = styled.div`
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  color: white;
  font-size: ${props => props.theme.fontSize.xl};
`;

const ModalContainer = styled.div`
  width: 100%;
  height: 100%;
  max-width: 100rem;
  max-height: 95vh;
  overflow: hidden;
`;

const ModalContent = styled.div`
  position: relative;
  background-color: ${props => props.theme.colors.background}CCCC;
  border-radius: 1rem;
  box-shadow: ${props => props.theme.shadows.xl};
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border: 1px solid ${props => props.theme.colors.border}9D;
  padding: 1rem;

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    border-radius: 1.5rem;
    flex-direction: row;
    gap: 1.5rem;
    padding: 1.5rem;
  }

  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    padding: 2rem;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  z-index: 50;
  padding: 0.5rem;
  border-radius: ${props => props.theme.borderRadius.full};
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  transition: background-color ${props => props.theme.transitions.fast};
  box-shadow: ${props => props.theme.shadows.lg};

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    top: 1rem;
    right: 1rem;
  }

  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;

    @media (min-width: ${props => props.theme.breakpoints.md}) {
      width: 1.5rem;
      height: 1.5rem;
    }
  }
`;

const VideoSection = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  max-height: 40vh;

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    flex: 1;
    min-height: 300px;
    max-height: none;
  }

  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    min-height: 400px;
  }
`;

const VideoWrapper = styled.div`
  position: relative;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.xl};
  border: 1px solid ${props => props.theme.colors.border}33;

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    border-radius: 1rem;
    width: 100%;
  }
`;

const TrailerIframe = styled.iframe`
  width: 100%;
  min-height: 200px;
  aspect-ratio: 16 / 9;
  border: none;
  border-radius: 0.75rem;

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    min-height: 300px;
    border-radius: 1rem;
  }

  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    min-height: 400px;
  }
`;

const BackdropImage = styled(ImageWithFallback)`
  width: 100%;
  height: 50%;
  object-fit: cover;
  border-radius: 0.75rem;
  min-height: 200px;

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    border-radius: 1rem;
  }
`;

const BackdropOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: ${props => props.theme.gradients.overlay};
`;

const PlayButton = styled.button`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PlayButtonCircle = styled.div`
  width: 4rem;
  height: 4rem;
  border-radius: ${props => props.theme.borderRadius.full};
  background-color: ${props => props.theme.colors.primary}E6;
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform ${props => props.theme.transitions.normal};
  box-shadow: ${props => props.theme.shadows.xl}, 0 0 40px ${props => props.theme.colors.primary}80;

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    width: 5rem;
    height: 5rem;
  }

  ${PlayButton}:hover & {
    transform: scale(1.1);
  }

  svg {
    width: 2rem;
    height: 2rem;
    color: white;
    fill: currentColor;
    margin-left: 0.25rem;

    @media (min-width: ${props => props.theme.breakpoints.md}) {
      width: 2.5rem;
      height: 2.5rem;
    }
  }
`;

const InfoCard = styled.div`
  flex: 1;
  width: 100%;
  ${glassEffectStrong}
  border-radius: 0.75rem;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  box-shadow: ${props => props.theme.shadows.xl};
  border: 1px solid ${props => props.theme.colors.border}33;
  overflow-y: auto;
  max-height: 50vh;

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    width: 400px;
    border-radius: 1rem;
    padding: 1.5rem;
    max-height: none;
  }

  @media (min-width: ${props => props.theme.breakpoints.xl}) {
    width: 450px;
  }

  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    max-height: none;
  }
`;

const TitleSection = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const TitleContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const Title = styled.h1`
  font-size: 1.25rem;
  font-weight: ${props => props.theme.fontWeight.bold};
  color: ${props => props.theme.colors.foreground};
  margin-bottom: 0.25rem;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }

  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    font-size: 1.875rem;
  }
`;

const Tagline = styled.p`
  font-size: ${props => props.theme.fontSize.xs};
  color: ${props => props.theme.colors.foregroundMuted};
  font-style: italic;
  margin-bottom: 0.25rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    font-size: ${props => props.theme.fontSize.sm};
  }
`;

const ActionsRow = styled.div`
  display: flex;
  gap: 0.25rem;
  flex-shrink: 0;

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    gap: 0.5rem;
  }
`;

const ActionButton = styled.button<{ $isFavorite?: boolean }>`
  padding: 1rem;
  border-radius: ${props => props.theme.borderRadius.full};
  ${glassEffectStrong}
  border: 1px solid ${props => props.$isFavorite ? props.theme.colors.red : props.theme.colors.border};
  color: ${props => props.$isFavorite ? props.theme.colors.red : props.theme.colors.foregroundMuted};
  background-color: ${props => props.$isFavorite ? `${props.theme.colors.red}1A` : `${props.theme.colors.background}99`};
  transition: all ${props => props.theme.transitions.normal};

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    padding: 0.75rem;
  }

  &:hover {
    color: ${props => props.$isFavorite ? props.theme.colors.red : props.theme.colors.foreground};
  }

  svg {
    width: 1rem;
    height: 1rem;
    ${props => props.$isFavorite && 'fill: currentColor;'}

    @media (min-width: ${props => props.theme.breakpoints.md}) {
      width: 1.25rem;
      height: 1.25rem;
    }
  }
`;

const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem;

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    margin-bottom: 1rem;
  }
`;

const MetaBadge = styled.div<{ $highlighted?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.625rem;
  border-radius: ${props => props.theme.borderRadius.full};
  ${glassEffectStrong}
  background-color: ${props => props.theme.colors.background}99;
  ${props => props.$highlighted && `
    border: 1px solid ${props.theme.colors.primary}4D;
  `}

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    padding: 0.375rem 0.75rem;
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;

    @media (min-width: ${props => props.theme.breakpoints.md}) {
      width: 1rem;
      height: 1rem;
    }
  }

  span {
    color: ${props => props.theme.colors.foreground};
    font-size: 0.875rem;

    @media (min-width: ${props => props.theme.breakpoints.md}) {
      font-size: ${props => props.theme.fontSize.sm};
    }
  }
`;

const RatingBadge = styled(MetaBadge)`
  svg {
    color: ${props => props.theme.colors.yellow};
    fill: ${props => props.theme.colors.yellow};
  }

  span {
    font-weight: ${props => props.theme.fontWeight.semibold};
  }
`;

const GenreRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-bottom: 0.75rem;

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
`;

const GenreBadge = styled.span`
  padding: 0.125rem 0.625rem;
  border-radius: ${props => props.theme.borderRadius.full};
  background-color: ${props => props.theme.colors.primary}1A;
  color: ${props => props.theme.colors.primary};
  font-size: ${props => props.theme.fontSize.xs};
  font-weight: ${props => props.theme.fontWeight.medium};

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    padding: 0.25rem 0.75rem;
  }
`;

const Section = styled.div`
  margin-bottom: 0.75rem;

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    margin-bottom: 1rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: ${props => props.theme.fontSize.base};
  font-weight: ${props => props.theme.fontWeight.semibold};
  color: ${props => props.theme.colors.foreground};
  margin-bottom: 0.25rem;

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    font-size: ${props => props.theme.fontSize.lg};
    margin-bottom: 0.5rem;
  }
`;

const Overview = styled.p`
  color: ${props => props.theme.colors.foregroundMuted};
  font-size: 0.875rem;
  line-height: 1.6;

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    font-size: ${props => props.theme.fontSize.sm};
  }
`;

const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.875rem;

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    font-size: ${props => props.theme.fontSize.sm};
  }
`;

const InfoItem = styled.div`
  span:first-child {
    color: ${props => props.theme.colors.foregroundMuted};
  }

  span:last-child {
    color: ${props => props.theme.colors.foreground};
  }
`;

const ProductionList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const ProductionCompany = styled.span`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.foregroundMuted};
  font-weight: ${props => props.theme.fontWeight.medium};
`;

const CastSection = styled.div`
  position: relative;
  margin-bottom: 0.75rem;

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    margin-bottom: 1rem;
  }
`;

const CastScrollWrapper = styled.div`
  position: relative;
`;

const CastNavButton = styled.button<{ $direction: 'left' | 'right' }>`
  display: none;
  position: absolute;
  top: 50%;
  ${props => props.$direction === 'left' ? 'left: -0.75rem;' : 'right: -0.75rem;'}
  transform: translateY(-50%);
  width: 2rem;
  height: 2rem;
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
    box-shadow: ${props => props.theme.shadows.lg};
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
    width: 1rem;
    height: 1rem;
  }

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    display: flex;
  }
`;

const CastScrollContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.accent};
    border-radius: ${props => props.theme.borderRadius.full};
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.primary};
    border-radius: ${props => props.theme.borderRadius.full};
  }
`;

const CastCard = styled.div`
  flex-shrink: 0;
  width: 6rem;
  text-align: center;

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    width: 7rem;
  }
`;

const CastPhoto = styled.div`
  position: relative;
  width: 6rem;
  height: 6rem;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 0.5rem;
  ${glassEffect}
  border: 2px solid ${props => props.theme.colors.border};

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    width: 7rem;
    height: 7rem;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const CastName = styled.p`
  font-size: 0.75rem;
  font-weight: ${props => props.theme.fontWeight.semibold};
  color: ${props => props.theme.colors.foreground};
  margin-bottom: 0.125rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    font-size: ${props => props.theme.fontSize.xs};
  }
`;

const CastCharacter = styled.p`
  font-size: 0.625rem;
  color: ${props => props.theme.colors.foregroundMuted};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    font-size: 0.75rem;
  }
`;

function isMovie(item: Movie | TVShow): item is Movie {
  return "title" in item;
}

interface MovieDetailsModalProps {
  item: Movie | TVShow;
  isOpen: boolean;
  onClose: () => void;
}

export function MovieDetailsModal({ item, isOpen, onClose }: MovieDetailsModalProps) {
  const [details, setDetails] = useState<MovieDetails | TVShowDetails | null>(null);
  const [videos, setVideos] = useState<VideosResponse | null>(null);
  const [cast, setCast] = useState<Cast[]>([]);
  const [director, setDirector] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const castScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollCastLeft, setCanScrollCastLeft] = useState(false);
  const [canScrollCastRight, setCanScrollCastRight] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();

  const mediaType = isMovie(item) ? "movie" : "tv";
  const id = item.id;

  const updateCastScrollButtons = () => {
    if (castScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = castScrollRef.current;
      setCanScrollCastLeft(scrollLeft > 0);
      setCanScrollCastRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scrollCast = (direction: 'left' | 'right') => {
    if (castScrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      castScrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    async function loadDetails() {
      try {
        setLoading(true);
        const [detailsData, videosData, creditsData] = await Promise.all([
          mediaType === "movie" ? getMovieDetails(id) : getTVShowDetails(id),
          mediaType === "movie" ? getMovieVideos(id) : getTVShowVideos(id),
          mediaType === "movie" ? getMovieCredits(id) : getTVShowCredits(id),
        ]);
        setDetails(detailsData);
        setVideos(videosData);

        // Buscar diretor (apenas para filmes)
        if (mediaType === "movie") {
          const directorData = creditsData.crew.find((member: Crew) => member.job === "Director");
          setDirector(directorData?.name || null);
        } else {
          // Para séries, usar o creator
          const tvDetails = detailsData as TVShowDetails;
          setDirector(tvDetails.created_by?.[0]?.name || null);
        }
        setCast(creditsData.cast.slice(0, 15));
      } catch (error) {
        console.error("Erro ao carregar detalhes:", error);
      } finally {
        setLoading(false);
      }
    }

    if (isOpen) {
      loadDetails();
    }
  }, [id, mediaType, isOpen]);

  useEffect(() => {
    updateCastScrollButtons();
    const container = castScrollRef.current;
    if (container) {
      container.addEventListener('scroll', updateCastScrollButtons);
      window.addEventListener('resize', updateCastScrollButtons);
      return () => {
        container.removeEventListener('scroll', updateCastScrollButtons);
        window.removeEventListener('resize', updateCastScrollButtons);
      };
    }
  }, [cast]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  if (loading || !details) {
    return (
      <LoadingOverlay>
        <LoadingText>Carregando...</LoadingText>
      </LoadingOverlay>
    );
  }

  const isMovieType = "title" in details;
  const title = isMovieType ? details.title : details.name;
  const releaseDate = isMovieType ? details.release_date : details.first_air_date;
  const runtime = isMovieType ? formatRuntime(details.runtime) : `${details.number_of_seasons} temporadas`;
  const trailerKey = videos ? getTrailerKey(videos) : null;

  return (
    <Overlay>
      <ModalContainer>
        <ModalContent>
          <CloseButton onClick={onClose} aria-label="Fechar">
            <X />
          </CloseButton>

          <VideoSection>
            <VideoWrapper>
              {showTrailer && trailerKey ? (
                <TrailerIframe
                  src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; autoplay"
                  allowFullScreen
                />
              ) : (
                <>
                  <BackdropImage
                    src={getBackdropUrl(details.backdrop_path, "w1280")}
                    alt={title}
                  />
                  <BackdropOverlay />

                  {trailerKey && (
                    <PlayButton
                      onClick={() => setShowTrailer(true)}
                      aria-label="Assistir trailer"
                    >
                      <PlayButtonCircle>
                        <Play />
                      </PlayButtonCircle>
                    </PlayButton>
                  )}
                </>
              )}
            </VideoWrapper>
          </VideoSection>

          <InfoCard>
            <TitleSection>
              <TitleContent>
                <Title>{title}</Title>
                {details.tagline && (
                  <Tagline>"{details.tagline}"</Tagline>
                )}
              </TitleContent>

              <ActionsRow>
                <ActionButton
                  onClick={() => toggleFavorite(item, mediaType)}
                  $isFavorite={isFavorite(id)}
                  aria-label="Favoritar"
                >
                  <Heart />
                </ActionButton>
                <ActionButton aria-label="Salvar">
                  <Bookmark />
                </ActionButton>
                <ActionButton aria-label="Compartilhar">
                  <Share2 />
                </ActionButton>
              </ActionsRow>
            </TitleSection>

            <MetaRow>
              <RatingBadge $highlighted>
                <Star />
                <span>{details.vote_average.toFixed(1)}</span>
              </RatingBadge>
              <MetaBadge>
                <Calendar />
                <span>{getYearFromDate(releaseDate)}</span>
              </MetaBadge>
              <MetaBadge>
                <Clock />
                <span>{runtime}</span>
              </MetaBadge>
            </MetaRow>

            <GenreRow>
              {details.genres.map((genre) => (
                <GenreBadge key={genre.id}>{genre.name}</GenreBadge>
              ))}
            </GenreRow>

            <Section>
              <SectionTitle>Sinopse</SectionTitle>
              <Overview>{details.overview}</Overview>
            </Section>

            <Section>
              <SectionTitle>Informações</SectionTitle>
              <InfoList>
                {director && (
                  <InfoItem>
                    <span>{isMovieType ? 'Diretor: ' : 'Criador: '}</span>
                    <span>{director}</span>
                  </InfoItem>
                )}
                <InfoItem>
                  <span>Idioma: </span>
                  <span>{details.original_language.toUpperCase()}</span>
                </InfoItem>
                {isMovieType && 'budget' in details && details.budget > 0 && (
                  <InfoItem>
                    <span>Orçamento: </span>
                    <span>${details.budget.toLocaleString()}</span>
                  </InfoItem>
                )}
                {isMovieType && 'revenue' in details && details.revenue > 0 && (
                  <InfoItem>
                    <span>Receita: </span>
                    <span>${details.revenue.toLocaleString()}</span>
                  </InfoItem>
                )}
                {!isMovieType && 'number_of_episodes' in details && (
                  <InfoItem>
                    <span>Episódios: </span>
                    <span>{details.number_of_episodes}</span>
                  </InfoItem>
                )}
              </InfoList>
            </Section>

            {details.production_companies.length > 0 && (
              <Section>
                <SectionTitle>Produção</SectionTitle>
                <ProductionList>
                  {details.production_companies.slice(0, 4).map((company) => (
                    <ProductionCompany key={company.id}>
                      {company.name}
                    </ProductionCompany>
                  ))}
                </ProductionList>
              </Section>
            )}

            {cast.length > 0 && (
              <CastSection>
                <SectionTitle>Elenco</SectionTitle>
                <CastScrollWrapper>
                  <CastNavButton
                    $direction="left"
                    onClick={() => scrollCast('left')}
                    disabled={!canScrollCastLeft}
                    aria-label="Rolar elenco para esquerda"
                  >
                    <ChevronLeft />
                  </CastNavButton>

                  <CastScrollContainer ref={castScrollRef}>
                    {cast.map((actor) => (
                      <CastCard key={actor.id}>
                        <CastPhoto>
                          <img
                            src={getProfileUrl(actor.profile_path, "w185")}
                            alt={actor.name}
                          />
                        </CastPhoto>
                        <CastName title={actor.name}>{actor.name}</CastName>
                        <CastCharacter title={actor.character}>{actor.character}</CastCharacter>
                      </CastCard>
                    ))}
                  </CastScrollContainer>

                  <CastNavButton
                    $direction="right"
                    onClick={() => scrollCast('right')}
                    disabled={!canScrollCastRight}
                    aria-label="Rolar elenco para direita"
                  >
                    <ChevronRight />
                  </CastNavButton>
                </CastScrollWrapper>
              </CastSection>
            )}
          </InfoCard>
        </ModalContent>
      </ModalContainer>
    </Overlay>
  );
}
