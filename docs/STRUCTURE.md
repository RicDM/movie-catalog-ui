# Estrutura do Projeto

```
movie-catalog-ui-design/
├── app/                          # Next.js App Router
│   ├── catalog/                  # Rota /catalog
│   │   └── page.tsx
│   ├── favorites/                # Rota /favorites
│   │   └── page.tsx
│   ├── layout.tsx                # Layout raiz com metadata
│   ├── page.tsx                  # Página inicial (/)
│   ├── providers.tsx             # Providers client-side
│   └── registry.tsx              # Styled Components SSR
│
├── docs/                         # Documentação
│   ├── FEATURES.md
│   ├── GUIA_DE_USO.md
│   ├── STRUCTURE.md
├── src/
│   ├── components/               # Componentes reutilizáveis
│   │   ├── FeaturedMovies.tsx
│   │   ├── FeaturedTVShows.tsx
│   │   ├── Filters.tsx
│   │   ├── Header.tsx
│   │   ├── HeroSection.tsx
│   │   ├── ImageWithFallback.tsx
│   │   ├── MovieCard.tsx
│   │   ├── MovieDetailsModal.tsx
│   │   ├── NewReleases.tsx
│   │   ├── Pagination.tsx
│   │   └── index.ts              # Barrel export
│   │
│   ├── contexts/                 # React Contexts
│   │   └── FavoritesContext.tsx
│   │
│   ├── hooks/                    # Custom hooks
│   │   └── useGenres.ts
│   │
│   ├── services/                 # API services
│   │   └── tmdb.ts
│   │
│   ├── styles/                   # Estilos e temas
│   │   ├── components.ts
│   │   ├── globals.css
│   │   ├── GlobalStyles.ts
│   │   ├── styled.d.ts
│   │   └── theme.ts
│   │
│   ├── types/                    # TypeScript types
│   │   └── tmdb.ts
│   │
│   └── views/                    # View components (pages)
│       ├── CatalogPage.tsx
│       └── FavoritesPage.tsx
│
├── .env.example                  # Exemplo de variáveis de ambiente
├── .env.local                    # Variáveis de ambiente locais (gitignored)
├── .gitignore
├── next.config.js                # Configuração Next.js
├── next-env.d.ts                 # Types Next.js
├── package.json
├── README.md                     # Documentação principal
├── tsconfig.json                 # Configuração TypeScript
└── vercel.json                   # Configuração Vercel

```

## 📋 Convenções

### Nomenclatura
- **Components**: PascalCase (ex: `MovieCard.tsx`)
- **Hooks**: camelCase com prefixo `use` (ex: `useGenres.ts`)
- **Services**: camelCase (ex: `tmdb.ts`)
- **Types**: PascalCase (ex: `Movie`, `TVShow`)

### Estrutura de Componentes
```tsx
'use client'; // Se necessário

import styled from 'styled-components';
// outros imports

// Styled components
const Container = styled.div`...`;

// Component
export function ComponentName() {
  // hooks
  // handlers
  // render
}
```

### Imports
Use os path aliases configurados:
```tsx
import { Header } from '@/components';
import { theme } from '@/styles/theme';
import type { Movie } from '@/types/tmdb';
```

## 🗂️ Organização por Funcionalidade

### Páginas (App Router)
- `app/page.tsx` - Home com hero, featured movies/shows, new releases
- `app/catalog/page.tsx` - Catálogo com filtros e busca
- `app/favorites/page.tsx` - Lista de favoritos

### Componentes Principais
- `Header` - Navegação, busca, favoritos
- `HeroSection` - Banner principal da home
- `FeaturedMovies/TVShows` - Carrosséis de conteúdo
- `NewReleases` - Lançamentos recentes
- `MovieCard` - Card de filme/série
- `MovieDetailsModal` - Modal com detalhes
- `Filters` - Filtros de busca
- `Pagination` - Paginação

### Estado Global
- `FavoritesContext` - Gerenciamento de favoritos com localStorage

### Serviços
- `tmdb.ts` - API calls para TMDB
