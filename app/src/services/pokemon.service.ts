import axios from "axios";
import type { Pokemon } from "../types/pokemon";

const api = axios.create({
  baseURL: "/api",
  timeout: 60000,
});

export async function getPokemonByNameOrId(
  nameOrId: string,
): Promise<Pokemon> {
  const normalizedNameOrId = nameOrId
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");

  const response = await api.get<Pokemon>(
    `/pokemon/${normalizedNameOrId}`,
  );

  return response.data;
}
