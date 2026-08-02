import axios from "axios";

interface AskAssistantInput {
  pokemonName: string;
  question: string;
}

interface AssistantResponse {
  answer: string;
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