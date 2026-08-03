import axios from "axios";

interface AskAssistantInput {
  pokemonName: string;
  question: string;
}

interface AssistantResponse {
  answer: string;
}

const api = axios.create({
  baseURL: "/api",
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function askPokemonAssistant({
  pokemonName,
  question,
}: AskAssistantInput): Promise<string> {
  const response = await api.post<AssistantResponse>(
    "/assistant",
    {
      pokemonName,
      question,
    },
  );

  return response.data.answer;
}
