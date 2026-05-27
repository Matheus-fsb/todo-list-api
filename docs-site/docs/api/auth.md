---
sidebar_position: 2
---

# Autenticação

## Login

```http
POST /auth/login
```

Corpo da requisição:

```json
{
  "email": "user@example.com",
  "password": "senha-segura"
}
```

Regras:

- usuário precisa existir
- senha precisa bater com o hash
- email precisa estar verificado

## Renovar Tokens

```http
POST /auth/refresh
```

Usa o cookie `refreshToken`.

## Sair

```http
POST /auth/logout
```

Limpa cookies de autenticação.

## Verificar Email

```http
GET /auth/verify-email?token=<token>
```

## Reenviar Verificação

```http
POST /auth/resend-verification-token
```

Corpo da requisição:

```json
{
  "email": "user@example.com"
}
```
