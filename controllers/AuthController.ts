

import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET не налаштовано в .env файлі");
}

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

export class AuthController {
  static async register(req: Request, res: Response) {
    const { email, password, confirmPassword } = req.body;

    try {
      
      if (!email || !password || !confirmPassword) {
        return res.status(400).json({ message: "Всі поля є обов’язковими" });
      }
      if (!EMAIL_REGEX.test(email)) {
        return res.status(400).json({ message: "Некоректний email" });
      }
      if (password.length < 6) {
        return res.status(400).json({ message: "Пароль має бути не менше 6 символів" });
      }
      if (password !== confirmPassword) {
        return res.status(400).json({ message: "Паролі не співпадають" });
      }

      const userRepository = AppDataSource.getRepository(User);

      
      const existingUser = await userRepository.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: "Користувач з таким email вже існує" });
      }

      
      const hashedPassword = await bcrypt.hash(password, 10);

      
      const newUser = userRepository.create({ email, password: hashedPassword });
      await userRepository.save(newUser);

      
      const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET as string, { expiresIn: "1h" });
      return res.status(201).json({ token: `Bearer ${token}` });
    } catch (error) {
      console.error("Помилка реєстрації:", error);
      return res.status(500).json({ message: "Помилка сервера" });
    }
  }

  static async login(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
      
      if (!email || !password) {
        return res.status(400).json({ message: "Всі поля є обов’язковими" });
      }

      const userRepository = AppDataSource.getRepository(User);

      
      const user = await userRepository.findOne({ where: { email } });
      if (!user) {
        return res.status(400).json({ message: "Користувача з таким email не знайдено" });
      }

      
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Неправильний пароль" });
      }

      
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET as string, { expiresIn: "1h" });
      console.log("Згенерований токен:", token);

      return res.json({ token: `Bearer ${token}` });
    } catch (error) {
      console.error("Помилка входу:", error);
      return res.status(500).json({ message: "Помилка сервера" });
    }
  }
}

export default AuthController;