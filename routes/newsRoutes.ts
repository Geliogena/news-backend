import express, { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Newspost, Genre } from "../entities/Newspost";
import { authMiddleware } from "../middleware/authMiddleware";
import { AuthenticatedRequest } from "../types/auth";
import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.json([
    { id: 1, title: "Перша новина", text: "Текст першої новини" },
    { id: 2, title: "Друга новина", text: "Текст другої новини" },
  ]);
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


