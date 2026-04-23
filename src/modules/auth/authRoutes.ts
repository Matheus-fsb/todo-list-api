import { Router } from "express";
import { login } from "./authService.js";
import type { Response, Request } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";

const router = Router();

router.post(
  "/login",
  asyncHandler(async (req: Request, res: Response) => {
    const result = await login(req.body);
    res.json(result);
  }),
);

export default router;
