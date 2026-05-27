---
sidebar_position: 7
---

# Operação

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
