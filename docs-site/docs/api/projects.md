---
sidebar_position: 4
---

# Projetos

## Criar Projeto

```http
POST /projects/me
```

Corpo da requisição:

```json
{
  "name": "Estudos",
  "description": "Projeto para organizar estudos"
}
```

O dono do projeto vem do token.

## Meus Projetos

```http
GET /projects/me?page=1&limit=10
```

## Buscar Projeto

```http
GET /projects/:id
```

Permitido para dono ou admin.

## Atualizar Projeto

```http
PATCH /projects/:id
```

## Exclusão Lógica

```http
PATCH /projects/:id/soft-delete
```

## Restauração

```http
PATCH /projects/:id/restore
```

## Projetos Deletados

```http
GET /projects/deleted?page=1&limit=10
```

Usuário comum vê os próprios. Admin pode ver todos.

## Tarefas do Projeto

```http
GET /projects/:id/tasks?page=1&limit=10&status=PENDING&priority=HIGH
```
