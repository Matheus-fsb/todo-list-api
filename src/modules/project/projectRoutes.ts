import { Router } from "express";
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getProjectsByUser,
} from "./projectServices.js";

const router = Router();

router.post("/", async (req, res) => {
  const project = await createProject(req.body);
  res.status(201).json(project);
});

router.get("/", async (req, res) => {
  const { userId } = req.query;

  if (userId) {
    const projects = await getProjectsByUser(userId as string);
    return res.json(projects);
  }

  const projects = await getProjects();
  res.json(projects);
});

router.get("/:id", async (req, res) => {
  const project = await getProjectById(req.params.id);
  res.json(project);
});

router.put("/:id", async (req, res) => {
  const project = await updateProject(req.params.id, req.body);
  res.json(project);
});

router.delete("/:id", async (req, res) => {
  await deleteProject(req.params.id);
  res.status(204).send();
});

export default router;
