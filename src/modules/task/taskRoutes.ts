import { Router } from "express";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTasksByProject,
} from "./taskServices.js";

const router = Router();

// criar task (pode vir com projectId no body)
router.post("/", async (req, res) => {
  const task = await createTask(req.body);
  res.status(201).json(task);
});

// listar tasks (com filtro opcional por projeto)
router.get("/", async (req, res) => {
  const { projectId } = req.query;

  if (projectId) {
    const tasks = await getTasksByProject(projectId as string);
    return res.json(tasks);
  }

  const tasks = await getTasks();
  res.json(tasks);
});

router.get("/:id", async (req, res) => {
  const task = await getTaskById(req.params.id);
  res.json(task);
});

router.put("/:id", async (req, res) => {
  const task = await updateTask(req.params.id, req.body);
  res.json(task);
});

router.delete("/:id", async (req, res) => {
  await deleteTask(req.params.id);
  res.status(204).send();
});

export default router;
