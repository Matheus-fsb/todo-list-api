import request from "supertest";
import app from "../src/app.js";

describe("Full flow", () => {
  it("should create user, project and task", async () => {
    const unique = `test_${Date.now()}`;

    // USER
    const user = await request(app).post("/users").send({
      name: "Matheus",
      login: unique,
      password: "123456",
    });

    expect(user.status).toBe(201);

    // PROJECT
    const project = await request(app).post("/projects").send({
      name: `Projeto_${unique}`,
      userId: user.body.id,
    });

    expect(project.status).toBe(201);

    // TASK
    const task = await request(app).post("/tasks").send({
      title: `Task_${unique}`,
      projectId: project.body.id,
    });

    expect(task.status).toBe(201);

    // GET TASKS
    const tasks = await request(app).get(
      `/tasks/project/${project.body.id}`
    );

    expect(tasks.status).toBe(200);
    expect(tasks.body.length).toBeGreaterThan(0);
  });
});