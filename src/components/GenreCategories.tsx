import styled from 'styled-components';
import { Camera, Film, Ghost, Globe, Heart, Laugh, Sparkles, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { getMovieGenres } from "../services/tmdb";
import type { Genre } from "../types/tmdb";
import { glassEffect } from "../styles/components";

// Styled Components
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
  margin-bottom: 2rem;

  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    margin-bottom: 3rem;
  }
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: ${props => props.theme.fontWeight.bold};
  color: ${props => props.theme.colors.foreground};
  margin-bottom: 0.5rem;

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

const ScrollContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  overflow-x: auto;
  padding-bottom: 1rem;
  scroll-snap-type: x mandatory;

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    gap: 1rem;
  }

  &::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const GenreButton = styled.button`
  position: relative;
  flex-shrink: 0;
  scroll-snap-align: start;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
`;

const GenreCard = styled.div<{ $gradient: string }>`
  position: relative;
  width: 7rem;
  height: 9rem;
  border-radius: ${props => props.theme.borderRadius['2xl']};
  ${glassEffect}
  border: 1px solid ${props => props.theme.colors.border};
  overflow: hidden;
  transition: all ${props => props.theme.transitions.slow};

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    width: 8rem;
    height: 10rem;
  }

  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    width: 10rem;
    height: 12rem;
  }

  &:hover {
    border-color: ${props => props.theme.colors.primary}80;
    transform: scale(1.05);
  }
`;

const BackgroundGradient = styled.div<{ $gradient: string }>`
  position: absolute;
  inset: 0;
  background: ${props => props.$gradient};
  opacity: 0.1;
  transition: opacity ${props => props.theme.transitions.slow};

  ${GenreButton}:hover & {
    opacity: 0.2;
  }
`;

const CardContent = styled.div`
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem;
`;

const IconCircle = styled.div<{ $gradient: string }>`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: ${props => props.$gradient};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${props => props.theme.shadows.lg};
  transition: transform ${props => props.theme.transitions.slow};

  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    width: 4rem;
    height: 4rem;
  }

  ${GenreButton}:hover & {
    transform: scale(1.1);
  }

  svg {
    width: 1.5rem;
    height: 1.5rem;
    color: white;

    @media (min-width: ${props => props.theme.breakpoints.lg}) {
      width: 2rem;
      height: 2rem;
    }
  }
`;

const GenreName = styled.span`
  font-size: 0.875rem;
  font-weight: ${props => props.theme.fontWeight.medium};
  color: ${props => props.theme.colors.foreground};
  text-align: center;

  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    font-size: ${props => props.theme.fontSize.base};
  }
`;

const HoverGlow = styled.div`
  position: absolute;
  inset: 0;
  border-radius: ${props => props.theme.borderRadius['2xl']};
  opacity: 0;
  transition: opacity ${props => props.theme.transitions.slow};
  box-shadow: ${props => props.theme.shadows.xl}, 0 0 40px ${props => props.theme.colors.primary}33;

  ${GenreButton}:hover & {
    opacity: 1;
  }
`;

const ScrollFade = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 1rem;
  width: 4rem;
  background: linear-gradient(to left, ${props => props.theme.colors.background}, transparent);
  pointer-events: none;
`;

const LoadingCard = styled.div`
  width: 7rem;
  height: 9rem;
  background-color: ${props => props.theme.colors.accent};
  border-radius: ${props => props.theme.borderRadius['2xl']};
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  flex-shrink: 0;

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    width: 8rem;
    height: 10rem;
  }

  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    width: 10rem;
    height: 12rem;
  }
`;

// Mapeamento de gradientes CSS para cores Tailwind
const gradientMap: Record<string, string> = {
  "from-orange-500 to-red-500": "linear-gradient(to bottom right, #f97316, #ef4444)",
  "from-purple-500 to-pink-500": "linear-gradient(to bottom right, #a855f7, #ec4899)",
  "from-pink-500 to-rose-500": "linear-gradient(to bottom right, #ec4899, #f43f5e)",
  "from-yellow-500 to-orange-500": "linear-gradient(to bottom right, #eab308, #f97316)",
  "from-cyan-500 to-blue-500": "linear-gradient(to bottom right, #06b6d4, #3b82f6)",
  "from-green-500 to-emerald-500": "linear-gradient(to bottom right, #22c55e, #10b981)",
  "from-indigo-500 to-purple-500": "linear-gradient(to bottom right, #6366f1, #a855f7)",
  "from-teal-500 to-cyan-500": "linear-gradient(to bottom right, #14b8a6, #06b6d4)",
  "from-pink-400 to-purple-400": "linear-gradient(to bottom right, #f472b6, #c084fc)",
  "from-red-600 to-orange-600": "linear-gradient(to bottom right, #dc2626, #ea580c)",
  "from-blue-400 to-cyan-400": "linear-gradient(to bottom right, #60a5fa, #22d3ee)",
  "from-amber-600 to-yellow-600": "linear-gradient(to bottom right, #d97706, #ca8a04)",
  "from-pink-500 to-rose-400": "linear-gradient(to bottom right, #ec4899, #fb7185)",
  "from-indigo-600 to-purple-600": "linear-gradient(to bottom right, #4f46e5, #9333ea)",
  "from-red-500 to-pink-500": "linear-gradient(to bottom right, #ef4444, #ec4899)",
  "from-gray-600 to-red-700": "linear-gradient(to bottom right, #4b5563, #b91c1c)",
  "from-amber-700 to-orange-700": "linear-gradient(to bottom right, #b45309, #c2410c)",
  "from-gray-500 to-slate-500": "linear-gradient(to bottom right, #6b7280, #64748b)",
};

// Mapeamento de ícones e cores para gêneros
const genreIcons: Record<string, { icon: typeof Film; color: string }> = {
  Ação: { icon: Zap, color: "from-orange-500 to-red-500" },
  Terror: { icon: Ghost, color: "from-purple-500 to-pink-500" },
  Romance: { icon: Heart, color: "from-pink-500 to-rose-500" },
  Comédia: { icon: Laugh, color: "from-yellow-500 to-orange-500" },
  "Ficção científica": { icon: Sparkles, color: "from-cyan-500 to-blue-500" },
  Aventura: { icon: Globe, color: "from-green-500 to-emerald-500" },
  Drama: { icon: Film, color: "from-indigo-500 to-purple-500" },
  Documentário: { icon: Camera, color: "from-teal-500 to-cyan-500" },
  Animação: { icon: Sparkles, color: "from-pink-400 to-purple-400" },
  Crime: { icon: Zap, color: "from-red-600 to-orange-600" },
  Família: { icon: Heart, color: "from-blue-400 to-cyan-400" },
  Fantasia: { icon: Sparkles, color: "from-purple-400 to-pink-400" },
  História: { icon: Film, color: "from-amber-600 to-yellow-600" },
  Música: { icon: Film, color: "from-pink-500 to-rose-400" },
  Mistério: { icon: Ghost, color: "from-indigo-600 to-purple-600" },
  Thriller: { icon: Zap, color: "from-red-500 to-pink-500" },
  Guerra: { icon: Zap, color: "from-gray-600 to-red-700" },
  Faroeste: { icon: Globe, color: "from-amber-700 to-orange-700" },
};

export function GenreCategories() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGenres() {
      try {
        setLoading(true);
        const movieGenres = await getMovieGenres();
        setGenres(movieGenres);
      } catch (error) {
        console.error("Erro ao carregar gêneros:", error);
      } finally {
        setLoading(false);
      }
    }

    loadGenres();
  }, []);

  if (loading) {
    return (
      <Section>
        <Container>
          <Header>
            <Title>Explorar por Gênero</Title>
            <Subtitle>Encontre seu próximo filme favorito</Subtitle>
          </Header>
          <ScrollContainer>
            {[...Array(8)].map((_, i) => (
              <LoadingCard key={i} />
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
          <Title>Explorar por Gênero</Title>
          <Subtitle>Encontre seu próximo filme favorito</Subtitle>
        </Header>

        <ScrollWrapper>
          <ScrollContainer>
            {genres.map((genre) => {
              const genreConfig = genreIcons[genre.name] || { icon: Film, color: "from-gray-500 to-slate-500" };
              const Icon = genreConfig.icon;
              const gradient = gradientMap[genreConfig.color] || gradientMap["from-gray-500 to-slate-500"];

              return (
                <GenreButton key={genre.id}>
                  <GenreCard $gradient={gradient}>
                    <BackgroundGradient $gradient={gradient} />
                    <CardContent>
                      <IconCircle $gradient={gradient}>
                        <Icon />
                      </IconCircle>
                      <GenreName>{genre.name}</GenreName>
                    </CardContent>
                    <HoverGlow />
                  </GenreCard>
                </GenreButton>
              );
            })}
          </ScrollContainer>
          <ScrollFade />
        </ScrollWrapper>
      </Container>
    </Section>
  );
}
