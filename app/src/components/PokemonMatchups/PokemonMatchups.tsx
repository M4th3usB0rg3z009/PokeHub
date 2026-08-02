import {
  Bird,
  Brain,
  Bug,
  Circle,
  CircleDot,
  Cloud,
  Dumbbell,
  Flame,
  Gem,
  Leaf,
  Moon,
  Mountain,
  Shield,
  ShieldCheck,
  ShieldOff,
  Skull,
  Snowflake,
  Sparkles,
  TriangleAlert,
  Waves,
  Zap,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

import { pokemonTypeNames } from "../../utils/pokemonTypes";

import "./PokemonMatchups.css";

interface TypeRelation {
  name: string;
  multiplier: number;
}

interface PokemonMatchupsProps {
  weaknesses: TypeRelation[];
  resistances: TypeRelation[];
  immunities: string[];
}

const pokemonTypeIcons: Record<string, LucideIcon> = {
  normal: Circle,
  fire: Flame,
  water: Waves,
  electric: Zap,
  grass: Leaf,
  ice: Snowflake,
  fighting: Dumbbell,
  poison: Skull,
  ground: Mountain,
  flying: Bird,
  psychic: Brain,
  bug: Bug,
  rock: Gem,
  ghost: Moon,
  dragon: Sparkles,
  dark: Cloud,
  steel: Shield,
  fairy: Sparkles,
};

function PokemonTypeBadge({
  typeName,
  multiplier,
}: {
  typeName: string;
  multiplier: string;
}) {
  const TypeIcon =
    pokemonTypeIcons[typeName] ?? CircleDot;

  return (
    <span className={`type type--${typeName}`}>
      <span className="pokemon-matchups__type-icon">
        <TypeIcon
          size={14}
          strokeWidth={2.3}
          aria-hidden="true"
        />
      </span>

      <span className="pokemon-matchups__type-name">
        {pokemonTypeNames[typeName] ?? typeName}
      </span>

      <strong>{multiplier}</strong>
    </span>
  );
}

function PokemonMatchups({
  weaknesses,
  resistances,
  immunities,
}: PokemonMatchupsProps) {
  return (
    <section className="pokemon-matchups">
      <div className="pokemon-matchups__header">
        <span>Combate</span>

        <h2>Relações de tipos</h2>

        <p>
          Entenda quais tipos causam mais ou menos dano neste
          Pokémon.
        </p>
      </div>

      <div className="pokemon-matchups__grid">
        <article className="pokemon-matchups__card pokemon-matchups__card--weakness">
          <div className="pokemon-matchups__card-header">
            <span className="pokemon-matchups__icon">
              <TriangleAlert
                size={20}
                strokeWidth={2.4}
                aria-hidden="true"
              />
            </span>

            <div>
              <h3>Fraquezas</h3>
              <p>Dano recebido aumentado</p>
            </div>
          </div>

          <div className="pokemon-matchups__types">
            {weaknesses.length > 0 ? (
              weaknesses.map((type) => (
                <PokemonTypeBadge
                  key={type.name}
                  typeName={type.name}
                  multiplier={`${type.multiplier}x`}
                />
              ))
            ) : (
              <p>Nenhuma fraqueza identificada.</p>
            )}
          </div>
        </article>

        <article className="pokemon-matchups__card pokemon-matchups__card--resistance">
          <div className="pokemon-matchups__card-header">
            <span className="pokemon-matchups__icon">
              <ShieldCheck
                size={20}
                strokeWidth={2.4}
                aria-hidden="true"
              />
            </span>

            <div>
              <h3>Resistências</h3>
              <p>Dano recebido reduzido</p>
            </div>
          </div>

          <div className="pokemon-matchups__types">
            {resistances.length > 0 ? (
              resistances.map((type) => (
                <PokemonTypeBadge
                  key={type.name}
                  typeName={type.name}
                  multiplier={`${type.multiplier}x`}
                />
              ))
            ) : (
              <p>Nenhuma resistência identificada.</p>
            )}
          </div>
        </article>

        <article className="pokemon-matchups__card pokemon-matchups__card--immunity">
          <div className="pokemon-matchups__card-header">
            <span className="pokemon-matchups__icon">
              <ShieldOff
                size={20}
                strokeWidth={2.4}
                aria-hidden="true"
              />
            </span>

            <div>
              <h3>Imunidades</h3>
              <p>Nenhum dano recebido</p>
            </div>
          </div>

          <div className="pokemon-matchups__types">
            {immunities.length > 0 ? (
              immunities.map((type) => (
                <PokemonTypeBadge
                  key={type}
                  typeName={type}
                  multiplier="0x"
                />
              ))
            ) : (
              <p>Nenhuma imunidade identificada.</p>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}

export default PokemonMatchups;