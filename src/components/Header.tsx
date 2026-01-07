import styled from 'styled-components';
import { Camera, Clapperboard, Film, Heart, Menu, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useFavorites } from "../contexts/FavoritesContext";
import { getImageUrl, searchMulti } from "../services/tmdb";
import type { Movie, TVShow } from "../types/tmdb";
import { glassEffectStrong, glassEffect } from "../styles/components";

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: ${props => props.theme.zIndex.header};
  ${glassEffectStrong}
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const HeaderInner = styled.div`
  max-width: 1536px;
  margin: 0 auto;
  padding: 0 1rem;

  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    padding: 0 2rem;
  }
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4rem;

  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    height: 5rem;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const LogoIcon = styled(Clapperboard)`
  width: 2rem;
  height: 2rem;
  color: ${props => props.theme.colors.primary};
`;

const LogoText = styled.span`
  font-size: 1.25rem;
  font-weight: ${props => props.theme.fontWeight.bold};
  background: ${props => props.theme.gradients.primary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    font-size: 1.5rem;
  }
`;

const DesktopNav = styled.nav`
  display: none;
  align-items: center;
  gap: 6rem;

  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    display: flex;
  }
`;

const NavButton = styled.button<{ $active?: boolean }>`
  color: ${props => props.$active ? props.theme.colors.foreground : props.theme.colors.foregroundMuted};
  transition: color ${props => props.theme.transitions.normal};
  font-size: ${props => props.theme.fontSize.xl};

  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const SearchContainer = styled.div`
  position: relative;
  display: none;

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    display: block;
  }
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: 0.5rem 1rem;
  border-radius: ${props => props.theme.borderRadius.full};
  ${glassEffect}
  border: 1px solid ${props => props.theme.colors.border};
  transition: all ${props => props.theme.transitions.normal};

  &:hover {
    border-color: ${props => props.theme.colors.primary}80;
  }
`;

const SearchIcon = styled(Search)`
  width: 1rem;
  height: 1rem;
  color: ${props => props.theme.colors.foregroundMuted};
  flex-shrink: 0;
`;

const SearchInput = styled.input`
  background: transparent;
  border: none;
  outline: none;
  font-size: ${props => props.theme.fontSize.sm};
  width: 8rem;
  color: ${props => props.theme.colors.foreground};

  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    width: 16rem;
  }

  &::placeholder {
    color: ${props => props.theme.colors.foregroundMuted};
  }
`;

const ClearButton = styled.button`
  color: ${props => props.theme.colors.foregroundMuted};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color ${props => props.theme.transitions.normal};

  &:hover {
    color: ${props => props.theme.colors.foreground};
  }
`;

const SearchResults = styled.div`
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  right: 0;
  ${glassEffectStrong}
  border-radius: ${props => props.theme.borderRadius.xl};
  border: 1px solid ${props => props.theme.colors.border};
  overflow: hidden;
  max-height: 24rem;
  overflow-y: auto;
`;

const SearchResultItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  padding: 0.75rem 1rem;
  text-align: left;
  transition: background-color ${props => props.theme.transitions.fast};

  &:hover {
    background-color: ${props => props.theme.colors.accent};
  }
`;

const SearchResultImage = styled.img`
  width: 3rem;
  height: 4rem;
  object-fit: cover;
  border-radius: ${props => props.theme.borderRadius.sm};
  flex-shrink: 0;
`;

const SearchResultInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const SearchResultTitle = styled.p`
  font-size: ${props => props.theme.fontSize.sm};
  font-weight: ${props => props.theme.fontWeight.medium};
  color: ${props => props.theme.colors.foreground};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SearchResultMeta = styled.p`
  font-size: ${props => props.theme.fontSize.xs};
  color: ${props => props.theme.colors.foregroundMuted};
`;

const EmptyResults = styled.div`
  padding: 1rem;
  text-align: center;
  color: ${props => props.theme.colors.foregroundMuted};
`;

const FavoritesButton = styled.button<{ $hasItems?: boolean }>`
  display: none;
  position: relative;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: 0.5rem 1rem;
  border-radius: ${props => props.theme.borderRadius.full};
  ${glassEffect}
  border: 1px solid ${props => props.theme.colors.border};
  transition: all ${props => props.theme.transitions.normal};

  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    display: flex;
  }

  &:hover {
    border-color: ${props => props.theme.colors.primary}80;
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
    color: ${props => props.$hasItems ? props.theme.colors.red : 'currentColor'};
    ${props => props.$hasItems && `fill: currentColor;`}
  }
`;

const FavoritesBadge = styled.span`
  position: absolute;
  top: -0.25rem;
  right: -0.25rem;
  padding: 0.125rem 0.375rem;
  font-size: ${props => props.theme.fontSize.xs};
  border-radius: ${props => props.theme.borderRadius.full};
  background-color: ${props => props.theme.colors.red};
  color: white;
  min-width: 1.25rem;
  text-align: center;
`;

const ExploreButton = styled.button`
  display: none;
  padding: 0.5rem 1.5rem;
  border-radius: ${props => props.theme.borderRadius.full};
  background: ${props => props.theme.gradients.primary};
  color: ${props => props.theme.colors.primaryForeground};
  transition: all ${props => props.theme.transitions.normal};

  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    display: block;
  }

  &:hover {
    box-shadow: ${props => props.theme.shadows.primaryStrong};
  }
`;

const MobileMenuButton = styled.button`
  display: flex;
  padding: 0.5rem;
  color: ${props => props.theme.colors.foreground};
  transition: color ${props => props.theme.transitions.normal};

  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    display: none;
  }

  &:hover {
    color: ${props => props.theme.colors.primary};
  }

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

const MobileMenu = styled.div`
  display: block;
  padding: 1rem 0;
  border-top: 1px solid ${props => props.theme.colors.border};

  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    display: none;
  }
`;

const MobileMenuContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MobileNavButton = styled.button<{ $active?: boolean }>`
  text-align: left;
  padding: 0.5rem 0;
  color: ${props => props.$active ? props.theme.colors.foreground : props.theme.colors.foregroundMuted};
  transition: color ${props => props.theme.transitions.normal};

  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const MobileCTA = styled.button`
  width: 100%;
  padding: 0.75rem 1.5rem;
  border-radius: ${props => props.theme.borderRadius.full};
  background: ${props => props.theme.gradients.primary};
  color: ${props => props.theme.colors.primaryForeground};
  transition: all ${props => props.theme.transitions.normal};

  &:hover {
    box-shadow: ${props => props.theme.shadows.primaryStrong};
  }
`;

type SearchResult = Movie | TVShow;

function isMovie(result: SearchResult): result is Movie {
  return "title" in result;
}

interface HeaderProps {
  onNavigate: (page: "home" | "catalog" | "favorites") => void;
  currentPage: string;
}

export function Header({ onNavigate, currentPage }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { favorites } = useFavorites();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const searchTimer = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true);
        try {
          const results = await searchMulti(searchQuery);
          setSearchResults(results.slice(0, 5));
          setShowResults(true);
        } catch (error) {
          console.error("Erro na busca:", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(searchTimer);
  }, [searchQuery]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
  };

  return (
    <HeaderContainer>
      <HeaderInner>
        <HeaderContent>
          <LogoContainer>
            <LogoIcon />
            <LogoText>RichCine</LogoText>
          </LogoContainer>

          <DesktopNav>
            <NavButton
              onClick={() => onNavigate("home")}
              $active={currentPage === "home"}
            >
              Início
            </NavButton>
            <NavButton
              onClick={() => onNavigate("catalog")}
              $active={currentPage === "catalog"}
            >
              Catálogo
            </NavButton>
          </DesktopNav>

          <Actions>
            <SearchContainer ref={searchRef}>
              <SearchBar>
                <SearchIcon />
                <SearchInput
                  type="text"
                  placeholder="Buscar filmes e séries..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
                />
                {searchQuery && (
                  <ClearButton onClick={clearSearch}>
                    <X size={16} />
                  </ClearButton>
                )}
              </SearchBar>

              {showResults && (
                <SearchResults>
                  {isSearching ? (
                    <EmptyResults>Buscando...</EmptyResults>
                  ) : searchResults.length > 0 ? (
                    <>
                      {searchResults.map((result) => (
                        <SearchResultItem
                          key={result.id}
                          onClick={() => {
                            clearSearch();
                            onNavigate("catalog");
                          }}
                        >
                          <SearchResultImage
                            src={getImageUrl(result.poster_path, "w200")}
                            alt={isMovie(result) ? result.title : result.name}
                          />
                          <SearchResultInfo>
                            <SearchResultTitle>
                              {isMovie(result) ? result.title : result.name}
                            </SearchResultTitle>
                            <SearchResultMeta>
                              {isMovie(result)
                                ? `Filme • ${result.release_date?.split("-")[0] || "N/A"}`
                                : `Série • ${result.first_air_date?.split("-")[0] || "N/A"}`
                              }
                            </SearchResultMeta>
                          </SearchResultInfo>
                        </SearchResultItem>
                      ))}
                    </>
                  ) : (
                    <EmptyResults>Nenhum resultado encontrado</EmptyResults>
                  )}
                </SearchResults>
              )}
            </SearchContainer>

            <FavoritesButton
              onClick={() => onNavigate("favorites")}
              $hasItems={favorites.length > 0}
            >
              <Heart />
              {favorites.length > 0 && (
                <FavoritesBadge>{favorites.length}</FavoritesBadge>
              )}
            </FavoritesButton>

            <ExploreButton onClick={() => onNavigate("catalog")}>
              Explorar
            </ExploreButton>

            <MobileMenuButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Menu />
            </MobileMenuButton>
          </Actions>
        </HeaderContent>

        {mobileMenuOpen && (
          <MobileMenu>
            <MobileMenuContent>
              <SearchContainer>
                <SearchBar>
                  <SearchIcon />
                  <SearchInput
                    type="text"
                    placeholder="Buscar filmes e séries..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                  />
                  {searchQuery && (
                    <ClearButton onClick={clearSearch}>
                      <X size={16} />
                    </ClearButton>
                  )}
                </SearchBar>

                {showResults && searchResults.length > 0 && (
                  <SearchResults>
                    {searchResults.map((result) => (
                      <SearchResultItem
                        key={result.id}
                        onClick={() => {
                          clearSearch();
                          setMobileMenuOpen(false);
                          onNavigate("catalog");
                        }}
                      >
                        <SearchResultImage
                          src={getImageUrl(result.poster_path, "w200")}
                          alt={isMovie(result) ? result.title : result.name}
                        />
                        <SearchResultInfo>
                          <SearchResultTitle>
                            {isMovie(result) ? result.title : result.name}
                          </SearchResultTitle>
                          <SearchResultMeta>
                            {isMovie(result)
                              ? `Filme • ${result.release_date?.split("-")[0] || "N/A"}`
                              : `Série • ${result.first_air_date?.split("-")[0] || "N/A"}`
                            }
                          </SearchResultMeta>
                        </SearchResultInfo>
                      </SearchResultItem>
                    ))}
                  </SearchResults>
                )}
              </SearchContainer>

              <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <MobileNavButton
                  onClick={() => {
                    onNavigate("home");
                    setMobileMenuOpen(false);
                  }}
                  $active={currentPage === "home"}
                >
                  Início
                </MobileNavButton>
                <MobileNavButton
                  onClick={() => {
                    onNavigate("catalog");
                    setMobileMenuOpen(false);
                  }}
                  $active={currentPage === "catalog"}
                >
                  Catálogo
                </MobileNavButton>
                <MobileNavButton
                  onClick={() => {
                    onNavigate("favorites");
                    setMobileMenuOpen(false);
                  }}
                  $active={currentPage === "favorites"}
                >
                  Favoritos {favorites.length > 0 && `(${favorites.length})`}
                </MobileNavButton>
              </nav>

              <MobileCTA
                onClick={() => {
                  onNavigate("catalog");
                  setMobileMenuOpen(false);
                }}
              >
                Explorar
              </MobileCTA>
            </MobileMenuContent>
          </MobileMenu>
        )}
      </HeaderInner>
    </HeaderContainer>
  );
}
