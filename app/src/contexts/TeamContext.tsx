import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type { ReactNode } from "react";
import type { TeamPokemon } from "../types/team";

interface AddPokemonResult {
  success: boolean;
  message: string;
}

interface TeamContextData {
  team: TeamPokemon[];
  addPokemonToTeam: (
    pokemon: TeamPokemon,
  ) => AddPokemonResult;
  removePokemonFromTeam: (pokemonId: number) => void;
  isPokemonOnTeam: (pokemonId: number) => boolean;
  teamIsFull: boolean;
}

interface TeamProviderProps {
  children: ReactNode;
}

const TEAM_STORAGE_KEY = "@pokehub:team";
const MAX_TEAM_SIZE = 6;

const TeamContext =
  createContext<TeamContextData | undefined>(undefined);

function loadTeam(): TeamPokemon[] {
  try {
    const storedTeam = localStorage.getItem(
      TEAM_STORAGE_KEY,
    );

    if (!storedTeam) {
      return [];
    }

    const parsedTeam = JSON.parse(storedTeam);

    if (!Array.isArray(parsedTeam)) {
      return [];
    }

    return parsedTeam.slice(0, MAX_TEAM_SIZE);
  } catch {
    return [];
  }
}

export function TeamProvider({
  children,
}: TeamProviderProps) {
  const [team, setTeam] =
    useState<TeamPokemon[]>(loadTeam);

  useEffect(() => {
    localStorage.setItem(
      TEAM_STORAGE_KEY,
      JSON.stringify(team),
    );
  }, [team]);

  const teamIsFull = team.length >= MAX_TEAM_SIZE;

  function isPokemonOnTeam(pokemonId: number) {
    return team.some(
      (pokemon) => pokemon.id === pokemonId,
    );
  }

  function addPokemonToTeam(
    pokemon: TeamPokemon,
  ): AddPokemonResult {
    if (isPokemonOnTeam(pokemon.id)) {
      return {
        success: false,
        message: `${pokemon.name} já está no seu time.`,
      };
    }

    if (teamIsFull) {
      return {
        success: false,
        message:
          "Seu time já possui o limite de 6 Pokémon.",
      };
    }

    setTeam((currentTeam) => [
      ...currentTeam,
      pokemon,
    ]);

    return {
      success: true,
      message: `${pokemon.name} entrou para o seu time!`,
    };
  }

  function removePokemonFromTeam(
    pokemonId: number,
  ) {
    setTeam((currentTeam) =>
      currentTeam.filter(
        (pokemon) => pokemon.id !== pokemonId,
      ),
    );
  }

  return (
    <TeamContext.Provider
      value={{
        team,
        addPokemonToTeam,
        removePokemonFromTeam,
        isPokemonOnTeam,
        teamIsFull,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
}

export function useTeam() {
  const context = useContext(TeamContext);

  if (!context) {
    throw new Error(
      "useTeam deve ser usado dentro de TeamProvider.",
    );
  }

  return context;
}