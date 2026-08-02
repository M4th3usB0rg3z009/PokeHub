export interface PokemonStat {
  name: string;
  value: number;
}

export interface PokemonTypeRelation {
  name: string;
  multiplier: number;
}

export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  image: string;

  description: string;
  category: string;
  generation: string;

  types: string[];
  abilities: string[];
  stats: PokemonStat[];
  weaknesses: PokemonTypeRelation[];
  resistances: PokemonTypeRelation[];
  immunities: string[];
  evolutions: PokemonEvolution[];
  moves: PokemonMove[];
}

export interface PokemonEvolution {
  id: number;
  name: string;
  image: string;
}

export interface PokemonMove {
  name: string;
  type: string;
  power: number | null;
  accuracy: number | null;
  damageClass: "physical" | "special" | "status";
  learnDetails: PokemonMoveLearnDetail[];
}

export interface PokemonMoveLearnDetail {
  method: string;
  level: number;
  versionGroup: string;
  generation: string;
}