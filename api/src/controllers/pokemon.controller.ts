import type {
  Request,
  Response,
} from "express";

import { getPokemonByNameOrId } from "../services/pokemon.service.js";

export async function getPokemon(
  request: Request,
  response: Response,
): Promise<Response> {
  try {
    const nameOrIdParam =
      request.params.nameOrId;

    const nameOrId = Array.isArray(
      nameOrIdParam,
    )
      ? nameOrIdParam[0]
      : nameOrIdParam;

    if (!nameOrId) {
      return response.status(400).json({
        message:
          "Informe o nome ou número do Pokémon.",
      });
    }

    const pokemon =
      await getPokemonByNameOrId(nameOrId);

    return response.status(200).json(
      pokemon,
    );
  } catch (error) {
    console.error(
      "Erro ao buscar Pokémon:",
      error,
    );

    if (
      error instanceof Error &&
      error.message.includes("404")
    ) {
      return response.status(404).json({
        message: "Pokémon não encontrado.",
      });
    }

    return response.status(500).json({
      message:
        "Não foi possível buscar o Pokémon.",
    });
  }
}