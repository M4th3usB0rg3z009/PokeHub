import axios from "axios";

interface AskAssistantInput {
  pokemonName: string;
  question: string;
}

interface AssistantResponse {
  answer: string;
}

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  timeout: 60000
});

export async function askPokemonAssistant({
  pokemonName,
  question
}: AskAssistantInput): Promise<string> {
  const response = await api.post<AssistantResponse>("/assistant", {
    pokemonName,
    question
  });

  return response.data.answer;
}