import { describe, expect, it, jest } from '@jest/globals';
import { ProjectNotificationService } from '../src/modules/notifications/notification-project.service.js';
import { TaskNotificationService } from '../src/modules/notifications/notification-task.service.js';
import { UserNotificationService } from '../src/modules/notifications/notification-user.service.js';
import { NotificationType } from '../src/modules/notifications/notification.types.js';

function makeMailService() {
  return { send: jest.fn(async () => undefined) };
}

describe('notification services', () => {
  it('sends user verification notification', async () => {
    const mailService = makeMailService();
    const service = new UserNotificationService(mailService);

    const notification = await service.verifyAccountNotification(
      { name: 'Matheus', email: 'matheus@example.com' },
      'token-123',
    );

    expect(notification.notificationType).toBe(NotificationType.VERIFY_ACCOUNT);
    const [mail] = (mailService.send as any).mock.calls[0];
    expect(mail.to).toBe('matheus@example.com');
    expect(mail.subject).toContain('Verificação');
    expect(mail.html).toContain('token-123');
  });

  it('sends task completed notification', async () => {
    const mailService = makeMailService();
    const service = new TaskNotificationService(mailService);

    const notification = await service.createTaskCompletedNotification({
      user: { name: 'Matheus', email: 'matheus@example.com' },
      task: { title: 'Estudar testes', dueDate: null },
    });

    expect(notification.notificationType).toBe(NotificationType.TASK_COMPLETED);
    const [mail] = (mailService.send as any).mock.calls[0];
    expect(mail.to).toBe('matheus@example.com');
    expect(mail.subject).toContain('Estudar testes');
  });

  it('sends project restored notification', async () => {
    const mailService = makeMailService();
    const service = new ProjectNotificationService(mailService);

    const notification = await service.createProjectRestoredNotification({
      user: { name: 'Matheus', email: 'matheus@example.com' },
      project: { name: 'API' },
    });

    expect(notification.notificationType).toBe(NotificationType.PROJECT_RESTORED);
    const [mail] = (mailService.send as any).mock.calls[0];
    expect(mail.to).toBe('matheus@example.com');
    expect(mail.subject).toContain('API');
  });
});
