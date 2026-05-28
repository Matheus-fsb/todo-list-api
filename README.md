# Todo List API 1.0.0

API REST para gerenciamento de usuários, projetos e tarefas, com autenticação JWT, verificação de email, controle de acesso por perfil, paginação, filtros, soft delete e testes automatizados.

## Stack

- Node.js + TypeScript
- Express
- PostgreSQL
- Prisma ORM
- JWT com cookies HTTP-only
- Zod para validação
- Nodemailer/Mailtrap para emails
- Jest + Supertest
- Docker Compose para banco local
- Docusaurus para documentação técnica

## Funcionalidades

- Cadastro, login, refresh token e logout.
- Verificação e reenvio de email.
- Perfis `USER` e `ADMIN`.
- CRUD de usuários, projetos e tarefas.
- Soft delete e restauração para usuários/projetos.
- Conclusão e reabertura de tarefas.
- Filtros por status, prioridade e email verificado.
- Paginação em rotas de listagem.
- Rate limit global e específico para autenticação.
- Pipeline de CI/CD com testes, build, migrations e deploy no Render.

## Requisitos

- Node.js 20+
- npm
- Docker Desktop

## Configuração local

Instale as dependências:

```bash
npm install
```

Suba o PostgreSQL local:

```bash
docker compose up -d
```

Crie um arquivo `.env` na raiz do projeto e configure as variáveis abaixo:

| Variável | Obrigatória | Exemplo local | Descrição |
| --- | --- | --- | --- |
| `PORT` | Não | `3000` | Porta em que a API será iniciada. |
| `DATABASE_URL` | Sim | `url` | URL de conexão usada pelo Prisma para acessar o PostgreSQL. |
| `DIRECT_URL` | Sim | `url` | URL direta do banco, usada em migrations e operações administrativas do Prisma. |
| `JWT_ACCESS_SECRET` | Sim | `valor_longo_e_aleatorio` | Chave usada para assinar o token de acesso. |
| `JWT_REFRESH_SECRET` | Sim | `outro_valor_longo_e_aleatorio` | Chave usada para assinar o token de renovação. |
| `JWT_ACCESS_EXPIRES_IN` | Sim | `15m` | Tempo de expiração do access token. |
| `JWT_REFRESH_EXPIRES_IN` | Sim | `7d` | Tempo de expiração do refresh token. |
| `MAIL_HOST` | Não | `live.smtp.mailtrap.io` | Host SMTP usado para envio de emails. |
| `MAIL_PORT` | Não | `587` | Porta SMTP. |
| `MAIL_USER` | Não | `api` | Usuário SMTP. |
| `MAIL_PASS` | Não | `seu_token_mailtrap` | Senha ou token SMTP. |
| `MAIL_FROM` | Sim | `hello@demomailtrap.co` | Remetente usado nos emails enviados pela API. |
| `MAILTRAP_API_TOKEN` | Sim | `token_api_do_mailtrap` | Token da API do Mailtrap, útil em produção quando SMTP não estiver disponível. |
| `APP_URL` | Sim | `url da api` | URL base usada para montar links, como verificação de email. |

Rode as migrations e gere o Prisma Client:

```bash
npx prisma migrate dev
npx prisma generate
```

Inicie a API em desenvolvimento:

```bash
npm run dev
```

Por padrão, a API fica disponível em:

```txt
http://localhost:3000
```

## Scripts

```bash
npm run dev          # inicia a API com hot reload
npm run build        # compila TypeScript
npm start            # roda a build de produção
npm test             # executa testes
npm run format       # formata o projeto
npm run format:check # valida formatação
npm run docs-start   # inicia a documentação local
npm run docs-build   # compila a documentação
```

## Rotas principais

### Autenticação

```http
POST /auth/login
POST /auth/refresh
POST /auth/logout
GET  /auth/verify-email?token=<token>
POST /auth/resend-verification-token
```

### Usuários

```http
POST   /users
GET    /users/me
PATCH  /users/me
PATCH  /users/me/password
DELETE /users/me
PATCH  /users/me/soft-delete
```

Rotas administrativas:

```http
GET    /users?page=1&limit=10
GET    /users/deleted?page=1&limit=10
GET    /users/:id
PATCH  /users/:id
DELETE /users/:id
PATCH  /users/:id/soft-delete
PATCH  /users/:id/restore
```

### Projetos

```http
POST  /projects/me
GET   /projects/me?page=1&limit=10
GET   /projects/deleted?page=1&limit=10
GET   /projects/:id
GET   /projects/:id/tasks?page=1&limit=10
PATCH /projects/:id
PATCH /projects/:id/soft-delete
PATCH /projects/:id/restore
```

### Tarefas

```http
POST   /tasks/me
GET    /tasks/me?page=1&limit=10
GET    /tasks/overdue?page=1&limit=10
GET    /tasks/:id
PUT    /tasks/:id
PATCH  /tasks/:id/complete
PATCH  /tasks/:id/reopen
PATCH  /tasks/:id
DELETE /tasks/:id
```

Rota administrativa:

```http
GET /tasks/projects/:projectId
```

## Autenticação

A API autentica por cookies HTTP-only:

```txt
accessToken
refreshToken
```

Também é aceito token no header:

```txt
Authorization: Bearer <token>
```

O login só é permitido para usuários com email verificado.

## Respostas

Formato padrão de sucesso:

```json
{
  "success": true,
  "message": "Mensagem",
  "data": {}
}
```

Formato padrão de erro:

```json
{
  "success": false,
  "message": "Mensagem de erro"
}
```

Resposta paginada:

```json
{
  "items": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 0,
    "totalPages": 0
  }
}
```

## Testes

Os testes usam Jest e Supertest:

```bash
npm test
```

No CI, o banco PostgreSQL sobe como service do GitHub Actions, as migrations são aplicadas com Prisma e depois os testes e builds são executados.

## Documentação

A documentação completa fica em `docs-site` e cobre configuração local, variáveis de ambiente, banco com Docker, módulos da API, deploy, CI/CD, testes e operações principais.

```bash
npm run docs:start
```

## Deploy

O projeto está preparado para:

```txt
Render Web Service -> API Node/Express
Neon PostgreSQL     -> Banco de dados
```

Build command no Render:

```bash
npm install && npx prisma generate && npm run build
```

Start command:

```bash
npm start
```

Secrets esperados no GitHub Actions para produção:

```txt
PRODUCTION_DATABASE_URL
PRODUCTION_DIRECT_URL
RENDER_DEPLOY_HOOK_URL
```

As variáveis sensíveis devem ficar no ambiente da plataforma de deploy. Não versione `.env`.

## Licença

Este projeto está sob a licença MIT.
Todos os direitos reservados a Matheus Barros
