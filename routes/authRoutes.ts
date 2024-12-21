import { Router } from "express";
import AuthController from "../controllers/AuthController";
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Реєстрація користувача
 *     description: Реєструє нового користувача
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       201:
 *         description: Користувач успішно створений
 *       400:
 *         description: Некоректний запит
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Вхід користувача
 *     description: Аутентифікація користувача
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Успішна аутентифікація
 *       401:
 *         description: Невірні облікові дані
 */
const router = Router();


router.post("/register", async (req, res) => {
  await AuthController.register(req, res);
});

router.post("/login", async (req, res) => {
  await AuthController.login(req, res);
});

export default router;