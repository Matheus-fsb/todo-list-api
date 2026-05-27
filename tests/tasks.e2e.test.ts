import bcrypt from 'bcrypt';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import app from '../src/app.js';
import { prisma } from '../src/lib/prisma.js';

describe('Main API flows e2e', () => {
  const unique = `e2e_${Date.now()}`;
  const email = `${unique}@example.com`;
  const adminEmail = `${unique}_admin@example.com`;
  const password = 'test-password-10';
  const changedPassword = 'changed-password-10';

  const userAgent = request.agent(app);
  const adminAgent = request.agent(app);

  let userId: string;
  let projectId: string;
  let taskId: string;

  beforeAll(async () => {
    await prisma.user.deleteMany({ where: { email: { in: [email, adminEmail] } } });

    const adminPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        name: 'E2E Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'ADMIN',
        emailVerified: true,
        emailVerifiedAt: new Date(),
      },
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: { in: [email, adminEmail] } } });
    await prisma.$disconnect();
  });

  it('rejects weak user passwords', async () => {
    const response = await request(app)
      .post('/users')
      .send({ name: 'Weak User', email: `weak_${email}`, password: '123456' });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Validation error');
  });

  it('registers, verifies and authenticates a user', async () => {
    const createdUser = await request(app)
      .post('/users')
      .send({ name: 'E2E User', email, password });

    expect(createdUser.status).toBe(201);
    expect(createdUser.body.data.password).toBeUndefined();
    expect(createdUser.body.data.emailVerified).toBe(false);

    userId = createdUser.body.data.id;

    const blockedLogin = await userAgent.post('/auth/login').send({ email, password });

    expect(blockedLogin.status).toBe(403);
    expect(blockedLogin.body.message).toBe('Email not verified');

    const validationToken = await prisma.validationToken.findFirstOrThrow({ where: { userId } });
    const verified = await request(app).get(`/auth/verify-email?token=${validationToken.token}`);

    expect(verified.status).toBe(200);

    const login = await userAgent.post('/auth/login').send({ email, password });

    expect(login.status).toBe(200);
    expect(login.body.data.user.email).toBe(email);
  });

  it('updates profile data and password without allowing email changes', async () => {
    const emailUpdate = await userAgent.patch('/users/me').send({ email: `new_${email}` });

    expect(emailUpdate.status).toBe(400);
    expect(emailUpdate.body.message).toBe('Validation error');

    const profileUpdate = await userAgent.patch('/users/me').send({ name: 'E2E User Updated' });

    expect(profileUpdate.status).toBe(200);
    expect(profileUpdate.body.data.name).toBe('E2E User Updated');

    const passwordUpdate = await userAgent
      .patch('/users/me/password')
      .send({ currentPassword: password, newPassword: changedPassword });

    expect(passwordUpdate.status).toBe(200);

    const loginWithOldPassword = await request(app).post('/auth/login').send({ email, password });

    expect(loginWithOldPassword.status).toBe(401);

    const loginWithNewPassword = await userAgent.post('/auth/login').send({ email, password: changedPassword });

    expect(loginWithNewPassword.status).toBe(200);
  });

  it('creates, updates, lists, soft deletes and restores projects', async () => {
    const createdProject = await userAgent
      .post('/projects/me')
      .send({ name: `Project ${unique}`, description: 'Main e2e project' });

    expect(createdProject.status).toBe(201);
    expect(createdProject.body.data.userId).toBe(userId);

    projectId = createdProject.body.data.id;

    const projects = await userAgent.get('/projects/me?page=1&limit=10');

    expect(projects.status).toBe(200);
    expect(projects.body.data.items.some((project: { id: string }) => project.id === projectId)).toBe(true);

    const updatedProject = await userAgent.patch(`/projects/${projectId}`).send({ name: `Updated ${unique}` });

    expect(updatedProject.status).toBe(200);
    expect(updatedProject.body.data.name).toBe(`Updated ${unique}`);

    const foundProject = await userAgent.get(`/projects/${projectId}`);

    expect(foundProject.status).toBe(200);
    expect(foundProject.body.data.id).toBe(projectId);
  });

  it('creates, updates, completes, reopens, lists and soft deletes tasks', async () => {
    const futureDueDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    const createdTask = await userAgent.post('/tasks/me').send({
      title: `Task ${unique}`,
      description: 'Main e2e task',
      priority: 'HIGH',
      projectId,
      dueDate: futureDueDate,
    });

    expect(createdTask.status).toBe(201);
    expect(createdTask.body.data.projectId).toBe(projectId);

    taskId = createdTask.body.data.id;

    const updatedTask = await userAgent.put(`/tasks/${taskId}`).send({ status: 'IN_PROGRESS' });

    expect(updatedTask.status).toBe(200);
    expect(updatedTask.body.data.status).toBe('IN_PROGRESS');

    const completedTask = await userAgent.patch(`/tasks/${taskId}/complete`);

    expect(completedTask.status).toBe(200);
    expect(completedTask.body.data.status).toBe('COMPLETED');
    expect(completedTask.body.data.completedAt).toBeTruthy();

    const reopenedTask = await userAgent.patch(`/tasks/${taskId}/reopen`);

    expect(reopenedTask.status).toBe(200);
    expect(reopenedTask.body.data.status).toBe('PENDING');
    expect(reopenedTask.body.data.completedAt).toBeNull();

    const tasks = await userAgent.get('/tasks/me?page=1&limit=10&status=PENDING&priority=HIGH');

    expect(tasks.status).toBe(200);
    expect(tasks.body.data.items.some((task: { id: string }) => task.id === taskId)).toBe(true);

    const projectTasks = await userAgent.get(`/projects/${projectId}/tasks?page=1&limit=10`);

    expect(projectTasks.status).toBe(200);
    expect(projectTasks.body.data.items.some((task: { id: string }) => task.id === taskId)).toBe(true);

    await prisma.task.create({
      data: {
        title: `Overdue ${unique}`,
        projectId,
        dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
        priority: 'LOW',
      },
    });

    const overdueTasks = await userAgent.get('/tasks/overdue?page=1&limit=10&priority=LOW');

    expect(overdueTasks.status).toBe(200);
    expect(overdueTasks.body.data.items.some((task: { title: string }) => task.title === `Overdue ${unique}`)).toBe(
      true,
    );

    const deletedTask = await userAgent.patch(`/tasks/${taskId}`);

    expect(deletedTask.status).toBe(200);
  });

  it('enforces authorization between users', async () => {
    const otherAgent = request.agent(app);
    const otherEmail = `${unique}_other@example.com`;

    await prisma.user.create({
      data: {
        name: 'Other User',
        email: otherEmail,
        password: await bcrypt.hash(password, 10),
        emailVerified: true,
        emailVerifiedAt: new Date(),
      },
    });

    const otherLogin = await otherAgent.post('/auth/login').send({ email: otherEmail, password });

    expect(otherLogin.status).toBe(200);

    const forbiddenProject = await otherAgent.get(`/projects/${projectId}`);

    expect(forbiddenProject.status).toBe(403);

    await prisma.user.deleteMany({ where: { email: otherEmail } });
  });

  it('soft deletes and restores projects', async () => {
    const deletedProject = await userAgent.patch(`/projects/${projectId}/soft-delete`);

    expect(deletedProject.status).toBe(200);

    const deletedProjects = await userAgent.get('/projects/deleted?page=1&limit=10');

    expect(deletedProjects.status).toBe(200);
    expect(deletedProjects.body.data.items.some((project: { id: string }) => project.id === projectId)).toBe(true);

    const restoredProject = await userAgent.patch(`/projects/${projectId}/restore`);

    expect(restoredProject.status).toBe(200);
    expect(restoredProject.body.data.id).toBe(projectId);
  });

  it('allows admin listing deleted users and restoring users', async () => {
    const adminLogin = await adminAgent.post('/auth/login').send({ email: adminEmail, password });

    expect(adminLogin.status).toBe(200);

    const softDeletedUser = await userAgent.delete('/users/me');

    expect(softDeletedUser.status).toBe(200);

    const deletedUsers = await adminAgent.get('/users/deleted?page=1&limit=10&emailVerified=true');

    expect(deletedUsers.status).toBe(200);
    expect(deletedUsers.body.data.items.some((user: { id: string }) => user.id === userId)).toBe(true);

    const restoredUser = await adminAgent.patch(`/users/${userId}/restore`);

    expect(restoredUser.status).toBe(200);
    expect(restoredUser.body.data.id).toBe(userId);
  });
});
