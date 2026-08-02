import { gemini } from "../clients/gemini.client.js";
import { getPokemonByNameOrId } from "./pokemon.service.js";

interface AskAssistantInput {
  pokemonName: string;
  question: string;
}

interface AnalyzePokemonTeamInput {
  pokemonNames: string[];
}

export interface TeamAnalysis {
  score: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  coverage: string[];
  suggestions: string[];
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

interface GeneratePokemonBuildInput {
  pokemonName: string;
  buildType: string;
}

export interface PokemonBuild {
  role: string;
  nature: string;
  ability: string;
  item: string;
  evs: string[];
  moves: string[];
  strategy: string;
}

export async function generatePokemonBuild({
  pokemonName,
  buildType,
}: GeneratePokemonBuildInput): Promise<PokemonBuild> {
  const pokemon = await getPokemonByNameOrId(pokemonName);

  const pokemonContext = JSON.stringify(
    {
      id: pokemon.id,
      name: pokemon.name,
      types: pokemon.types,
      abilities: pokemon.abilities,
      description: pokemon.description,
      category: pokemon.category,
      generation: pokemon.generation,
      stats: pokemon.stats,
      weaknesses: pokemon.weaknesses,
      resistances: pokemon.resistances,
      moves: pokemon.moves,
    },
    null,
    2,
  );

  const prompt = `
Você é o Professor PokéHub, especialista em builds de Pokémon.

Crie uma build do tipo "${buildType}" para o Pokémon informado.

Regras:
- Responda sempre em português do Brasil.
- Retorne somente JSON válido.
- Não use Markdown.
- Use apenas habilidades presentes no contexto.
- Use apenas movimentos presentes no contexto.
- Mantenha os nomes dos movimentos exatamente como aparecem na PokéAPI.
- Escolha exatamente 4 movimentos.
- Os EVs devem totalizar no máximo 508.
- Escreva os EVs em português, por exemplo:
  "252 Ataque Especial",
  "252 Velocidade",
  "4 HP".
- Escolha movimentos coerentes com a função da build.
- Evite movimentos claramente ruins para a estratégia quando houver opções melhores no contexto.
- Caso o contexto não tenha movimentos suficientes para uma boa build, deixe isso claro na estratégia.

Dados do Pokémon:
${pokemonContext}

Formato obrigatório:
{
  "role": "função da build",
  "nature": "nature recomendada",
  "ability": "habilidade recomendada",
  "item": "item recomendado",
  "evs": ["252 Ataque Especial", "252 Velocidade", "4 HP"],
  "moves": ["movimento-1", "movimento-2", "movimento-3", "movimento-4"],
  "strategy": "explicação curta de como usar a build"
}
`.trim();

  const response = await gemini.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    },
  });

  const text = response.text?.trim();

  if (!text) {
    throw new Error("A Gemini não retornou uma build.");
  }

  return JSON.parse(text) as PokemonBuild;
}

export async function analyzePokemonTeam({
  pokemonNames,
}: AnalyzePokemonTeamInput): Promise<TeamAnalysis> {
  const pokemonTeam = await Promise.all(
    pokemonNames.map((pokemonName) =>
      getPokemonByNameOrId(pokemonName),
    ),
  );

  const teamContext = JSON.stringify(
    pokemonTeam.map((pokemon) => ({
      id: pokemon.id,
      name: pokemon.name,
      types: pokemon.types,
      abilities: pokemon.abilities,
      stats: pokemon.stats,
      weaknesses: pokemon.weaknesses,
      resistances: pokemon.resistances,
      immunities: pokemon.immunities,
      moves: pokemon.moves,
    })),
    null,
    2,
  );

  const prompt = `
Você é o Professor PokéHub, especialista em montagem e análise de times Pokémon.

Analise o time fornecido.

Regras:
- Responda em português do Brasil.
- Considere tipos, atributos, fraquezas, resistências, imunidades, habilidades e movimentos.
- A nota deve ser um número entre 0 e 10.
- Não invente dados que não estejam no contexto.
- Dê sugestões práticas e objetivas.
- Retorne somente JSON válido.
- Não use Markdown.

Time:
${teamContext}

Formato obrigatório:
{
  "score": 8.5,
  "summary": "Resumo geral do time.",
  "strengths": [
    "Ponto forte 1",
    "Ponto forte 2"
  ],
  "weaknesses": [
    "Fraqueza 1",
    "Fraqueza 2"
  ],
  "coverage": [
    "Cobertura 1",
    "Cobertura 2"
  ],
  "suggestions": [
    "Sugestão 1",
    "Sugestão 2"
  ]
}
  `.trim();

  const response = await gemini.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    },
  });

  const text = response.text?.trim();

  if (!text) {
    throw new Error(
      "A Gemini não retornou a análise do time.",
    );
  }

  return JSON.parse(text) as TeamAnalysis;
}
