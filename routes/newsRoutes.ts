import { Router, Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Newspost, Genre } from "../entities/Newspost";
import { authMiddleware } from "../middleware/authMiddleware";
import { AuthenticatedRequest } from "../types/auth";
/**
 * @swagger
 * /api/news:
 *   get:
 *     summary: Отримати всі новини
 *     description: Повертає список усіх новин
 *     responses:
 *       200:
 *         description: Успішний запит
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   text:
 *                     type: string
 */

/**
 * @swagger
 * /api/news/{id}:
 *   get:
 *     summary: Отримати новину за ID
 *     description: Повертає новину з переданим ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID новини
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Успішний запит
 *       404:
 *         description: Новину не знайдено
 */
const router = Router();

router.get("/", async (_req, res) => {
  res.json([
    { id: "1", title: "Перша новина", text: "Текст першої новини" },
    { id: "2", title: "Друга новина", text: "Текст другої новини" },
  ]);
});

router.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params; 
    
    res.json({ message: `Новина з ID: ${id}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Помилка сервера" });
  }
});


router.post("/", authMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { title, text, genre } = req.body;

  if (!req.user) {
    res.status(401).json({ message: "Неавторизований доступ" });
    return;
  }

  if (!title || !text || !genre) {
    res.status(400).json({ message: "Усі поля (title, text, genre) є обов'язковими" });
    return;
  }

  
  if (!Object.values(Genre).includes(genre)) {
    res.status(400).json({ message: "Неправильний жанр. Доступні: Politic, Business, Sport, Other" });
    return;
  }

  try {
    const newspostRepository = AppDataSource.getRepository(Newspost);

    const newspost = newspostRepository.create({
      title,
      text,
      genre,
      author: req.user, 
    });

    await newspostRepository.save(newspost);

    res.status(201).json(newspost);
  } catch (error) {
    console.error("Помилка при створенні новини:", error);
    res.status(500).json({ message: "Внутрішня помилка сервера" });
  }
});

export default router;


