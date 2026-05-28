---
sidebar_position: 3
---

# Módulo de Usuários

Gerenciamento de contas de usuários, perfis, redefinição de credenciais e operações administrativas de usuários.

---

## Criar Conta

Registra um novo usuário no sistema. No cadastro, a conta permanece com `emailVerified: false` e um e-mail com token de validação é disparado.

* **Endpoint**: `/users`
* **Método**: <span className="badge-http badge-post">POST</span>
* **Autenticação Requerida**: Não

### Corpo da Requisição (JSON)

| Campo | Tipo | Obrigatório | Regras |
| :--- | :--- | :---: | :--- |
| `name` | `string` | Sim | Nome completo do usuário. |
| `email` | `string` | Sim | Endereço de e-mail exclusivo. |
| `password` | `string` | Sim | Senha (mínimo de 10 caracteres). |

#### Exemplo de Payload
```json
{
  "name": "Matheus Barros",
  "email": "matheus@exemplo.com",
  "password": "senhaSuperSegura123"
}
```

### Respostas

#### <span style={{color: 'green'}}>201 Created (Sucesso)</span>
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": "7a35606d-ef78-4ea8-b789-f5979ea2cf4b",
    "name": "Matheus Barros",
    "email": "matheus@exemplo.com",
    "emailVerified": false,
    "emailVerifiedAt": null
  }
}
```

#### <span style={{color: 'red'}}>409 Conflict (E-mail em uso)</span>
```json
{
  "success": false,
  "message": "User already exists"
}
```

---

## Obter Meu Perfil

Recupera os dados do usuário autenticado no momento.

* **Endpoint**: `/users/me`
* **Método**: <span className="badge-http badge-get">GET</span>
* **Autenticação Requerida**: Sim

### Respostas

#### <span style={{color: 'green'}}>200 OK (Sucesso)</span>
```json
{
  "success": true,
  "message": "User profile retrieved",
  "data": {
    "id": "7a35606d-ef78-4ea8-b789-f5979ea2cf4b",
    "name": "Matheus Barros",
    "email": "matheus@exemplo.com",
    "emailVerified": true,
    "emailVerifiedAt": "2026-05-28T14:20:00.000Z"
  }
}
```

---

## Atualizar Meu Perfil

Modifica as informações cadastrais do perfil do próprio usuário.

* **Endpoint**: `/users/me`
* **Método**: <span className="badge-http badge-patch">PATCH</span>
* **Autenticação Requerida**: Sim

### Corpo da Requisição (JSON)

| Campo | Tipo | Obrigatório | Descrição |
| :--- | :--- | :---: | :--- |
| `name` | `string` | Não | Novo nome a ser atualizado. |

:::note[Alteração de E-mail]
Não é permitido alterar o endereço de e-mail através desta rota para preservar a integridade da verificação da conta.
:::

---

## Alterar Minha Senha

Atualiza a senha de segurança do usuário logado mediante validação da senha atual.

* **Endpoint**: `/users/me/password`
* **Método**: <span className="badge-http badge-patch">PATCH</span>
* **Autenticação Requerida**: Sim

### Corpo da Requisição (JSON)

```json
{
  "currentPassword": "senhaAntigaAqui",
  "newPassword": "novaSenhaComPeloMenos10Digitos"
}
```

### Respostas

#### <span style={{color: 'green'}}>200 OK (Sucesso)</span>
```json
{
  "success": true,
  "message": "Password updated successfully",
  "data": {}
}
```

#### <span style={{color: 'red'}}>401 Unauthorized (Senha atual incorreta)</span>
```json
{
  "success": false,
  "message": "Current password invalid"
}
```

---

## Exclusão Lógica da Conta (Soft Delete)

Desativa temporariamente a conta do próprio usuário. Seus dados e projetos são ocultados do sistema, mas permanecem no banco com a tag `deletedAt` preenchida.

* **Endpoint**: `/users/me/soft-delete` ou `/users/me`
* **Método**: <span className="badge-http badge-patch">PATCH</span> / <span className="badge-http badge-delete">DELETE</span>
* **Autenticação Requerida**: Sim

---

## Operações Administrativas (Apenas Perfis `ADMIN`)

Esses endpoints exigem privilégios elevados. O middleware de controle de perfis (`roleMiddleware`) rejeitará requisições de perfil `USER` com status `403 Forbidden`.

### Listar Usuários Ativos

* **Endpoint**: `/users`
* **Método**: <span className="badge-http badge-get">GET</span>
* **Parâmetros de Query**: Suporta paginação (`page`, `limit`) e filtro por `emailVerified` (`true` / `false`).

### Listar Usuários Desativados (Soft Deleted)

* **Endpoint**: `/users/deleted`
* **Método**: <span className="badge-http badge-get">GET</span>

### Buscar Usuário Específico por ID

* **Endpoint**: `/users/:id`
* **Método**: <span className="badge-http badge-get">GET</span>

### Atualizar Perfil de Outro Usuário

* **Endpoint**: `/users/:id`
* **Método**: <span className="badge-http badge-patch">PATCH</span>

### Deletar Usuário Permanentemente (Hard Delete)

* **Endpoint**: `/users/:id`
* **Método**: <span className="badge-http badge-delete">DELETE</span>

### Desativar Usuário de Forma Lógica (Soft Delete)

* **Endpoint**: `/users/:id/soft-delete`
* **Método**: <span className="badge-http badge-patch">PATCH</span>

### Restaurar Usuário Desativado

* **Endpoint**: `/users/:id/restore`
* **Método**: <span className="badge-http badge-patch">PATCH</span>

```json
{
  "success": true,
  "message": "User restored successfully",
  "data": {
    "id": "7a35606d-ef78...",
    "deletedAt": null
  }
}
```
