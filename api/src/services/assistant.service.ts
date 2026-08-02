import { gemini } from "../clients/gemini.client.js";
import { getPokemonByNameOrId } from "./pokemon.service.js";

interface AskAssistantInput {
  pokemonName: string;
  question: string;
}

const model = process.env.GEMINI_MODEL;

if (!model) {
  throw new Error(
    "A variável GEMINI_MODEL não foi configurada no arquivo .env.",
  );
}

export async function askPokemonAssistant({
  pokemonName,
  question,
}: AskAssistantInput): Promise<string> {
  const pokemon = await getPokemonByNameOrId(pokemonName);

  const pokemonContext = JSON.stringify(
    {
      id: pokemon.id,
      name: pokemon.name,
      types: pokemon.types,
      abilities: pokemon.abilities,
      heightInMeters: pokemon.height / 10,
      weightInKilograms: pokemon.weight / 10,
      stats: pokemon.stats,
      weaknesses: pokemon.weaknesses,
      resistances: pokemon.resistances,
      immunities: pokemon.immunities,
      moves: pokemon.moves,
    },
    null,
    2,
  );

  const prompt = `
Você é o Professor PokéHub, um assistente especializado em Pokémon.

REGRAS:
- Responda sempre em português do Brasil.
- Use os dados fornecidos pela PokéAPI como contexto principal.
- Seja claro, objetivo e fácil de entender.
- Não invente atributos, tipos, habilidades ou movimentos.
- Ao recomendar uma build, use apenas movimentos disponíveis no contexto.
- Organize builds em: função, nature, habilidade, item, EVs, movimentos e estratégia.
- Caso não tenha certeza sobre algum item ou configuração competitiva, deixe isso claro.
- Responda apenas a perguntas relacionadas a Pokémon.

DADOS DO POKÉMON:
${pokemonContext}

PERGUNTA DO USUÁRIO:
${question}
  `.trim();

  const response = await gemini.models.generateContent({
    model,
    contents: prompt,
  });

  const answer = response.text?.trim();

  if (!answer) {
    throw new Error("A Gemini não retornou uma resposta.");
  }

  return answer;
}