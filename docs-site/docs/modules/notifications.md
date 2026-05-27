---
sidebar_position: 1
---

# Notificações

As notificações foram separadas por contexto.

```txt
NotificationService
  -> envio base

UserNotificationService
  -> verificação de conta
  -> boas-vindas

ProjectNotificationService
  -> projeto criado
  -> projeto deletado
  -> projeto restaurado

TaskNotificationService
  -> task criada
  -> task concluída
  -> task reaberta
  -> task vencendo hoje
  -> task atrasada
```

## Testes

Em ambiente de teste, `MailService` não dispara email real.

```ts
if (process.env.NODE_ENV === 'test') {
  return Promise.resolve({ accepted: [mail.to], rejected: [] });
}
```

## Mailtrap

Para desenvolvimento real com Mailtrap SMTP:

```env
MAIL_HOST="live.smtp.mailtrap.io"
MAIL_PORT="587"
MAIL_USER="api"
MAIL_PASS="token"
MAIL_FROM="hello@demomailtrap.co"
```

