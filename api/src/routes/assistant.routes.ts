import { Router } from "express";
import rateLimit from "express-rate-limit";

import { askAssistant } from "../controllers/assistant.controller.js";

const assistantRoutes = Router();

const assistantLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Muitas perguntas enviadas. Aguarde um momento."
  }
});

assistantRoutes.post("/", assistantLimiter, askAssistant);

export { assistantRoutes };