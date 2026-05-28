---
sidebar_position: 8
---

# CI/CD

CI/CD é uma forma de automatizar verificações e entregas do projeto.

## O Que é CI

CI significa **Continuous Integration**, ou integração contínua.

Na prática, sempre que o código é enviado para o GitHub, a CI roda uma sequência de comandos para verificar se o projeto continua funcionando.

Neste projeto, a CI executa:

```txt
instalar dependências
subir PostgreSQL temporário
gerar Prisma Client
rodar migrations
rodar testes
compilar API
compilar documentação
```

Isso evita depender apenas do resultado local da máquina de desenvolvimento.

## O Que é CD

CD pode significar **Continuous Delivery** ou **Continuous Deployment**.

Ele entra depois da CI. Quando os testes e builds passam, o CD pode preparar ou publicar o sistema automaticamente.

Exemplos:

- publicar a documentação;
- fazer deploy da API;
- executar comandos de produção;
- preparar uma imagem Docker.

Neste projeto, a pipeline executa CI em pushes e pull requests. O CD roda apenas quando há `push` na branch `main`.

## Workflow Criado

O workflow fica em:

```txt
.github/workflows/ci.yml
```

Ele roda em:

- `push` para `main`;
- `push` para `master`;
- `push` para `develop`;
- pull requests.

## Banco na CI

O GitHub Actions sobe um PostgreSQL temporário usando:

```txt
postgres:16
```

Esse banco existe apenas enquanto a pipeline está rodando. Depois que a execução termina, ele é descartado.

## Variáveis de Ambiente

As variáveis usadas na CI ficam no próprio arquivo do workflow porque são valores de teste.

Para deploy real, secrets sensíveis devem ficar no GitHub em:

```txt
Settings -> Secrets and variables -> Actions
```

Nunca coloque valores reais do `.env` no repositório.

## Como Saber Se Passou

No GitHub, abra:

```txt
Actions -> CI
```

Se tudo estiver verde, significa que:

- os testes passaram;
- a API compilou;
- a documentação compilou;
- as migrations funcionaram no banco temporário.

Se alguma etapa ficar vermelha, clique nela para ver o log do erro.

## Relação Com O Deploy

O fluxo recomendado para a V1.0.0 é:

```txt
develop
  -> pull request para main
  -> CI verde
  -> merge na main
  -> migrations no Neon
  -> deploy no Render via Deploy Hook
```

O deploy de produção só roda quando o evento é:

```txt
push em main
```

## Secrets Necessários

Configure estes secrets no GitHub:

```txt
Settings -> Secrets and variables -> Actions -> New repository secret
```

Secrets usados pelo CD:

```txt
PRODUCTION_DATABASE_URL
PRODUCTION_DIRECT_URL
RENDER_DEPLOY_HOOK_URL
```

`PRODUCTION_DATABASE_URL` e `PRODUCTION_DIRECT_URL` devem apontar para o banco do Neon.

`RENDER_DEPLOY_HOOK_URL` vem do Render, na seção de deploy hook do Web Service.

## Etapas Do CD

Quando a `main` recebe push, o job de produção:

```txt
instala dependências
gera Prisma Client
roda migrations no Neon
dispara deploy no Render
```

Com esse fluxo, o Render não precisa fazer deploy automático em todo push sozinho. O GitHub Actions vira a porta de entrada do deploy.
