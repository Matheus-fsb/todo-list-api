---
sidebar_position: 6
---

# Testes

O projeto usa Jest e Supertest.

## Rodar Tudo

```bash
npm test
```

## Tipos de Teste

### Unitários

Arquivos:

```txt
tests/api-response.unit.test.ts
tests/notification.services.test.ts
```

Cobrem helpers e montagem/envio de notificações com mock.

### Testes de Serviço

Arquivos:

```txt
tests/users.service.test.ts
tests/soft-delete.services.test.ts
```

Cobrem regras de negócio com repositories e services mockados.

### E2E

Arquivo:

```txt
tests/tasks.e2e.test.ts
```

Cobertura principal:

- cadastro
- validação de email
- login
- perfil
- troca de senha
- projetos
- tarefas
- autorização
- soft delete
- restauração

## Banco nos Testes

O e2e usa o banco configurado em `DATABASE_URL`.

Antes de rodar:

```bash
docker compose up -d
npx prisma migrate dev
```
