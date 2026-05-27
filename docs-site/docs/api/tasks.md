---
sidebar_position: 5
---

# Tarefas

Toda tarefa pertence obrigatoriamente a um projeto.

## Criar Tarefa

```http
POST /tasks/me
```

Corpo da requisição:

```json
{
  "title": "Estudar testes",
  "description": "Cobrir fluxos principais",
  "priority": "HIGH",
  "projectId": "uuid-do-projeto",
  "dueDate": "2026-06-01T12:00:00.000Z"
}
```

O service valida se o projeto pertence ao usuário autenticado.

## Minhas Tarefas

```http
GET /tasks/me?page=1&limit=10&status=PENDING&priority=HIGH
```

## Tarefas Atrasadas

```http
GET /tasks/overdue?page=1&limit=10&priority=LOW
```

## Buscar Tarefa

```http
GET /tasks/:id
```

## Atualizar Tarefa

```http
PUT /tasks/:id
```

## Completar

```http
PATCH /tasks/:id/complete
```

## Reabrir

```http
PATCH /tasks/:id/reopen
```

## Exclusão Lógica

```http
PATCH /tasks/:id
```

## Exclusão Definitiva

```http
DELETE /tasks/:id
```

## Admin

```http
GET /tasks/projects/:projectId
```
