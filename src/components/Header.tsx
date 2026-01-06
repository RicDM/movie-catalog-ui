import { Film, Heart, Menu, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useFavorites } from "../contexts/FavoritesContext";
import { getImageUrl, searchMulti } from "../services/tmdb";
import type { Movie, TVShow } from "../types/tmdb";

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
    <header className="fixed top-0 left-0 right-0 z-50 glass-strong">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Film className="w-8 h-8 text-primary" />
            <span className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">
              CineMax
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <button
              onClick={() => onNavigate("home")}
              className={`transition-colors duration-300 ${currentPage === "home"
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-primary"
                }`}
            >
              Início
            </button>
            <button
              onClick={() => onNavigate("catalog")}
              className={`transition-colors duration-300 ${currentPage === "catalog"
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-primary"
                }`}
            >
              Catálogo
            </button>
            <button
              onClick={() => onNavigate("favorites")}
              className={`transition-colors duration-300 ${currentPage === "favorites"
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-primary"
                }`}
            >
              Favoritos
            </button>
          </nav>

          {/* Search and CTA */}
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="hidden md:block relative" ref={searchRef}>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full glass border border-border hover:border-primary/50 transition-all duration-300">
                <Search className="w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar filmes e séries..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
                  className="bg-transparent border-none outline-none text-sm w-32 lg:w-64 placeholder:text-muted-foreground"
                />
                {searchQuery && (
                  <button onClick={clearSearch} className="text-muted-foreground hover:text-foreground">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Search Results Dropdown */}
              {showResults && (
                <div className="absolute top-full mt-2 left-0 right-0 glass-strong rounded-xl border border-border overflow-hidden max-h-96 overflow-y-auto">
                  {isSearching ? (
                    <div className="p-4 text-center text-muted-foreground">
                      Buscando...
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="py-2">
                      {searchResults.map((result) => (
                        <button
                          key={result.id}
                          onClick={() => {
                            clearSearch();
                            onNavigate("catalog");
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors duration-200 text-left"
                        >
                          <img
                            src={getImageUrl(result.poster_path, "w200")}
                            alt={isMovie(result) ? result.title : result.name}
                            className="w-12 h-16 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {isMovie(result) ? result.title : result.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {isMovie(result)
                                ? `Filme • ${result.release_date?.split("-")[0] || "N/A"}`
                                : `Série • ${result.first_air_date?.split("-")[0] || "N/A"}`
                              }
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">
                      Nenhum resultado encontrado
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Favorites Button */}
            <button
              onClick={() => onNavigate("favorites")}
              className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full glass border border-border hover:border-primary/50 transition-all duration-300 relative"
            >
              <Heart className={`w-5 h-5 ${favorites.length > 0 ? "text-red-500 fill-current" : ""
                }`} />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs rounded-full bg-red-500 text-white min-w-[20px] text-center">
                  {favorites.length}
                </span>
              )}
            </button>

            {/* CTA Button */}
            <button
              onClick={() => onNavigate("catalog")}
              className="hidden lg:block px-6 py-2 rounded-full bg-gradient-to-r from-primary to-cyan-500 text-primary-foreground hover:shadow-lg hover:shadow-primary/50 transition-all duration-300"
            >
              Explorar
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-foreground hover:text-primary transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              {/* Mobile Search */}
              <div className="relative">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full glass border border-border">
                  <Search className="w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Buscar filmes e séries..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="bg-transparent border-none outline-none text-sm flex-1 placeholder:text-muted-foreground"
                  />
                  {searchQuery && (
                    <button onClick={clearSearch} className="text-muted-foreground hover:text-foreground">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Mobile Search Results */}
                {showResults && searchResults.length > 0 && (
                  <div className="mt-2 glass-strong rounded-xl border border-border overflow-hidden">
                    <div className="py-2">
                      {searchResults.map((result) => (
                        <button
                          key={result.id}
                          onClick={() => {
                            clearSearch();
                            setMobileMenuOpen(false);
                            onNavigate("catalog");
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors duration-200 text-left"
                        >
                          <img
                            src={getImageUrl(result.poster_path, "w200")}
                            alt={isMovie(result) ? result.title : result.name}
                            className="w-12 h-16 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {isMovie(result) ? result.title : result.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {isMovie(result)
                                ? `Filme • ${result.release_date?.split("-")[0] || "N/A"}`
                                : `Série • ${result.first_air_date?.split("-")[0] || "N/A"}`
                              }
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Navigation Links */}
              <nav className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    onNavigate("home");
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left transition-colors duration-300 py-2 ${currentPage === "home"
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-primary"
                    }`}
                >
                  Início
                </button>
                <button
                  onClick={() => {
                    onNavigate("catalog");
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left transition-colors duration-300 py-2 ${currentPage === "catalog"
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-primary"
                    }`}
                >
                  Catálogo
                </button>
                <button
                  onClick={() => {
                    onNavigate("favorites");
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left transition-colors duration-300 py-2 ${currentPage === "favorites"
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-primary"
                    }`}
                >
                  Favoritos {favorites.length > 0 && `(${favorites.length})`}
                </button>
              </nav>

              {/* Mobile CTA */}
              <button
                onClick={() => {
                  onNavigate("catalog");
                  setMobileMenuOpen(false);
                }}
                className="w-full px-6 py-3 rounded-full bg-gradient-to-r from-primary to-cyan-500 text-primary-foreground hover:shadow-lg hover:shadow-primary/50 transition-all duration-300"
              >
                Explorar
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
