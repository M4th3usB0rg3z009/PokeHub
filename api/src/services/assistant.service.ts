import { gemini } from "../clients/gemini.client.js";
import {
  getPokemonByNameOrId,
  type PokemonData,
} from "./pokemon.service.js";

interface AskAssistantInput {
  pokemonName: string;
  question: string;
}

interface GeneratePokemonBuildInput {
  pokemonName: string;
  buildType: string;
}

interface AnalyzePokemonTeamInput {
  pokemonNames: string[];
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

export interface TeamAnalysis {
  score: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  coverage: string[];
  suggestions: string[];
}

interface CompactMove {
  name: string;
  type: string;
  power: number | null;
  accuracy: number | null;
  damageClass: "physical" | "special" | "status";
}

function getRequiredEnvironmentVariable(
  variableName: string,
): string {
  const value = process.env[variableName];

  if (!value) {
    throw new Error(
      `A variável ${variableName} não foi configurada no arquivo .env.`,
    );
  }

  return value;
}

const model =
  getRequiredEnvironmentVariable(
    "GEMINI_MODEL",
  );

/**
 * Remove os dados pesados de aprendizado dos golpes.
 * O learnDetails não é necessário para as respostas da IA.
 */
function compactMoves(
  pokemon: PokemonData,
): CompactMove[] {
  return pokemon.moves.map((move) => ({
    name: move.name,
    type: move.type,
    power: move.power,
    accuracy: move.accuracy,
    damageClass: move.damageClass,
  }));
}

/**
 * Seleciona movimentos relevantes para a análise do time.
 * Mantém golpes ofensivos fortes e alguns golpes de status.
 */
function getRelevantTeamMoves(
  pokemon: PokemonData,
): CompactMove[] {
  const offensiveMoves = pokemon.moves
    .filter(
      (move) =>
        move.damageClass !== "status" &&
        move.power !== null &&
        move.power > 0,
    )
    .sort(
      (firstMove, secondMove) =>
        (secondMove.power ?? 0) -
        (firstMove.power ?? 0),
    )
    .slice(0, 10);

  const statusMoves = pokemon.moves
    .filter(
      (move) =>
        move.damageClass === "status",
    )
    .slice(0, 4);

  return [...offensiveMoves, ...statusMoves].map(
    (move) => ({
      name: move.name,
      type: move.type,
      power: move.power,
      accuracy: move.accuracy,
      damageClass: move.damageClass,
    }),
  );
}

function parseJsonResponse<T>(
  text: string,
  errorMessage: string,
): T {
  try {
    return JSON.parse(text) as T;
  } catch {
    console.error(
      "Resposta JSON inválida da Gemini:",
      text,
    );

    throw new Error(errorMessage);
  }
}

function isStringArray(
  value: unknown,
): value is string[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) => typeof item === "string",
    )
  );
}

function validatePokemonBuild(
  value: unknown,
): PokemonBuild {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    throw new Error(
      "A Gemini retornou uma build em formato inválido.",
    );
  }

  const build = value as Partial<PokemonBuild>;

  if (
    typeof build.role !== "string" ||
    typeof build.nature !== "string" ||
    typeof build.ability !== "string" ||
    typeof build.item !== "string" ||
    typeof build.strategy !== "string" ||
    !isStringArray(build.evs) ||
    !isStringArray(build.moves)
  ) {
    throw new Error(
      "A Gemini retornou uma build com campos inválidos.",
    );
  }

  if (build.moves.length !== 4) {
    throw new Error(
      "A Gemini não retornou exatamente quatro movimentos.",
    );
  }

  return {
    role: build.role.trim(),
    nature: build.nature.trim(),
    ability: build.ability.trim(),
    item: build.item.trim(),
    evs: build.evs.map((ev) => ev.trim()),
    moves: build.moves.map((move) =>
      move.trim(),
    ),
    strategy: build.strategy.trim(),
  };
}

function validateTeamAnalysis(
  value: unknown,
): TeamAnalysis {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    throw new Error(
      "A Gemini retornou uma análise em formato inválido.",
    );
  }

  const analysis =
    value as Partial<TeamAnalysis>;

  if (
    typeof analysis.score !== "number" ||
    !Number.isFinite(analysis.score) ||
    typeof analysis.summary !== "string" ||
    !isStringArray(analysis.strengths) ||
    !isStringArray(analysis.weaknesses) ||
    !isStringArray(analysis.coverage) ||
    !isStringArray(analysis.suggestions)
  ) {
    throw new Error(
      "A resposta da Gemini não possui o formato esperado.",
    );
  }

  return {
    score: Math.min(
      Math.max(analysis.score, 0),
      10,
    ),

    summary: analysis.summary.trim(),

    strengths: analysis.strengths
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 5),

    weaknesses: analysis.weaknesses
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 5),

    coverage: analysis.coverage
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 5),

    suggestions: analysis.suggestions
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 5),
  };
}

export async function askPokemonAssistant({
  pokemonName,
  question,
}: AskAssistantInput): Promise<string> {
  const normalizedQuestion =
    question.trim();

  if (!normalizedQuestion) {
    throw new Error(
      "A pergunta não pode estar vazia.",
    );
  }

  const pokemon =
    await getPokemonByNameOrId(
      pokemonName.trim().toLowerCase(),
    );

  const pokemonContext = JSON.stringify({
    id: pokemon.id,
    name: pokemon.name,
    types: pokemon.types,
    abilities: pokemon.abilities,
    heightInMeters: pokemon.height / 10,
    weightInKilograms:
      pokemon.weight / 10,
    category: pokemon.category,
    generation: pokemon.generation,
    stats: pokemon.stats,
    weaknesses: pokemon.weaknesses,
    resistances: pokemon.resistances,
    immunities: pokemon.immunities,

    /*
     * Não envia learnDetails para evitar
     * prompts excessivamente grandes.
     */
    moves: compactMoves(pokemon),
  });

  const prompt = `
Você é o Professor PokéHub, um assistente especializado em Pokémon.

REGRAS:
- Responda sempre em português do Brasil.
- Use os dados fornecidos pela PokéAPI como contexto principal.
- Seja claro, objetivo e fácil de entender.
- Não invente atributos, tipos, habilidades ou movimentos.
- Ao recomendar uma build, use somente movimentos disponíveis no contexto.
- Organize builds em função, nature, habilidade, item, EVs, movimentos e estratégia.
- Caso não tenha certeza sobre algum item ou configuração competitiva, deixe isso claro.
- Responda somente a perguntas relacionadas a Pokémon.
- Não escreva respostas excessivamente longas.

DADOS DO POKÉMON:
${pokemonContext}

PERGUNTA DO USUÁRIO:
${normalizedQuestion}
  `.trim();

  const response =
    await gemini.models.generateContent({
      model,
      contents: prompt,
    });

  const answer = response.text?.trim();

  if (!answer) {
    throw new Error(
      "A Gemini não retornou uma resposta.",
    );
  }

  return answer;
}

export async function generatePokemonBuild({
  pokemonName,
  buildType,
}: GeneratePokemonBuildInput): Promise<PokemonBuild> {
  const normalizedBuildType =
    buildType.trim().toLowerCase();

  const pokemon =
    await getPokemonByNameOrId(
      pokemonName.trim().toLowerCase(),
    );

  const pokemonContext = JSON.stringify({
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
    immunities: pokemon.immunities,

    /*
     * Envia todos os nomes e dados básicos
     * dos golpes, mas remove learnDetails.
     */
    moves: compactMoves(pokemon),
  });

  const prompt = `
Você é o Professor PokéHub, especialista em builds de Pokémon.

Crie uma build do tipo "${normalizedBuildType}" para o Pokémon informado.

REGRAS:
- Responda sempre em português do Brasil.
- Retorne somente JSON válido.
- Não use Markdown.
- Use apenas habilidades presentes no contexto.
- Use apenas movimentos presentes no contexto.
- Mantenha os nomes dos movimentos exatamente como aparecem no contexto.
- Escolha exatamente quatro movimentos.
- Os EVs devem totalizar no máximo 508.
- Escreva os EVs em português.
- Escolha movimentos coerentes com a função da build.
- Considere o melhor atributo ofensivo ou defensivo do Pokémon.
- Evite golpes incompatíveis com a estratégia quando houver opções melhores.
- Caso não existam movimentos suficientes para uma boa build, explique isso na estratégia.
- A estratégia deve ser objetiva.

DADOS DO POKÉMON:
${pokemonContext}

FORMATO OBRIGATÓRIO:
{
  "role": "função da build",
  "nature": "nature recomendada",
  "ability": "habilidade recomendada",
  "item": "item recomendado",
  "evs": [
    "252 Ataque Especial",
    "252 Velocidade",
    "4 HP"
  ],
  "moves": [
    "movimento-1",
    "movimento-2",
    "movimento-3",
    "movimento-4"
  ],
  "strategy": "explicação curta de como usar a build"
}
  `.trim();

  const response =
    await gemini.models.generateContent({
      model,
      contents: prompt,

      config: {
        responseMimeType:
          "application/json",
        temperature: 0.35,
      },
    });

  const text = response.text?.trim();

  if (!text) {
    throw new Error(
      "A Gemini não retornou uma build.",
    );
  }

  const parsedBuild =
    parseJsonResponse<unknown>(
      text,
      "A Gemini retornou uma build em formato inválido.",
    );

  return validatePokemonBuild(
    parsedBuild,
  );
}

export async function analyzePokemonTeam({
  pokemonNames,
}: AnalyzePokemonTeamInput): Promise<TeamAnalysis> {
  if (
    !Array.isArray(pokemonNames) ||
    pokemonNames.length === 0 ||
    pokemonNames.length > 6
  ) {
    throw new Error(
      "O time deve possuir entre 1 e 6 Pokémon.",
    );
  }

  const normalizedPokemonNames =
    pokemonNames.map((pokemonName) => {
      const normalizedName =
        pokemonName.trim().toLowerCase();

      if (!normalizedName) {
        throw new Error(
          "O nome de um Pokémon do time está vazio.",
        );
      }

      return normalizedName;
    });

  /*
   * Não usa Set aqui.
   * Caso futuramente o sistema aceite
   * Pokémon repetidos, o time não será alterado.
   */
  const pokemonTeam = await Promise.all(
    normalizedPokemonNames.map(
      (pokemonName) =>
        getPokemonByNameOrId(pokemonName),
    ),
  );

  const compactTeamData =
    pokemonTeam.map((pokemon) => ({
      id: pokemon.id,
      name: pokemon.name,
      types: pokemon.types,
      abilities: pokemon.abilities,
      generation: pokemon.generation,

      stats: pokemon.stats.map(
        (stat) => ({
          name: stat.name,
          value: stat.value,
        }),
      ),

      weaknesses:
        pokemon.weaknesses.map(
          (weakness) => ({
            name: weakness.name,
            multiplier:
              weakness.multiplier,
          }),
        ),

      resistances:
        pokemon.resistances.map(
          (resistance) => ({
            name: resistance.name,
            multiplier:
              resistance.multiplier,
          }),
        ),

      immunities: pokemon.immunities,

      relevantMoves:
        getRelevantTeamMoves(pokemon),
    }));

  const teamContext = JSON.stringify(
    compactTeamData,
  );

  const prompt = `
Você é o Professor PokéHub, especialista em montagem e análise de times Pokémon.

Analise a equipe fornecida considerando sua composição completa.

REGRAS:
- Responda sempre em português do Brasil.
- Retorne somente JSON válido.
- Não use Markdown.
- A nota deve ser um número entre 0 e 10.
- Considere tipos, atributos, habilidades, fraquezas, resistências, imunidades e movimentos relevantes.
- Identifique fraquezas repetidas entre os integrantes.
- Avalie a cobertura ofensiva dos tipos disponíveis.
- Analise a distribuição entre atacantes físicos, especiais, defensivos e suporte.
- Não invente informações que não estejam no contexto.
- Dê sugestões práticas e objetivas.
- Retorne entre dois e cinco itens em cada lista.
- Não escreva textos excessivamente longos.
- Não recomende remover um Pokémon sem explicar qual problema seria resolvido.

TIME:
${teamContext}

FORMATO OBRIGATÓRIO:
{
  "score": 8.5,
  "summary": "Resumo geral e objetivo da equipe.",
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

  const response =
    await gemini.models.generateContent({
      model,
      contents: prompt,

      config: {
        responseMimeType:
          "application/json",
        temperature: 0.35,
      },
    });

  const text = response.text?.trim();

  if (!text) {
    throw new Error(
      "A Gemini não retornou a análise do time.",
    );
  }

  const parsedAnalysis =
    parseJsonResponse<unknown>(
      text,
      "A Gemini retornou uma análise em formato inválido.",
    );

  return validateTeamAnalysis(
    parsedAnalysis,
  );
}