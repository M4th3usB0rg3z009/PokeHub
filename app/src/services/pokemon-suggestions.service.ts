import axios from "axios";

interface PokemonListItem {
  name: string;
  url: string;
}

interface PokemonListResponse {
  count: number;
  results: PokemonListItem[];
}

const pokeApi = axios.create({
  baseURL: "https://pokeapi.co/api/v2",
  timeout: 30000,
});

let cachedPokemonNames: string[] | null = null;

async function loadPokemonNames(): Promise<string[]> {
  if (cachedPokemonNames) {
    return cachedPokemonNames;
  }

  const countResponse =
    await pokeApi.get<PokemonListResponse>(
      "/pokemon",
      {
        params: {
          limit: 1,
          offset: 0,
        },
      },
    );

  const totalPokemon =
    countResponse.data.count;

  const response =
    await pokeApi.get<PokemonListResponse>(
      "/pokemon",
      {
        params: {
          limit: totalPokemon,
          offset: 0,
        },
      },
    );

  cachedPokemonNames =
    response.data.results
      .map((pokemon) => pokemon.name)
      .sort((firstName, secondName) =>
        firstName.localeCompare(secondName),
      );

  return cachedPokemonNames;
}

export async function getPokemonSuggestions(
  search: string,
): Promise<string[]> {
  const normalizedSearch = search
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");

  if (normalizedSearch.length < 2) {
    return [];
  }

  const pokemonNames =
    await loadPokemonNames();

  const startsWithSearch =
    pokemonNames.filter((name) =>
      name.startsWith(normalizedSearch),
    );

  const containsSearch =
    pokemonNames.filter(
      (name) =>
        !name.startsWith(normalizedSearch) &&
        name.includes(normalizedSearch),
    );

  return [
    ...startsWithSearch,
    ...containsSearch,
  ].slice(0, 8);
}