import type { PokemonTypeRelation } from "../../types/pokemon";
import { pokemonTypeNames } from "../../utils/pokemonTypes";

import "./PokemonMatchups.css";

interface PokemonMatchupsProps {
  weaknesses: PokemonTypeRelation[];
  resistances: PokemonTypeRelation[];
  immunities: string[];
}

function PokemonMatchups({
  weaknesses,
  resistances,
  immunities
}: PokemonMatchupsProps) {
  return (
    <section className="pokemon-matchups">
      <div className="pokemon-matchups__header">
        <span>Combinações de tipo</span>
        <h2>Fraquezas e resistências</h2>
      </div>

      <div className="pokemon-matchups__grid">
        <div className="pokemon-matchups__group">
          <h3>Fraquezas</h3>

          <div className="pokemon-matchups__types">
            {weaknesses.map((type) => (
              <span
                key={type.name}
                className={`matchup matchup--weak type--${type.name}`}
              >
                {pokemonTypeNames[type.name] ?? type.name} {type.multiplier}x
              </span>
            ))}
          </div>
        </div>

        <div className="pokemon-matchups__group">
          <h3>Resistências</h3>

          <div className="pokemon-matchups__types">
            {resistances.map((type) => (
              <span
                key={type.name}
                className={`matchup matchup--resistant type--${type.name}`}
              >
                {pokemonTypeNames[type.name] ?? type.name} {type.multiplier}x
              </span>
            ))}
          </div>
        </div>

        <div className="pokemon-matchups__group">
          <h3>Imunidades</h3>

          <div className="pokemon-matchups__types">
            {immunities.length > 0 ? (
              immunities.map((type) => (
                <span
                  key={type}
                  className={`matchup matchup--immune type--${type}`}
                >
                  {type} 0x
                </span>
              ))
            ) : (
              <p>Nenhuma imunidade por tipo.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default PokemonMatchups;