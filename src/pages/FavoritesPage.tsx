import styled from 'styled-components';
import { Heart, Trash2 } from "lucide-react";
import { useState } from "react";
import { MovieCard } from "../components/MovieCard";
import { MovieDetailsModal } from "../components/MovieDetailsModal";
import { useFavorites } from "../contexts/FavoritesContext";
import { useGenres } from "../hooks/useGenres";
import type { Movie, TVShow } from "../types/tmdb";

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

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;

  svg {
    width: 2rem;
    height: 2rem;
    color: ${props => props.theme.colors.red};
    fill: ${props => props.theme.colors.red};
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

const Subtitle = styled.p`
  color: ${props => props.theme.colors.foregroundMuted};
  font-size: ${props => props.theme.fontSize.sm};
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

const CardWrapper = styled.div`
  position: relative;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  z-index: 10;
  padding: 0.5rem;
  border-radius: ${props => props.theme.borderRadius.full};
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  opacity: 0;
  transition: all ${props => props.theme.transitions.normal};

  ${CardWrapper}:hover & {
    opacity: 1;
  }

  &:hover {
    background-color: ${props => props.theme.colors.red};
  }

  svg {
    width: 1rem;
    height: 1rem;
  }
`;

export function FavoritesPage() {
  const { favorites, removeFavorite } = useFavorites();
  const { getGenreNames } = useGenres();
  const [selectedItem, setSelectedItem] = useState<(Movie | TVShow) | null>(null);

  const isMovie = (item: any): boolean => {
    return "title" in item;
  };

  return (
    <PageContainer>
      <Container>
        <Header>
          <TitleRow>
            <Heart />
            <Title>Meus Favoritos</Title>
          </TitleRow>
          <Subtitle>
            {favorites.length} {favorites.length === 1 ? "item salvo" : "itens salvos"}
          </Subtitle>
        </Header>

        {favorites.length === 0 && (
          <EmptyState>
            <Heart />
            <h3>Nenhum favorito ainda</h3>
            <p>Adicione filmes e séries aos favoritos para vê-los aqui</p>
          </EmptyState>
        )}

        {favorites.length > 0 && (
          <Grid>
            {favorites.map((item) => (
              <CardWrapper key={item.id}>
                <MovieCard
                  item={item}
                  onOpenDetails={setSelectedItem}
                />

                <RemoveButton
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFavorite(item.id);
                  }}
                >
                  <Trash2 />
                </RemoveButton>
              </CardWrapper>
            ))}
          </Grid>
        )}
      </Container>

      {selectedItem && (
        <MovieDetailsModal
          item={selectedItem}
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </PageContainer>
  );
}
