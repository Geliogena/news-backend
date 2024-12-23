import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./config/data-source";
import authRoutes from "./routes/authRoutes";
import newsRoutes from "./routes/newsRoutes";
import protectedRoutes from "./routes/protectedRoutes";
import { createServer } from "http";
import { Server } from "socket.io";
import { Request, Response, NextFunction } from "express";
import "dotenv/config";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger-output.json";


const app = express();
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use("/api/protected", protectedRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/news", newsRoutes);

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Внутрішня помилка сервера:", err);
  res.status(500).json({ message: "Внутрішня помилка сервера" });
});


const httpServer = createServer(app);


const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", 
    methods: ["GET", "POST"], 
  },
});


io.on("connection", (socket) => {
  console.log("Клієнт підключився:", socket.id);

  
  socket.on("notification-log", (data) => {
    console.log("Лог повідомлення отримано:", data);
    io.emit("notification-log", data); 
  });

  
  socket.on("notification-alert", (data) => {
    console.log("Алерт повідомлення отримано:", data);
    io.emit("notification-alert", data); 
  });

  
  socket.on("disconnect", () => {
    console.log("Клієнт відключився:", socket.id);
  });
});


AppDataSource.initialize()
  .then(() => {
    console.log("База даних підключена");

    setInterval(() => {
      io.emit("notification-log", {
          title: "Тестова новина",
          content: "Це тестовий лог для перевірки.",
          link: "http://example.com/news/1",
      });
  
      io.emit("notification-alert", {
          title: "Тестовий алерт",
          content: "Це тестовий алерт для перевірки.",
          link: "http://example.com/news/2",
      });
  }, 5000); 


    httpServer.listen(8000, () => {
      console.log("HTTP та WebSocket сервери запущено на порту 8000");
    });
  })
  .catch((error) => console.error("Помилка підключення до бази даних:", error));