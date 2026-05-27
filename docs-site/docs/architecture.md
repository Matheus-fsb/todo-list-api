---
sidebar_position: 5
---

# Arquitetura

O projeto segue uma separação simples por módulos.

```txt
src/modules
  auth
  users
  projects
  tasks
  validation-token
  notifications
```

Cada módulo tende a seguir:

```txt
routes -> controller -> service -> repository -> prisma
```

## Rotas

Registram rotas e middlewares.

Exemplo:

```txt
authMiddleware
roleMiddleware
asyncHandler
```

## Controladores

Lidam com HTTP:

- `req.params`
- `req.query`
- `req.body`
- status code
- resposta JSON

## Serviços

Contêm regra de negócio:

- autorização
- validação de estado
- hash de senha
- soft delete em cascata lógica
- disparo de notificações

## Repositórios

Concentram acesso ao banco com Prisma.

## Factories

As factories montam dependências:

```txt
src/shared/factories/servicesFactory.ts
src/shared/factories/controllersFactory.ts
```

Isso evita repetir criação de repositories/services em cada rota.
