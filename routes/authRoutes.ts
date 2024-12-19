import { Router } from "express";
import AuthController from "../controllers/AuthController";

const router = Router();


router.post("/register", async (req, res) => {
  await AuthController.register(req, res);
});

router.post("/login", async (req, res) => {
  await AuthController.login(req, res);
});

export default router;