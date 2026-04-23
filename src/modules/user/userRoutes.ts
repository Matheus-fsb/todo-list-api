import { Router } from "express";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "./userServices.js";

const router = Router();

router.post("/", async (req, res) => {
  const user = await createUser(req.body);
  res.status(201).json(user);
});

router.get("/", async (_req, res) => {
  const users = await getUsers();
  res.json(users);
});

router.get("/:id", async (req, res) => {
  const user = await getUserById(req.params.id);
  res.json(user);
});

router.put("/:id", async (req, res) => {
  const user = await updateUser(req.params.id, req.body);
  res.json(user);
});

router.delete("/:id", async (req, res) => {
  await deleteUser(req.params.id);
  res.status(204).send();
});

export default router;
