---
sidebar_position: 7
---

# Operação

## V1.0.0 Em Produção

A primeira versão de deploy usa:

```txt
Render -> execução da API
Neon -> banco PostgreSQL
```

O ambiente local continua usando Docker para facilitar desenvolvimento.

## Health Check

A rota base pode ser usada como verificação simples:

```http
GET /
```

Resposta esperada:

```json
{
  "success": true,
  "message": "API is running",
  "data": {
    "port": "porta_do_ambiente"
  }
}
```

## Cleanup de Usuários Não Verificados

O sistema possui job para remover usuários não verificados após 30 dias.

Regra:

```txt
emailVerified = false
createdAt <= hoje - 30 dias
```

## Tokens Expirados

Tokens de validação expirados também podem ser removidos.

## Exclusão Lógica

Usuários e projetos usam soft delete em fluxos de conta real.

Campos usados:

```txt
deletedAt
```

## Exclusão Definitiva

Usado para remoções definitivas, como usuários não verificados expirados.
