---
sidebar_position: 2
---

# Configuração Local

## Requisitos

- Node.js 20+
- npm
- Docker Desktop
- PostgreSQL via Docker

## Instalar Dependências

```bash
npm install
```

## Subir Banco Local

```bash
docker compose up -d
```

## Rodar Migrations

```bash
npx prisma migrate dev
```

## Gerar Prisma Client

```bash
npx prisma generate
```

## Subir API

```bash
npm run dev
```

Por padrão, a API roda em:

```txt
http://localhost:3000
```

## Rodar Testes

```bash
npm test
```

## Compilação

```bash
npm run build
```
