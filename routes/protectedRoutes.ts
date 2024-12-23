import express, { Response } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { AuthenticatedRequest } from "../types/auth";
/**
 * @swagger
 * /api/protected:
 *   get:
 *     summary: Захищений маршрут
 *     description: Приклад захищеного маршруту, доступний тільки для авторизованих користувачів
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Доступ дозволено
 *       401:
 *         description: Неавторизований доступ
 */
const router = express.Router();

/*router.get("/", authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  res.json({ message: "Це захищений маршрут", user: req.user });
});*/
router.get("/resource", authMiddleware, (req, res) => {
  res.status(200).json({ message: "Успішний доступ до захищеного ресурсу" });
});

export default router;