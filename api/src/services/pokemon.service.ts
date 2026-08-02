import axios from "axios";
import { translatePokemonData } from "./translation.service.js";

const pokeApi = axios.create({
  baseURL: "https://pokeapi.co/api/v2",
  timeout: 10000,
});

interface TypeDamageRelations {
  double_damage_from: Array<{ name: string; url: string }>;
  half_damage_from: Array<{ name: string; url: string }>;
  no_damage_from: Array<{ name: string; url: string }>;
}

interface TypeResponse {
  damage_relations: TypeDamageRelations;
}

interface PokemonSpeciesResponse {
  evolution_chain: {
    url: string;
  };

  generation: {
    name: string;
  };

  genera: Array<{
    genus: string;
    language: {
      name: string;
    };
  }>;

  flavor_text_entries: Array<{
    flavor_text: string;
    language: {
      name: string;
    };
  }>;
}

interface EvolutionChainNode {
  species: {
    name: string;
    url: string;
  };

  evolves_to: EvolutionChainNode[];
}

interface EvolutionChainResponse {
  chain: EvolutionChainNode;
}

interface PokemonEvolution {
  id: number;
  name: string;
  image: string;
}

function countTypeRelations(types: TypeResponse[]) {
  const multipliers: Record<string, number> = {};

  for (const type of types) {
    for (const relation of type.damage_relations.double_damage_from) {
      multipliers[relation.name] =
        (multipliers[relation.name] ?? 1) * 2;
    }

    for (const relation of type.damage_relations.half_damage_from) {
      multipliers[relation.name] =
        (multipliers[relation.name] ?? 1) * 0.5;
    }

    for (const relation of type.damage_relations.no_damage_from) {
      multipliers[relation.name] = 0;
    }
  }

  return {
    weaknesses: Object.entries(multipliers)
      .filter(([, multiplier]) => multiplier > 1)
      .map(([name, multiplier]) => ({
        name,
        multiplier,
      })),

    resistances: Object.entries(multipliers)
      .filter(
        ([, multiplier]) =>
          multiplier > 0 && multiplier < 1,
      )
      .map(([name, multiplier]) => ({
        name,
        multiplier,
      })),

    immunities: Object.entries(multipliers)
      .filter(([, multiplier]) => multiplier === 0)
      .map(([name]) => name),
  };
}

function extractIdFromUrl(url: string): number {
  const parts = url.split("/").filter(Boolean);
  const id = Number(parts.at(-1));

  if (!Number.isInteger(id)) {
    throw new Error(
      "Não foi possível identificar o Pokémon.",
    );
  }

  return id;
}

function flattenEvolutionChain(
  node: EvolutionChainNode,
): Array<{ id: number; name: string }> {
  const currentPokemon = {
    id: extractIdFromUrl(node.species.url),
    name: node.species.name,
  };

  return [
    currentPokemon,
    ...node.evolves_to.flatMap((nextEvolution) =>
      flattenEvolutionChain(nextEvolution),
    ),
  ];
}

async function getEvolutionChain(
  evolutionChainUrl: string,
): Promise<PokemonEvolution[]> {
  const evolutionChainResponse =
    await axios.get<EvolutionChainResponse>(
      evolutionChainUrl,
    );

  const evolutions = flattenEvolutionChain(
    evolutionChainResponse.data.chain,
  );

  return Promise.all(
    evolutions.map(async (evolution) => {
      const pokemonResponse = await pokeApi.get(
        `/pokemon/${evolution.id}`,
      );

      return {
        id: evolution.id,
        name: evolution.name,
        image:
          pokemonResponse.data.sprites.other[
            "official-artwork"
          ].front_default ??
          pokemonResponse.data.sprites.front_default,
      };
    }),
  );
}

function findTranslatedEntry<
  T extends {
    language: {
      name: string;
    };
  },
>(entries: T[]): T | undefined {
  const preferredLanguages = ["pt-br", "pt", "en"];

  for (const language of preferredLanguages) {
    const entry = entries.find(
      (item) =>
        item.language.name.toLowerCase() === language,
    );

    if (entry) {
      return entry;
    }
  }

  return entries[0];
}

export async function getPokemonByNameOrId(
  nameOrId: string,
) {
  const normalizedValue = nameOrId
    .trim()
    .toLowerCase();

  const response = await pokeApi.get(
    `/pokemon/${normalizedValue}`,
  );

  const pokemon = response.data;

  const speciesResponse =
    await pokeApi.get<PokemonSpeciesResponse>(
      `/pokemon-species/${pokemon.id}`,
    );

  const species = speciesResponse.data;

  const typeNames = pokemon.types.map(
    (item: { type: { name: string } }) =>
      item.type.name,
  );

  const typeResponses = await Promise.all(
    typeNames.map(async (typeName: string) => {
      const typeResponse =
        await pokeApi.get<TypeResponse>(
          `/type/${typeName}`,
        );

      return typeResponse.data;
    }),
  );

  const typeRelations =
    countTypeRelations(typeResponses);

  const evolutions = await getEvolutionChain(
    species.evolution_chain.url,
  );

  const descriptionEntry = findTranslatedEntry(
    species.flavor_text_entries,
  );

  const categoryEntry = findTranslatedEntry(
    species.genera,
  );

  const description =
    descriptionEntry?.flavor_text
      .replace(/\f/g, " ")
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim() ?? "Descrição não disponível.";

  const category =
    categoryEntry?.genus ??
    "Categoria não disponível.";

  const generation = species.generation.name;

  const originalAbilities = pokemon.abilities.map(
    (item: {
      ability: {
        name: string;
      };
    }) => item.ability.name,
  );

  let translatedDescription = description;
  let translatedCategory = category;
  let translatedAbilities = originalAbilities;

  try {
    const translatedData =
      await translatePokemonData({
        description,
        category,
        abilities: originalAbilities,
      });

    translatedDescription =
      translatedData.description;

    translatedCategory =
      translatedData.category;

    translatedAbilities =
      translatedData.abilities;
  } catch (error) {
    console.error(
      "Erro ao traduzir os dados do Pokémon:",
      error,
    );
  }

  const moves = pokemon.moves
  .slice(0, 30)
  .map(
    (item: {
      move: {
        name: string;
      };
    }) => ({
      name: item.move.name,
    }),
  );

return {
  id: pokemon.id,
  name: pokemon.name,
  height: pokemon.height,
  weight: pokemon.weight,

  description: translatedDescription,
  category: translatedCategory,
  generation,

  image:
    pokemon.sprites.other["official-artwork"]
      .front_default ??
    pokemon.sprites.front_default,

  types: typeNames,
  abilities: translatedAbilities,
  moves,

  stats: pokemon.stats.map(
    (item: {
      base_stat: number;
      stat: {
        name: string;
      };
    }) => ({
      name: item.stat.name,
      value: item.base_stat,
    }),
  ),

  weaknesses: typeRelations.weaknesses,
  resistances: typeRelations.resistances,
  immunities: typeRelations.immunities,
  evolutions,
};
}