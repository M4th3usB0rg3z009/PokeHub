import { Router } from "express";
import rateLimit from "express-rate-limit";

import { askAssistant, createPokemonBuild, analyzeTeam, } from "../controllers/assistant.controller.js";

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

assistantRoutes.post(
  "/build",
  assistantLimiter,
  createPokemonBuild,
);

assistantRoutes.post(
  "/team-analysis",
  assistantLimiter,
  analyzeTeam,
);

assistantRoutes.post("/", assistantLimiter, askAssistant);

export { assistantRoutes };