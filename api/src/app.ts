import "dotenv/config";

import cors from "cors";
import express from "express";
import helmet from "helmet";

import {
  aiRateLimit,
  generalRateLimit,
} from "./middlewares/rate-limit.middleware.js";

import { assistantRoutes } from "./routes/assistant.routes.js";
import { pokemonRoutes } from "./routes/pokemon.routes.js";

const app = express();

app.disable("x-powered-by");

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  }),
);

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
    optionsSuccessStatus: 204,
  }),
);

app.use(
  express.json({
    limit: "100kb",
    strict: true,
  }),
);

app.use(generalRateLimit);

app.get("/api/health", (_request, response) => {
  return response.status(200).json({
    status: "ok",
    service: "pokehub-api",
    environment: "local",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/pokemon", pokemonRoutes);

app.use(
  "/api/assistant",
  aiRateLimit,
  assistantRoutes,
);

app.use((_request, response) => {
  return response.status(404).json({
    message: "Rota não encontrada.",
  });
});

export { app };
