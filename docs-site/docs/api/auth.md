---
sidebar_position: 2
---

# Módulo de Autenticação

Gerenciamento de sessões, renovação de tokens JWT e fluxo de verificação de endereços de e-mail.

---

## Login

Autentica o usuário e define os cookies JWT na sessão.

* **Endpoint**: `/auth/login`
* **Método**: <span className="badge-http badge-post">POST</span>
* **Autenticação Requerida**: Não
* **Rate Limiting**: Máximo de 5 tentativas por IP a cada 15 minutos.

### Corpo da Requisição (JSON)

| Campo | Tipo | Obrigatório | Descrição / Regras |
| :--- | :--- | :---: | :--- |
| `email` | `string` | Sim | E-mail cadastrado (deve ser válido). |
| `password` | `string` | Sim | Senha do usuário (mínimo de 10 caracteres). |

#### Exemplo de Payload
```json
{
  "email": "desenvolvedor@exemplo.com",
  "password": "senhaSegura123"
}
```

### Respostas

#### <span style={{color: 'green'}}>200 OK (Sucesso)</span>
Retorna os dados cadastrais básicos do usuário logado e define os cookies HTTP-only `accessToken` e `refreshToken`.
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "7a35606d-ef78-4ea8-b789-f5979ea2cf4b",
      "name": "Matheus Barros",
      "email": "desenvolvedor@exemplo.com",
      "role": "USER"
    },
    "accessToken": "eyJhbGciOi...",
    "refreshToken": "eyJhbGciOi..."
  }
}
```

#### <span style={{color: 'red'}}>401 Unauthorized (Erro de Credenciais)</span>
```json
{
  "success": false,
  "message": "Email or password invalid"
}
```

#### <span style={{color: 'red'}}>403 Forbidden (E-mail não verificado)</span>
```json
{
  "success": false,
  "message": "Email not verified"
}
```

---

## Renovar Token

Gera um novo par de tokens (`accessToken` e `refreshToken`) quando o token de acesso expirar.

* **Endpoint**: `/auth/refresh`
* **Método**: <span className="badge-http badge-post">POST</span>
* **Autenticação Requerida**: Sim (via cookie `refreshToken` ou header Authorization)

### Respostas

#### <span style={{color: 'green'}}>200 OK (Sucesso)</span>
```json
{
  "success": true,
  "message": "Tokens refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOi...",
    "refreshToken": "eyJhbGciOi..."
  }
}
```

#### <span style={{color: 'red'}}>401 Unauthorized (Token Inválido/Expirado)</span>
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

---

## Logout

Encerra a sessão ativa limpando os cookies HTTP-only de autenticação do cliente.

* **Endpoint**: `/auth/logout`
* **Método**: <span className="badge-http badge-post">POST</span>
* **Autenticação Requerida**: Não

### Respostas

#### <span style={{color: 'green'}}>200 OK (Sucesso)</span>
```json
{
  "success": true,
  "message": "Logout successful",
  "data": {}
}
```

---

## Verificar E-mail

Valida a conta do usuário por meio de um token temporário enviado por e-mail.

* **Endpoint**: `/auth/verify-email`
* **Método**: <span className="badge-http badge-get">GET</span>
* **Autenticação Requerida**: Não
* **Parâmetros de Query**:

| Parâmetro | Tipo | Obrigatório | Descrição |
| :--- | :--- | :---: | :--- |
| `token` | `string` | Sim | Token UUID gerado durante o cadastro do usuário. |

### Exemplo de URL
```txt
GET /auth/verify-email?token=8c468ea3-3b10-482a-9cb8-b0a340b1ea2f
```

### Respostas

#### <span style={{color: 'green'}}>200 OK (Sucesso)</span>
```json
{
  "success": true,
  "message": "Email verified successfully",
  "data": {}
}
```

#### <span style={{color: 'red'}}>400 Bad Request (Token Inválido ou Expirado)</span>
```json
{
  "success": false,
  "message": "Invalid or expired verification token"
}
```

---

## Reenviar Link de Verificação

Solicita o reenvio do token de verificação caso o anterior tenha expirado ou não tenha chegado.

* **Endpoint**: `/auth/resend-verification-token`
* **Método**: <span className="badge-http badge-post">POST</span>
* **Autenticação Requerida**: Não

### Corpo da Requisição (JSON)
```json
{
  "email": "desenvolvedor@exemplo.com"
}
```

### Respostas

#### <span style={{color: 'green'}}>200 OK (Sucesso)</span>
```json
{
  "success": true,
  "message": "Verification email sent",
  "data": {}
}
```

#### <span style={{color: 'red'}}>400 Bad Request (E-mail já verificado ou usuário inexistente)</span>
```json
{
  "success": false,
  "message": "Email already verified or user not found"
}
```
