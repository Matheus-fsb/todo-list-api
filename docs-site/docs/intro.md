---
sidebar_position: 1
---

# Todo List API

Esta documentação apresenta a **Todo List API**, uma API REST criada por **Matheus** para organizar usuários, projetos e tarefas em um fluxo completo de produtividade.

O objetivo do projeto é ir além de um CRUD simples. A API foi pensada como uma base realista para praticar e demonstrar conceitos importantes de backend: autenticação, autorização, verificação de email, soft delete, paginação, filtros, notificações, testes automatizados, Docker e documentação técnica.

## Proposta do Projeto

A Todo List API resolve um problema direto: permitir que um usuário crie sua conta, valide o email, faça login com segurança, organize seus projetos e gerencie tarefas dentro desses projetos.

Na prática, o sistema serve como:

- Uma API de estudos com estrutura próxima de um projeto profissional.
- Uma base para evoluir funcionalidades de produtividade.
- Um portfólio técnico para demonstrar organização de código, segurança, testes e documentação.
- Um projeto backend completo para treinar arquitetura modular com TypeScript.

## Autoria

Este projeto foi desenvolvido por **Matheus**.

Todos os direitos reservados a **Matheus**. O código, a documentação e a organização do sistema fazem parte do desenvolvimento e evolução deste projeto.

## Tecnologias

O sistema usa:

- Node.js com Express
- TypeScript
- Prisma
- PostgreSQL
- Docker para banco local
- JWT em cookies HTTP-only
- Nodemailer para envio de emails
- Jest e Supertest para testes

## Fluxo Principal do Usuário

```txt
Usuário
  -> cria conta
  -> recebe email de verificação
  -> valida email
  -> faz login
  -> cria projetos
  -> cria tarefas dentro dos projetos
```

## Modelo de Domínio

```txt
User
  -> Project
    -> Task
```

Uma task sempre pertence a um projeto. Um projeto sempre pertence a um usuário.

## O Que Esta Documentação Cobre

Aqui você encontra:

- Como configurar o ambiente local.
- Como rodar o banco com Docker.
- Como configurar variáveis de ambiente.
- Como a arquitetura do projeto está organizada.
- Como consumir as rotas de auth, users, projects e tasks.
- Como funcionam notificações, testes e operações principais.
