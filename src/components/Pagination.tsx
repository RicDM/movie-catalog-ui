import styled from 'styled-components';
import { ChevronLeft, ChevronRight } from "lucide-react";
import { glassEffect } from "../styles/components";

const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 3rem;
`;

const PageButton = styled.button<{ $active?: boolean }>`
  min-width: 2.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: ${props => props.theme.borderRadius.lg};
  transition: all ${props => props.theme.transitions.fast};
  
  ${props => props.$active ? `
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

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const NavButton = styled.button`
  padding: 0.5rem;
  border-radius: ${props => props.theme.borderRadius.lg};
  ${glassEffect}
  border: 1px solid ${props => props.theme.colors.border};
  transition: all ${props => props.theme.transitions.fast};
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    border-color: ${props => props.theme.colors.primary}80;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

const Ellipsis = styled.span`
  padding: 0.5rem 0.75rem;
  color: ${props => props.theme.colors.foregroundMuted};
`;

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const maxPages = Math.min(totalPages, 500);
  const pages: (number | string)[] = [];

  if (maxPages <= 7) {
    for (let i = 1; i <= maxPages; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);

    if (currentPage > 3) {
      pages.push("...");
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(maxPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < maxPages - 2) {
      pages.push("...");
    }

    pages.push(maxPages);
  }

  return (
    <PaginationContainer>
      <NavButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft />
      </NavButton>

      {pages.map((page, index) => {
        if (page === "...") {
          return <Ellipsis key={`ellipsis-${index}`}>...</Ellipsis>;
        }

        return (
          <PageButton
            key={page}
            onClick={() => onPageChange(page as number)}
            $active={currentPage === page}
          >
            {page}
          </PageButton>
        );
      })}

      <NavButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === maxPages}
      >
        <ChevronRight />
      </NavButton>
    </PaginationContainer>
  );
}
