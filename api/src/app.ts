import cors from "cors";
import express from "express";

import { pokemonRoutes } from "./routes/pokemon.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_request, response) => {
    return response.status(200).json({
        status: "ok",
        message: "PokéHub API está funcionando!"
    });
});

app.use("/api/pokemon", pokemonRoutes);

export { app };