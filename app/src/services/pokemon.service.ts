import axios from "axios";
import type { Pokemon } from "../types/pokemon";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  timeout: 10000
});

export async function getPokemonByNameOrId(
  nameOrId: string
): Promise<Pokemon> {
  const response = await api.get<Pokemon>(`/pokemon/${nameOrId}`);

  return response.data;
}