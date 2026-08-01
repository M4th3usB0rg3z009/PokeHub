import { Router } from "express";

import { getPokemon } from "../controllers/pokemon.controller.js";

const pokemonRoutes = Router();

pokemonRoutes.get("/:nameOrId", getPokemon);

export { pokemonRoutes };