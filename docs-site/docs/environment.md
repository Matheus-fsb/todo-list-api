---
sidebar_position: 3
---

# Variáveis de Ambiente

Exemplo para desenvolvimento local:

```env
PORT=3000

DATABASE_URL="postgresql://todo_user:todo_password@localhost:5432/todo_list_api"
DIRECT_URL="postgresql://todo_user:todo_password@localhost:5432/todo_list_api"

JWT_ACCESS_SECRET="use_um_valor_longo_e_aleatorio"
JWT_REFRESH_SECRET="use_outro_valor_longo_e_aleatorio"

JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

MAIL_HOST="live.smtp.mailtrap.io"
MAIL_PORT="587"
MAIL_USER="api"
MAIL_PASS="seu_token_mailtrap"
MAIL_FROM="hello@demomailtrap.co"

APP_URL="http://localhost:3000"
```

## Segurança

Nunca versione `.env`.

O projeto já ignora esse arquivo no `.gitignore`.

Use secrets longos para JWT. Evite valores como:

```env
JWT_ACCESS_SECRET="sua_access_secret"
```

