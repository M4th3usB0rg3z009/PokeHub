import axios from "axios";

export interface TeamAnalysis {
  score: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  coverage: string[];
  suggestions: string[];
}

interface AnalyzeTeamResponse {
  analysis: TeamAnalysis;
}

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

export async function analyzePokemonTeam(
  pokemonNames: string[],
): Promise<TeamAnalysis> {
  const response = await api.post<AnalyzeTeamResponse>(
    "/assistant/team-analysis",
    {
      pokemonNames,
    },
  );

  return response.data.analysis;
}