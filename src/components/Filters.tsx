'use client';

import { SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import styled from 'styled-components';
import { glassEffect, glassEffectStrong } from "../styles/components";
import type { Genre } from "../types/tmdb";

const FiltersWrapper = styled.div`
  margin-bottom: 2rem;
`;

const FiltersToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const ToggleButton = styled.button<{ $hasActive?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: ${props => props.theme.borderRadius.full};
  ${glassEffect}
  border: 1px solid ${props => props.theme.colors.border};
  transition: colors ${props => props.theme.transitions.fast};

  &:hover {
    border-color: ${props => props.theme.colors.primary}80;
  }

  svg {
    width: 1rem;
    height: 1rem;
  }
`;

const ActiveBadge = styled.span`
  padding: 0.125rem 0.5rem;
  border-radius: ${props => props.theme.borderRadius.full};
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.primaryForeground};
  font-size: ${props => props.theme.fontSize.xs};
`;

const ClearButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: ${props => props.theme.borderRadius.full};
  ${glassEffect}
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.foregroundMuted};
  transition: all ${props => props.theme.transitions.fast};

  &:hover {
    color: ${props => props.theme.colors.foreground};
  }

  svg {
    width: 1rem;
    height: 1rem;
  }
`;

const FiltersPanel = styled.div`
  ${glassEffectStrong}
  border-radius: ${props => props.theme.borderRadius['2xl']};
  padding: 1.5rem;
  margin-top: 1rem;
  animation: slideInFromTop 300ms ease;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const FilterLabel = styled.label`
  display: block;
  font-size: ${props => props.theme.fontSize.sm};
  font-weight: ${props => props.theme.fontWeight.medium};
  color: ${props => props.theme.colors.foreground};
  margin-bottom: 0.75rem;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.5rem 1rem;
  border-radius: ${props => props.theme.borderRadius.lg};
  ${glassEffect}
  border: 1px solid ${props => props.theme.colors.border};
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.foreground};
  font-size: ${props => props.theme.fontSize.sm};
  transition: all ${props => props.theme.transitions.normal};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}33;
  }
`;

const GenreGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const GenreButton = styled.button<{ $selected: boolean }>`
  padding: 0.375rem 0.75rem;
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: ${props => props.theme.fontSize.sm};
  transition: all ${props => props.theme.transitions.fast};

  ${props => props.$selected ? `
    background-color: ${props.theme.colors.primary};
    color: ${props.theme.colors.primaryForeground};
    box-shadow: ${props.theme.shadows.lg}, 0 0 20px ${props.theme.colors.primary}4D;
  ` : `
    ${glassEffect}
    border: 1px solid ${props.theme.colors.border};
    color: ${props.theme.colors.foreground};

    &:hover {
      border-color: ${props.theme.colors.primary}80;
    }
  `}
`;

const YearRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem 1rem;
  border-radius: ${props => props.theme.borderRadius.lg};
  ${glassEffect}
  border: 1px solid ${props => props.theme.colors.border};
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.foreground};
  font-size: ${props => props.theme.fontSize.sm};
  transition: all ${props => props.theme.transitions.normal};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}33;
  }

  &::placeholder {
    color: ${props => props.theme.colors.foregroundMuted};
  }
`;

const RatingRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const RatingValue = styled.div`
  font-size: ${props => props.theme.fontSize.sm};
  font-weight: ${props => props.theme.fontWeight.medium};
  color: ${props => props.theme.colors.foreground};
  margin-bottom: 0.5rem;
`;

const RangeInput = styled.input`
  width: 100%;
  accent-color: ${props => props.theme.colors.primary};
  cursor: pointer;
`;

const RangeLabels = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: ${props => props.theme.fontSize.xs};
  color: ${props => props.theme.colors.foregroundMuted};
  margin-top: 0.25rem;
`;

interface FiltersProps {
  genres: Genre[];
  selectedGenres: number[];
  onGenreChange: (genreIds: number[]) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  yearFrom: string;
  yearTo: string;
  onYearChange: (from: string, to: string) => void;
  ratingMin: number;
  onRatingChange: (rating: number) => void;
}

export function Filters({
  genres,
  selectedGenres,
  onGenreChange,
  sortBy,
  onSortChange,
  yearFrom,
  yearTo,
  onYearChange,
  ratingMin,
  onRatingChange,
}: FiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  const toggleGenre = (genreId: number) => {
    if (selectedGenres.includes(genreId)) {
      onGenreChange(selectedGenres.filter((id) => id !== genreId));
    } else {
      onGenreChange([...selectedGenres, genreId]);
    }
  };

  const clearFilters = () => {
    onGenreChange([]);
    onSortChange("popularity.desc");
    onYearChange("", "");
    onRatingChange(0);
  };

  const hasActiveFilters =
    selectedGenres.length > 0 ||
    sortBy !== "popularity.desc" ||
    yearFrom ||
    yearTo ||
    ratingMin > 0;

  const activeCount = selectedGenres.length + (yearFrom ? 1 : 0) + (ratingMin > 0 ? 1 : 0);

  return (
    <FiltersWrapper>
      <FiltersToggle>
        <ToggleButton onClick={() => setShowFilters(!showFilters)}>
          <SlidersHorizontal />
          <span>Filtros</span>
          {hasActiveFilters && <ActiveBadge>{activeCount}</ActiveBadge>}
        </ToggleButton>

        {hasActiveFilters && (
          <ClearButton onClick={clearFilters}>
            <X />
            <span>Limpar</span>
          </ClearButton>
        )}
      </FiltersToggle>

      {showFilters && (
        <FiltersPanel>
          <FilterGroup>
            <FilterLabel>Ordenar por</FilterLabel>
            <Select value={sortBy} onChange={(e) => onSortChange(e.target.value)}>
              <option value="popularity.desc">Mais Populares</option>
              <option value="popularity.asc">Menos Populares</option>
              <option value="vote_average.desc">Melhor Avaliados</option>
              <option value="vote_average.asc">Pior Avaliados</option>
              <option value="release_date.desc">Mais Recentes</option>
              <option value="release_date.asc">Mais Antigos</option>
              <option value="title.asc">Título (A-Z)</option>
              <option value="title.desc">Título (Z-A)</option>
            </Select>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Gêneros</FilterLabel>
            <GenreGrid>
              {genres.map((genre) => (
                <GenreButton
                  key={genre.id}
                  onClick={() => toggleGenre(genre.id)}
                  $selected={selectedGenres.includes(genre.id)}
                >
                  {genre.name}
                </GenreButton>
              ))}
            </GenreGrid>
          </FilterGroup>

          <YearRow>
            <FilterGroup>
              <FilterLabel>Ano de</FilterLabel>
              <Input
                type="number"
                value={yearFrom}
                onChange={(e) => onYearChange(e.target.value, yearTo)}
                placeholder="1900"
                min="1900"
                max={new Date().getFullYear()}
              />
            </FilterGroup>
            <FilterGroup>
              <FilterLabel>Ano até</FilterLabel>
              <Input
                type="number"
                value={yearTo}
                onChange={(e) => onYearChange(yearFrom, e.target.value)}
                placeholder={new Date().getFullYear().toString()}
                min="1900"
                max={new Date().getFullYear()}
              />
            </FilterGroup>
          </YearRow>

          <FilterGroup>
            <FilterLabel>Avaliação mínima: {ratingMin.toFixed(1)}</FilterLabel>
            <RatingRow>
              <RangeInput
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={ratingMin}
                onChange={(e) => onRatingChange(parseFloat(e.target.value))}
              />
              <RangeLabels>
                <span>0.0</span>
                <span>5.0</span>
                <span>10.0</span>
              </RangeLabels>
            </RatingRow>
          </FilterGroup>
        </FiltersPanel>
      )}
    </FiltersWrapper>
  );
}
