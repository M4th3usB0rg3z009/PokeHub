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

const isProduction =
  process.env.NODE_ENV === "production";

const frontendUrl =
  process.env.FRONTEND_URL;

if (!frontendUrl) {
  throw new Error(
    "A variável FRONTEND_URL não foi configurada.",
  );
}

/*
 * Em hospedagens com um proxy reverso na frente da API,
 * permite que o Express identifique corretamente o IP
 * original usado pelo rate limit.
 *
 * O valor 1 representa um proxy entre o visitante e a API.
 */
if (isProduction) {
  app.set("trust proxy", 1);
}

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
    origin: frontendUrl,

    methods: [
      "GET",
      "POST",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
    ],

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

app.get(
  "/api/health",
  (_request, response) => {
    return response.status(200).json({
      status: "ok",
      service: "pokehub-api",
      environment:
        process.env.NODE_ENV ??
        "development",
      timestamp: new Date().toISOString(),
    });
  },
);

app.use(
  "/api/pokemon",
  pokemonRoutes,
);

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