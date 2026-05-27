---
sidebar_position: 1
---

# Visão Geral da API

Base local:

```txt
http://localhost:3000
```

Formato padrão de sucesso:

```json
{
  "success": true,
  "message": "Mensagem",
  "data": {}
}
```

Formato padrão de erro:

```json
{
  "success": false,
  "message": "Mensagem de erro"
}
```

## Autenticação

A API usa cookies HTTP-only:

```txt
accessToken
refreshToken
```

Também aceita:

```txt
Authorization: Bearer <token>
```

## Paginação

Rotas de listagem usam:

```txt
?page=1&limit=10
```

Resposta paginada:

```json
{
  "items": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 0,
    "totalPages": 0
  }
}
```

