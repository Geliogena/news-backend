import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./config/data-source";
import authRoutes from "./routes/authRoutes";
import newsRoutes from "./routes/newsRoutes";
import protectedRoutes from "./routes/protectedRoutes";
import { Request, Response, NextFunction } from "express";
import "dotenv/config";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger-output.json"; 

const app = express();
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

app.use("/api/protected", protectedRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/news", newsRoutes);


app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Внутрішня помилка сервера:", err);
  res.status(500).json({ message: "Внутрішня помилка сервера" });
});


AppDataSource.initialize()
  .then(() => {
    console.log("База даних підключена");
    app.listen(8000, () => {
      console.log("Сервер запущено на порту 8000");
    });
  })
  .catch((error) => console.error("Помилка підключення до бази даних:", error));