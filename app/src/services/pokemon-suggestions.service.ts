import axios from "axios";

interface PokemonSpeciesItem {
  name: string;
  url: string;
}

interface PokemonSpeciesResponse {
  results: PokemonSpeciesItem[];
}

const pokeApi = axios.create({
  baseURL: "https://pokeapi.co/api/v2",
  timeout: 10000,
});

let cachedPokemonNames: string[] | null = null;

async function loadPokemonNames(): Promise<string[]> {
  if (cachedPokemonNames) {
    return cachedPokemonNames;
  }

  const response =
    await pokeApi.get<PokemonSpeciesResponse>(
      "/pokemon-species?limit=2000",
    );

  cachedPokemonNames = response.data.results.map(
    (pokemon) => pokemon.name,
  );

  return cachedPokemonNames;
}

export async function getPokemonSuggestions(
  search: string,
): Promise<string[]> {
  const normalizedSearch = search
    .trim()
    .toLowerCase();

  if (normalizedSearch.length < 2) {
    return [];
  }

  const pokemonNames = await loadPokemonNames();

  const startsWithSearch = pokemonNames.filter(
    (name) => name.startsWith(normalizedSearch),
  );

  const containsSearch = pokemonNames.filter(
    (name) =>
      !name.startsWith(normalizedSearch) &&
      name.includes(normalizedSearch),
  );

  return [
    ...startsWithSearch,
    ...containsSearch,
  ].slice(0, 8);
}