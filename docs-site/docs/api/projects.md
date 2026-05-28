---
sidebar_position: 4
---

# Módulo de Projetos

Gerenciamento de projetos que agrupam tarefas e organizam o escopo de trabalho do usuário.

---

## Criar Projeto

Cria um novo projeto vinculado ao usuário autenticado.

* **Endpoint**: `/projects/me`
* **Método**: <span className="badge-http badge-post">POST</span>
* **Autenticação Requerida**: Sim

### Corpo da Requisição (JSON)

| Campo | Tipo | Obrigatório | Descrição / Regras |
| :--- | :--- | :---: | :--- |
| `name` | `string` | Sim | Nome descritivo do projeto. |
| `description` | `string` | Não | Breve descrição sobre as metas do projeto. |

#### Exemplo de Payload
```json
{
  "name": "Desenvolvimento do App",
  "description": "Tarefas relativas ao desenvolvimento da versão móvel do produto."
}
```

### Respostas

#### <span style={{color: 'green'}}>201 Created (Sucesso)</span>
```json
{
  "success": true,
  "message": "Project created successfully",
  "data": {
    "id": "2b314e1f-7b0b-4786-9a2c-d67b25e1cf4f",
    "name": "Desenvolvimento do App",
    "description": "Tarefas relativas ao desenvolvimento da versão móvel do produto.",
    "userId": "7a35606d-ef78-4ea8-b789-f5979ea2cf4b",
    "createdAt": "2026-05-28T14:20:00.000Z",
    "updatedAt": "2026-05-28T14:20:00.000Z",
    "deletedAt": null
  }
}
```

---

## Listar Meus Projetos

Recupera uma lista paginada de todos os projetos ativos associados ao usuário logado.

* **Endpoint**: `/projects/me`
* **Método**: <span className="badge-http badge-get">GET</span>
* **Autenticação Requerida**: Sim
* **Query Params**: Suporta `page` e `limit`.

---

## Obter Detalhes do Projeto

Busca as informações completas de um projeto específico.

* **Endpoint**: `/projects/:id`
* **Método**: <span className="badge-http badge-get">GET</span>
* **Autenticação Requerida**: Sim

:::info[Restrição de Acesso]
A API valida se o usuário autenticado é o criador do projeto ou possui perfil `ADMIN`. Caso contrário, retorna `403 Forbidden`.
:::

---

## Listar Tarefas de um Projeto

Busca todas as tarefas associadas a um determinado projeto.

* **Endpoint**: `/projects/:id/tasks`
* **Método**: <span className="badge-http badge-get">GET</span>
* **Autenticação Requerida**: Sim
* **Query Params**: Suporta paginação (`page`, `limit`).

---

## Atualizar Projeto

Modifica o nome ou a descrição de um projeto existente.

* **Endpoint**: `/projects/:id`
* **Método**: <span className="badge-http badge-patch">PATCH</span>
* **Autenticação Requerida**: Sim

```json
{
  "name": "Novo Nome do App",
  "description": "Descrição atualizada para refletir as novas prioridades."
}
```

---

## Exclusão Lógica de Projeto (Soft Delete)

Desativa o projeto e **todas as tarefas vinculadas a ele de forma lógica** (Soft Delete em cascata), preenchendo o campo `deletedAt` com a data atual.

* **Endpoint**: `/projects/:id/soft-delete`
* **Método**: <span className="badge-http badge-patch">PATCH</span>
* **Autenticação Requerida**: Sim

---

## Restaurar Projeto Desativado

Restaura o projeto marcado como removido de forma lógica, definindo `deletedAt` como `null`.

* **Endpoint**: `/projects/:id/restore`
* **Método**: <span className="badge-http badge-patch">PATCH</span>
* **Autenticação Requerida**: Sim

---

## Listar Projetos Excluídos

Obtém a lista paginada de projetos desativados logicamente.

* **Endpoint**: `/projects/deleted`
* **Método**: <span className="badge-http badge-get">GET</span>
* **Autenticação Requerida**: Sim

:::note[Controle de Escopo]
Usuários comuns (`USER`) visualizam apenas seus próprios projetos excluídos. Administradores (`ADMIN`) visualizam todos os projetos marcados como desativados no sistema.
:::
