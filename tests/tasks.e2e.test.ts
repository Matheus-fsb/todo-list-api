import request from 'supertest';
import app from '../src/app.js';

describe('Full flow', () => {
  it('should create user, project and task', async () => {
    const unique = `test_${Date.now()}`;

    const user = await request(app)
      .post('/users')
      .send({ name: 'Matheus', email: `${unique}@example.com`, password: '123456' });

    expect(user.status).toBe(201);
    expect(user.body.success).toBe(true);
    expect(user.body.data.id).toBeDefined();

    const project = await request(app)
      .post('/projects')
      .send({ name: `Projeto_${unique}`, userId: user.body.data.id });

    expect(project.status).toBe(201);
    expect(project.body.success).toBe(true);
    expect(project.body.data.id).toBeDefined();

    const task = await request(app)
      .post('/tasks')
      .send({ title: `Task_${unique}`, projectId: project.body.data.id });

    expect(task.status).toBe(201);
    expect(task.body.success).toBe(true);
    expect(task.body.data.id).toBeDefined();

    const tasks = await request(app).get(`/tasks/projects/${project.body.data.id}`);

    expect(tasks.status).toBe(401);
    expect(tasks.body.success).toBe(false);
    expect(tasks.body.message).toBe('Unauthorized');
  });
});
