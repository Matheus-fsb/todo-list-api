---
sidebar_position: 5
---

# Módulo de Tarefas

Gerenciamento de tarefas pertencentes aos projetos. Inclui controle de status, prioridade, prazos e alertas de tarefas atrasadas.

---

## Criar Tarefa

Associa uma nova tarefa a um projeto ativo do usuário.

* **Endpoint**: `/tasks/me` ou `/tasks`
* **Método**: <span className="badge-http badge-post">POST</span>
* **Autenticação Requerida**: Sim

### Corpo da Requisição (JSON)

| Campo | Tipo | Obrigatório | Regras |
| :--- | :--- | :---: | :--- |
| `title` | `string` | Sim | Título da tarefa (de 3 a 100 caracteres). |
| `description` | `string` | Não | Detalhes adicionais (máximo 500 caracteres). |
| `status` | `enum` | Não | Estado inicial: `PENDING` (padrão), `IN_PROGRESS`, `COMPLETED`. |
| `priority` | `enum` | Não | Prioridade da tarefa: `LOW`, `MEDIUM`, `HIGH`. |
| `projectId` | `string` | Sim | UUID do projeto que conterá a tarefa. |
| `dueDate` | `date` | Não | Data de vencimento da tarefa (não pode ser no passado). |

#### Exemplo de Payload
```json
{
  "title": "Configurar Servidor de Emails",
  "description": "Configurar credenciais do Mailtrap no ambiente de produção.",
  "status": "PENDING",
  "priority": "HIGH",
  "projectId": "2b314e1f-7b0b-4786-9a2c-d67b25e1cf4f",
  "dueDate": "2026-12-31T23:59:59.000Z"
}
```

### Respostas

#### <span style={{color: 'green'}}>201 Created (Sucesso)</span>
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "id": "e45cf56f-870b-411a-821f-c023d8c11e3b",
    "title": "Configurar Servidor de Emails",
    "description": "Configurar credenciais do Mailtrap no ambiente de produção.",
    "status": "PENDING",
    "priority": "HIGH",
    "projectId": "2b314e1f-7b0b-4786-9a2c-d67b25e1cf4f",
    "dueDate": "2026-12-31T23:59:59.000Z",
    "completedAt": null,
    "createdAt": "2026-05-28T14:20:00.000Z",
    "updatedAt": "2026-05-28T14:20:00.000Z",
    "deletedAt": null
  }
}
```

#### <span style={{color: 'red'}}>400 Bad Request (Data de Vencimento Inválida)</span>
```json
{
  "success": false,
  "message": "Due date cannot be in the past"
}
```

---

## Listar Minhas Tarefas

Recupera uma lista paginada de todas as tarefas ativas pertencentes aos projetos do usuário autenticado.

* **Endpoint**: `/tasks/me`
* **Método**: <span className="badge-http badge-get">GET</span>
* **Autenticação Requerida**: Sim
* **Query Params**: Suporta `page` e `limit`.

---

## Listar Tarefas Atrasadas

Retorna uma lista paginada de tarefas ativas do usuário que estão com a data `dueDate` no passado e o status não concluído.

* **Endpoint**: `/tasks/overdue`
* **Método**: <span className="badge-http badge-get">GET</span>
* **Autenticação Requerida**: Sim

---

## Obter Detalhes da Tarefa

Busca as informações completas de uma tarefa específica.

* **Endpoint**: `/tasks/:id`
* **Método**: <span className="badge-http badge-get">GET</span>
* **Autenticação Requerida**: Sim

---

## Atualizar Tarefa (Geral)

Permite uma atualização completa das propriedades da tarefa (título, descrição, status, prioridade e vencimento).

* **Endpoint**: `/tasks/:id`
* **Método**: <span className="badge-http badge-put">PUT</span>
* **Autenticação Requerida**: Sim

:::note[Conclusão Automática]
Se o status for atualizado para `COMPLETED`, o sistema definirá automaticamente a data `completedAt` como o horário atual. Se alterado de volta, a data será zerada (`null`).
:::

---

## Concluir Tarefa

Marca uma tarefa rapidamente como concluída.

* **Endpoint**: `/tasks/:id/complete`
* **Método**: <span className="badge-http badge-patch">PATCH</span>
* **Autenticação Requerida**: Sim

### Resposta (Sucesso)
```json
{
  "success": true,
  "message": "Task completed successfully",
  "data": {
    "id": "e45cf56f-870b...",
    "status": "COMPLETED",
    "completedAt": "2026-05-28T14:25:00.000Z"
  }
}
```

---

## Reabrir Tarefa

Altera o status de uma tarefa concluída de volta para `PENDING`.

* **Endpoint**: `/tasks/:id/reopen`
* **Método**: <span className="badge-http badge-patch">PATCH</span>
* **Autenticação Requerida**: Sim

---

## Excluir Tarefa Logicamente (Soft Delete)

Marca a tarefa como excluída sem removê-la fisicamente do banco de dados imediatamente.

* **Endpoint**: `/tasks/:id`
* **Método**: <span className="badge-http badge-patch">PATCH</span>
* **Autenticação Requerida**: Sim

---

## Excluir Tarefa Permanentemente (Hard Delete)

Remove definitivamente o registro da tarefa do banco de dados.

* **Endpoint**: `/tasks/:id`
* **Método**: <span className="badge-http badge-delete">DELETE</span>
* **Autenticação Requerida**: Sim

---

## Buscar Tarefas por Projeto (Apenas Perfis `ADMIN`)

Busca todas as tarefas de um projeto por ID sem verificar propriedade de usuário.

* **Endpoint**: `/tasks/projects/:projectId`
* **Método**: <span className="badge-http badge-get">GET</span>
* **Autenticação Requerida**: Sim (Apenas `ADMIN`)
