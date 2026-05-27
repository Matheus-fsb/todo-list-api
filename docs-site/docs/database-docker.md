---
sidebar_position: 4
---

# Banco com Docker

O projeto usa PostgreSQL local via Docker.

Arquivo:

```txt
docker-compose.yml
```

Serviço:

```yml
services:
  postgres:
    image: postgres:16
    container_name: todo-list-postgres
    ports:
      - "5432:5432"
```

## Subir

```bash
docker compose up -d
```

## Parar

```bash
docker compose down
```

## Remover Volume

Use apenas se quiser apagar todos os dados locais:

```bash
docker compose down -v
```

## Prisma Studio

```bash
npx prisma studio
```

