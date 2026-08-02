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

const api = axios.create({
  baseURL: "http://localhost:3000/api",
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