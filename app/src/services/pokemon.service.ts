import axios from "axios";
import type { Pokemon } from "../types/pokemon";

const apiUrl = import.meta.env.VITE_API_URL;

if (!apiUrl) {
  throw new Error(
    "A variável VITE_API_URL não foi configurada.",
  );
}

const api = axios.create({
  baseURL: apiUrl,
  timeout: 60000,
});

export async function getPokemonByNameOrId(
  nameOrId: string
): Promise<Pokemon> {
  const response = await api.get<Pokemon>(`/pokemon/${nameOrId}`);

  return response.data;
}