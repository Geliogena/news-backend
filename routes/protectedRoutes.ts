import express, { Response } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { AuthenticatedRequest } from "../types/auth";

const router = express.Router();

router.get("/", authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  res.json({ message: "Це захищений маршрут", user: req.user });
});

export default router;