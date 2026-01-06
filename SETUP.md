# Guia de Configuração Rápida - Movie Catalog

## 📌 Passos Essenciais

### 1. Obter API Key do TMDB

1. Acesse: https://www.themoviedb.org/signup
2. Crie uma conta gratuita
3. Vá em Settings → API: https://www.themoviedb.org/settings/api
4. Solicite uma chave de API (escolha "Developer")
5. Copie sua **API Key (v3 auth)**

### 2. Configurar o Projeto

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variável de ambiente
# Edite o arquivo .env e adicione sua chave:
VITE_TMDB_API_KEY=sua_chave_aqui

# 3. Iniciar servidor de desenvolvimento
npm run dev
```

### 3. Verificar se está Funcionando

Após iniciar o servidor (`npm run dev`), você deverá ver:
- ✅ Filme em destaque no topo
- ✅ Grade de filmes populares
- ✅ Categorias de gêneros
- ✅ Seção de séries
- ✅ Lançamentos recentes
- ✅ Busca funcional no header

## 🔧 Resolução de Problemas

### Erro: "TMDB API Key não encontrada"
- Verifique se o arquivo `.env` existe na raiz do projeto
- Confirme que a variável está nomeada como `VITE_TMDB_API_KEY`
- Reinicie o servidor após alterar o `.env`

### Erro: "Failed to fetch"
- Verifique sua conexão com internet
- Confirme que a API Key está correta
- Teste a chave em: https://www.themoviedb.org/settings/api

### Imagens não carregam
- As imagens vêm da API do TMDB
- Verifique se sua chave de API está válida
- Aguarde alguns segundos para o carregamento

## 🎯 Recursos Implementados

- [x] Integração completa com TMDB API
- [x] Filmes populares e em alta
- [x] Séries de TV
- [x] Categorias por gênero
- [x] Próximos lançamentos
- [x] Busca em tempo real
- [x] Design responsivo
- [x] Estados de carregamento (skeletons)
- [x] Tratamento de erros

## 📚 Endpoints da API Utilizados

```
/trending/movie/week     - Filmes em alta
/movie/popular          - Filmes populares
/movie/upcoming         - Próximos lançamentos
/tv/popular            - Séries populares
/genre/movie/list      - Gêneros de filmes
/genre/tv/list         - Gêneros de séries
/search/multi          - Busca universal
/movie/{id}            - Detalhes do filme
```

## 🚀 Próximos Passos Sugeridos

1. Personalizar temas e cores
2. Adicionar página de detalhes
3. Implementar favoritos
4. Adicionar filtros avançados
5. Criar sistema de autenticação

## 📝 Comandos Úteis

```bash
npm run dev      # Desenvolvimento
npm run build    # Build para produção
npm run preview  # Preview do build
```

## 💡 Dicas

- A API do TMDB tem limite de requisições (gratuito)
- Use cache quando possível para economizar chamadas
- As imagens têm vários tamanhos disponíveis (w200, w500, original, etc.)
- A API retorna em português (pt-BR) por padrão

## 🆘 Suporte

- Documentação TMDB: https://developers.themoviedb.org/3
- Design Figma: https://www.figma.com/design/bLeWm5lTsBjuyXNtC5ejVU/Movie-Catalog-UI-Design

---

**Importante:** Nunca commite o arquivo `.env` com sua chave de API no Git!
O arquivo `.gitignore` já está configurado para ignorá-lo.
