---
sidebar_position: 1
---

# Visão Geral da API

Esta seção descreve os padrões de design, formatos de resposta e convenções gerais adotadas na **Todo List API**.

## URL Base

Ao rodar o projeto localmente, a API estará acessível no endereço:

```txt
http://localhost:3000
```

---

## Padrão de Respostas

Todas as respostas da API são retornadas no formato JSON e seguem uma estrutura padronizada para facilitar a integração.

### Respostas de Sucesso
Retornam status HTTP na faixa `2xx` com a chave `success: true` e os dados envelopados na chave `data`:

```json
{
  "success": true,
  "message": "Operação realizada com sucesso",
  "data": {
    "id": "73c683b5-4a11-4545-9856-fb98a9668d83",
    "name": "Projeto Alpha"
  }
}
```

### Respostas de Erro
Retornam status HTTP na faixa `4xx` ou `5xx` com a chave `success: false` e a descrição do erro:

```json
{
  "success": false,
  "message": "E-mail ou senha inválidos"
}
```

#### Erros de Validação (Zod)
Quando uma requisição falha nas regras de validação estrutural (Zod), a API retorna status `400 Bad Request` com o detalhamento dos campos na chave `errors`:

```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "code": "too_small",
      "minimum": 10,
      "type": "string",
      "inclusive": true,
      "exact": false,
      "message": "String must contain at least 10 character(s)",
      "path": ["password"]
    }
  ]
}
```

---

## Autenticação

A segurança das rotas é mantida através de tokens JWT (JSON Web Tokens). A API suporta dois mecanismos de entrega do token:

1. **Cookies HTTP-Only (Recomendado para Web)**:
   * Ao fazer login, a API define os cookies `accessToken` (tempo de vida curto, ex: 15min) e `refreshToken` (tempo de vida longo, ex: 7 dias).
   * Os cookies possuem a flag `HttpOnly`, impedindo o acesso via scripts do lado do cliente (proteção contra XSS).
2. **Bearer Token (Recomendado para Mobile ou Clients Externos)**:
   * O cliente envia o token de acesso no cabeçalho HTTP:
     ```txt
     Authorization: Bearer <seu_access_token>
     ```

:::warning[Verificação de E-mail]
O login só é permitido para usuários que realizaram a verificação de e-mail por meio do link/token enviado no momento do cadastro.
:::

---

## Paginação

Rotas de listagem (como usuários, projetos e tarefas) são paginadas por padrão.

### Parâmetros de Query

| Parâmetro | Tipo | Padrão | Descrição |
| :--- | :--- | :--- | :--- |
| `page` | `number` | `1` | O número da página a ser retornada. |
| `limit` | `number` | `10` | Quantidade de itens por página. |

### Estrutura de Resposta Paginada

```json
{
  "items": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "totalPages": 5
  }
}
```

---

## Códigos de Status HTTP

A API utiliza códigos de status HTTP padrão para indicar o sucesso ou fracasso das requisições:

| Status | Descrição | Cenário Comum |
| :--- | :--- | :--- |
| `200 OK` | Sucesso completo | Busca, listagem ou edição bem-sucedida. |
| `201 Created` | Criado com sucesso | Criação de recurso (ex: criar usuário, projeto, tarefa). |
| `400 Bad Request` | Requisição inválida | Erros de validação nos campos do payload (Zod). |
| `401 Unauthorized` | Não autenticado | Token ausente, inválido ou expirado. |
| `403 Forbidden` | Não autorizado | Ação não permitida para o perfil (ex: não-Admin acessando rota admin). |
| `404 Not Found` | Recurso não encontrado | O ID fornecido não corresponde a nenhum registro ativo. |
| `409 Conflict` | Conflito de estado | Tentativa de cadastrar um e-mail que já está em uso. |
| `500 Internal Server Error` | Erro interno do servidor | Falha inesperada no servidor. |
