---
sidebar_position: 3
---

# Usuários

## Criar Conta

```http
POST /users
```

Corpo da requisição:

```json
{
  "name": "Matheus",
  "email": "matheus@example.com",
  "password": "senha-com-10"
}
```

Senha mínima: 10 caracteres.

## Meu Perfil

```http
GET /users/me
```

## Atualizar Meu Perfil

```http
PATCH /users/me
```

Corpo da requisição:

```json
{
  "name": "Novo nome"
}
```

Não é permitido trocar email por essa rota.

## Trocar Senha

```http
PATCH /users/me/password
```

Corpo da requisição:

```json
{
  "currentPassword": "senha-antiga",
  "newPassword": "senha-nova-com-10"
}
```

## Exclusão Lógica da Minha Conta

```http
DELETE /users/me
PATCH /users/me/soft-delete
```

## Admin

```http
GET /users?page=1&limit=10&emailVerified=true
GET /users/deleted?page=1&limit=10
GET /users/:id
PATCH /users/:id
DELETE /users/:id
PATCH /users/:id/soft-delete
PATCH /users/:id/restore
```
