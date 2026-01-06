
  # Movie Catalog UI Design

Um catálogo moderno de filmes e séries integrado com a API do [The Movie Database (TMDB)](https://www.themoviedb.org/). 

O design original está disponível em: https://www.figma.com/design/bLeWm5lTsBjuyXNtC5ejVU/Movie-Catalog-UI-Design

## 🎬 Funcionalidades

- ✅ **Filme em Destaque**: Exibe o filme mais popular da semana com informações detalhadas
- ✅ **Filmes Populares**: Grade de filmes mais populares do momento
- ✅ **Séries Populares**: Seção dedicada para séries de TV
- ✅ **Explorar por Gênero**: Navegação por categorias de gêneros
- ✅ **Lançamentos**: Próximos lançamentos de filmes
- ✅ **Busca em Tempo Real**: Pesquise filmes e séries com resultados instantâneos
- ✅ **Design Responsivo**: Otimizado para desktop, tablet e mobile
- ✅ **Temas**: Suporte para tema claro/escuro
- ✅ **Efeitos Glassmorphism**: Interface moderna com efeitos de vidro

## 🚀 Tecnologias

- **React 18** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS utilitário
- **Radix UI** - Componentes acessíveis
- **Lucide React** - Ícones
- **TMDB API** - Dados de filmes e séries

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Chave de API do TMDB (gratuita)

## 🔑 Obter API Key do TMDB

1. Crie uma conta em [https://www.themoviedb.org/](https://www.themoviedb.org/)
2. Acesse [https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)
3. Solicite uma API Key (escolha a opção "Developer")
4. Copie sua API Key (v3 auth)

## ⚙️ Instalação e Configuração

1. **Clone o repositório e instale as dependências:**

```bash
npm install
```

2. **Configure a API Key:**

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` e adicione sua chave de API do TMDB:

```env
VITE_TMDB_API_KEY=sua_chave_api_aqui
```

3. **Inicie o servidor de desenvolvimento:**

```bash
npm run dev
```

O aplicativo estará disponível em `http://localhost:5173`

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── ui/             # Componentes UI base (shadcn/ui)
│   ├── figma/          # Componentes auxiliares
│   ├── Header.tsx      # Cabeçalho com busca
│   ├── HeroSection.tsx # Seção hero com filme destaque
│   ├── FeaturedMovies.tsx    # Grid de filmes populares
│   ├── FeaturedTVShows.tsx   # Grid de séries
│   ├── GenreCategories.tsx   # Navegação por gêneros
│   ├── NewReleases.tsx       # Próximos lançamentos
│   └── MovieCard.tsx   # Card de filme/série
├── services/           # Serviços de API
│   └── tmdb.ts        # Cliente API TMDB
├── types/             # Definições TypeScript
│   └── tmdb.ts        # Tipos para dados TMDB
├── hooks/             # React hooks customizados
│   └── useGenres.ts   # Hook para gêneros
├── styles/            # Estilos globais
└── App.tsx            # Componente raiz
```

## 🎨 Componentes Principais

### HeroSection
Exibe o filme mais popular da semana em destaque com:
- Backdrop em tela cheia
- Título, sinopse e informações
- Botões de ação (Assistir Trailer, Ver Detalhes)

### FeaturedMovies
Grade responsiva com os filmes mais populares:
- 12 filmes por página
- Cards com hover effects
- Informações de rating e ano

### FeaturedTVShows  
Grade de séries populares com layout similar aos filmes

### GenreCategories
Carrossel horizontal de categorias de gêneros:
- Ícones personalizados por gênero
- Gradientes coloridos
- Scroll horizontal suave

### NewReleases
Próximos lançamentos em formato de lista:
- Cards compactos horizontais
- Informações de data de lançamento
- Duração e rating

### Header
Navegação principal com:
- Busca em tempo real
- Resultados instantâneos
- Menu responsivo mobile

## 🌐 API Endpoints Utilizados

- `/trending/movie/week` - Filmes em alta
- `/movie/popular` - Filmes populares
- `/movie/upcoming` - Próximos lançamentos
- `/tv/popular` - Séries populares
- `/genre/movie/list` - Gêneros de filmes
- `/genre/tv/list` - Gêneros de séries
- `/search/multi` - Busca universal

## 🎯 Próximas Melhorias

- [ ] Página de detalhes de filme/série
- [ ] Sistema de favoritos
- [ ] Filtros avançados
- [ ] Paginação infinita
- [ ] Player de trailers
- [ ] Sistema de autenticação
- [ ] Lista de assistidos
- [ ] Recomendações personalizadas

## 📝 Scripts Disponíveis

```bash
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build de produção
npm run lint         # Executa linting
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## 📄 Licença

Este projeto é open source e está disponível sob a licença MIT.

## 🙏 Créditos

- Design: [Movie Catalog UI Design (Figma)](https://www.figma.com/design/bLeWm5lTsBjuyXNtC5ejVU/Movie-Catalog-UI-Design)
- Dados: [The Movie Database (TMDB)](https://www.themoviedb.org/)
- UI Components: [shadcn/ui](https://ui.shadcn.com/)

  