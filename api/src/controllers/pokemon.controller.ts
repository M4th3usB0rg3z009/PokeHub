import axios from "axios";
import type { Request, Response } from "express";

import { getPokemonByNameOrId } from "../services/pokemon.service.js";

export async function getPokemon(
    request: Request,
    response: Response
): Promise<Response> {
    try {
        const { nameOrId } = request.params;

        if (!nameOrId) {
            return response.status(400).json({
                message: "Informe o nome ou o número do Pokémon."
            });
        }

        const pokemon = await getPokemonByNameOrId(nameOrId);

        return response.status(200).json(pokemon);
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            return response.status(404).json({
                message: "Pokémon não encontrado."
            });
        }

        console.error("Erro ao pesquisar Pokémon:", error);

        return response.status(500).json({
            message: "Não foi possível pesquisar o Pokémon."
        });
    }
}