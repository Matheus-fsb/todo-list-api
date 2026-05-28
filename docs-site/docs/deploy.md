---
sidebar_position: 9
---

# Deploy V1.0.0

A V1.0.0 da Todo List API foi preparada para deploy usando:

```txt
Render Web Service -> API Node/Express
Neon PostgreSQL -> Banco de dados
```

No deploy, o banco fica separado da aplicação. Isso é importante porque a API pode ser recriada a cada deploy, enquanto os dados precisam continuar persistidos no banco.

## Render

No Render, crie um serviço do tipo:

```txt
Web Service
```

Configuração recomendada:

```txt
Runtime: Node
Branch: main
Auto-Deploy: Disabled
```

O Auto-Deploy fica desativado porque o deploy é disparado pela pipeline do GitHub Actions usando o Deploy Hook do Render.

Build Command:

```bash
npm install && npx prisma generate && npm run build
```

Start Command:

```bash
npm start
```

O script `npm start` executa:

```bash
node dist/src/server.js
```

## Neon

No Neon, crie um projeto PostgreSQL e copie a connection string.

Use a URL do Neon nas variáveis:

```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
```

As migrations devem ser aplicadas no banco de produção com:

```bash
npx prisma migrate deploy
```

## Variáveis No Render

Configure no painel do Render:

```env
NODE_ENV="production"
DATABASE_URL="url_do_neon"
DIRECT_URL="url_do_neon"
JWT_ACCESS_SECRET="valor_longo_e_seguro"
JWT_REFRESH_SECRET="outro_valor_longo_e_seguro"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
MAIL_HOST="live.smtp.mailtrap.io"
MAIL_PORT="587"
MAIL_USER="api"
MAIL_PASS="token_do_mailtrap"
MAIL_FROM="email_autorizado"
MAILTRAP_API_TOKEN="token_api_do_mailtrap"
APP_URL="https://sua-api.onrender.com"
```

O Render define `PORT` automaticamente. A API já lê `process.env.PORT`.

Para produção no Render Free, use `MAILTRAP_API_TOKEN`. O envio por SMTP nas portas 25, 465 e 587 pode sofrer bloqueio de rede em serviços gratuitos.

## Deploy Hook Do Render

No Web Service do Render, gere um Deploy Hook e salve a URL no GitHub como secret:

```txt
RENDER_DEPLOY_HOOK_URL
```

O GitHub Actions usa esse hook para publicar a API depois que os testes, builds e migrations passam.

## Secrets No GitHub

Além das variáveis do Render, configure no GitHub:

```txt
PRODUCTION_DATABASE_URL
PRODUCTION_DIRECT_URL
RENDER_DEPLOY_HOOK_URL
```

Esses secrets ficam em:

```txt
Settings -> Secrets and variables -> Actions
```

## Checklist Antes De Publicar

- Fazer merge da `develop` na `main` com CI verde.
- Configurar variáveis de ambiente no Render.
- Configurar secrets de produção no GitHub.
- Usar secrets fortes para JWT.
- Usar senha/token rotacionados do Neon e Mailtrap.
- Deixar o CD rodar `npx prisma migrate deploy` no banco do Neon.
- Testar `GET /` na URL pública do Render.
- Testar cadastro, verificação de email e login.

## URL Pública

Depois do deploy, registre a URL aqui:

```txt
https://sua-api.onrender.com
```
