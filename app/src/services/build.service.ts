import axios from "axios";

export type BuildType =
  | "physical"
  | "special"
  | "defensive"
  | "support"
  | "balanced";

export interface PokemonBuild {
  role: string;
  nature: string;
  ability: string;
  item: string;
  evs: string[];
  moves: string[];
  strategy: string;
}

interface GenerateBuildInput {
  pokemonName: string;
  buildType: BuildType;
}

interface GenerateBuildResponse {
  build: PokemonBuild;
}

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  timeout: 60000,
});

export async function generatePokemonBuild({
  pokemonName,
  buildType,
}: GenerateBuildInput): Promise<PokemonBuild> {
  const response = await api.post<GenerateBuildResponse>(
    "/assistant/build",
    {
      pokemonName,
      buildType,
    },
  );

  return response.data.build;
}