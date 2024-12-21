import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";

export interface AuthenticatedRequest extends Request {
  user?: User; 
}

export const authMiddleware = async (
  req: AuthenticatedRequest, 
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "Токен відсутній або має неправильний формат" });
      return;
    }
    const token = authHeader.split(" ")[1];
    const secretKey = process.env.JWT_SECRET || "default_secret_key";

    
    const decoded = jwt.verify(token, secretKey) as { id: number; email: string };
    console.log("Decoded Token:", decoded); 

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: decoded.id } });
    console.log("Found User:", user); 

    if (!user) {
      res.status(401).json({ message: "Користувача не знайдено. Неавторизований доступ" });
      return;
    }

    (req as AuthenticatedRequest).user = user;

    next();
  } catch (error) {
    console.error("Помилка перевірки токена:", error);
    res.status(403).json({ 
      message: "Невірний токен або токен закінчився", 
      error: error instanceof Error ? error.message : "Невідома помилка" 
    });
  }
};