
  # Movie Catalog UI Design

Catálogo de filmes e séries desenvolvido com **Next.js 14** e **Styled Components**.

## 🚀 Tecnologias

- **Next.js 14** (App Router)
- **React 18**
- **TypeScript**
- **Styled Components**
- **TMDB API** (The Movie Database)

## 📋 Pré-requisitos

- Node.js 18+ 
- NPM ou Yarn ou PNPM
- Chave de API do TMDB

## 🔧 Instalação

1. Clone o repositório e instale as dependências:

```bash
npm install
# ou
yarn install
# ou
pnpm install
```

2. Configure as variáveis de ambiente:

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_TMDB_API_KEY=sua_chave_api_aqui
```

Para obter uma chave de API gratuita, acesse: https://www.themoviedb.org/settings/api

## 🎯 Desenvolvimento

Execute o servidor de desenvolvimento:

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

## 🏗️ Build para Produção

```bash
npm run build
npm run start
```

## 📁 Estrutura do Projeto

```
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Layout raiz
│   ├── page.tsx           # Página inicial
│   ├── providers.tsx      # Providers (Theme, Context)
│   ├── registry.tsx       # Styled Components SSR
│   ├── catalog/
│   │   └── page.tsx       # Página de catálogo
│   └── favorites/
│       └── page.tsx       # Página de favoritos
├── docs/                  # Documentação
├── src/
│   ├── components/        # Componentes React
│   ├── contexts/          # React Contexts
│   ├── hooks/             # Custom Hooks
│   ├── services/          # APIs e serviços
│   ├── styles/            # Temas e estilos globais
│   ├── types/             # TypeScript types
│   └── views/             # Views/Pages components
├── next.config.js         # Configuração Next.js
└── tsconfig.json          # Configuração TypeScript
```

Para mais detalhes sobre a estrutura, veja [docs/STRUCTURE.md](./docs/STRUCTURE.md).

## 🌟 Funcionalidades

- ✅ Navegação com Next.js App Router
- ✅ Catálogo de filmes e séries
- ✅ Sistema de favoritos (persistido no localStorage)
- ✅ Busca de conteúdo
- ✅ Detalhes de filmes/séries com modal
- ✅ Filtros por gênero e tipo
- ✅ Design responsivo
- ✅ Server-Side Rendering (SSR) com Styled Components


## 🚢 Deploy

O projeto está pronto para deploy no Vercel:

```bash
vercel
```

Ou conecte seu repositório Git ao Vercel para deploy automático.

## 📄 Licença

Este projeto é de código aberto.

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