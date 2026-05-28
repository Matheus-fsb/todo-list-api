## Todo List API

API REST desenvolvida por **Matheus** para gerenciamento de usuários, projetos e tarefas.

O projeto foi construído com foco em uma estrutura backend completa: autenticação com JWT, verificação de email, notificações, soft delete, filtros, paginação, banco PostgreSQL com Prisma, ambiente local com Docker, CI com GitHub Actions e testes automatizados com Jest e Supertest.

Todos os direitos reservados a **Matheus**.

## Versão

```txt
V1.0.0
```

Primeira versão preparada para deploy com:

- API publicada como Web Service no Render.
- Banco PostgreSQL hospedado no Neon.
- Pipeline de CI/CD com GitHub Actions.
- Documentação técnica com Docusaurus.

## Links

```txt
API: adicione aqui a URL pública do Render
Documentação: adicione aqui a URL da documentação quando publicar
```

## Documentação

A documentação completa fica em `docs-site`, usando Docusaurus. Ela apresenta o objetivo do projeto, arquitetura, configuração local, variáveis de ambiente, banco com Docker, deploy no Render/Neon, módulos da API, notificações, testes e operações principais.

Rodar documentação em modo desenvolvimento:

```bash
npm run docs:start
```

Compilação da documentação:

```bash
npm run docs:build
```

## API

Rodar API em desenvolvimento:

```bash
npm run dev
```

Compilar API:

```bash
npm run build
```

Rodar build de produção:

```bash
npm start
```

Rodar testes:

```bash
npm test
```

## Deploy

A V1.0.0 foi preparada para o seguinte ambiente:

```txt
Render Web Service -> API Node/Express
Neon PostgreSQL -> Banco de dados
```

O deploy de produção é disparado pelo GitHub Actions quando há push na branch `main`.

Comandos usados no Render:

```bash
npm install && npx prisma generate && npm run build
```

```bash
npm start
```

As variáveis sensíveis devem ser configuradas no painel do Render. Nunca versione `.env`.

Secrets necessários no GitHub Actions:

```txt
PRODUCTION_DATABASE_URL
PRODUCTION_DIRECT_URL
RENDER_DEPLOY_HOOK_URL
```
