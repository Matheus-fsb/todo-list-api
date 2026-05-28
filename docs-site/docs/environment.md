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

## Produção

Em produção, as variáveis devem ser configuradas no painel da plataforma de deploy, não no repositório.

Para a V1.0.0, o ambiente recomendado é:

```txt
Render -> API
Neon -> PostgreSQL
```

No Render, configure:

```env
NODE_ENV="production"
DATABASE_URL="postgresql://usuario:senha@host.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://usuario:senha@host.neon.tech/neondb?sslmode=require"

JWT_ACCESS_SECRET="valor_longo_e_seguro"
JWT_REFRESH_SECRET="outro_valor_longo_e_seguro"

JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

MAIL_HOST="live.smtp.mailtrap.io"
MAIL_PORT="587"
MAIL_USER="api"
MAIL_PASS="token_do_mailtrap"
MAIL_FROM="email_autorizado_no_mailtrap"

APP_URL="https://sua-api.onrender.com"
```

O `APP_URL` precisa apontar para a URL pública da API, porque ele é usado nos links de verificação de email.

## Segurança

Nunca versione `.env`.

O projeto já ignora esse arquivo no `.gitignore`.

Use secrets longos para JWT. Evite valores como:

```env
JWT_ACCESS_SECRET="sua_access_secret"
```

Se uma URL de banco, token de email ou secret JWT for exposto, gere novos valores antes do deploy.
