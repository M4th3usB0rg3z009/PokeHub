import type { PokemonStat } from "../../types/pokemon";

import "./PokemonStats.css";

interface PokemonStatsProps {
  stats: PokemonStat[];
}

const statNames: Record<string, string> = {
  hp: "HP",
  attack: "Ataque",
  defense: "Defesa",
  "special-attack": "Ataque Especial",
  "special-defense": "Defesa Especial",
  speed: "Velocidade",
};

function PokemonStats({ stats }: PokemonStatsProps) {
  const totalStats = stats.reduce(
    (total, stat) => total + stat.value,
    0,
  );

  function calculatePercentage(value: number) {
    return Math.min((value / 180) * 100, 100);
  }

  return (
    <section className="pokemon-stats">
      <div className="pokemon-stats__header">
        <div>
          <span>Desempenho</span>
          <h2>Estatísticas base</h2>

          <p>
            Visão geral dos atributos naturais deste Pokémon.
          </p>
        </div>

        <div className="pokemon-stats__total">
          <span>Total</span>
          <strong>{totalStats}</strong>
        </div>
      </div>

      <div className="pokemon-stats__list">
        {stats.map((stat) => (
          <div
            className="pokemon-stats__item"
            key={stat.name}
          >
            <div className="pokemon-stats__item-header">
              <span>
                {statNames[stat.name] ?? stat.name}
              </span>

              <strong>{stat.value}</strong>
            </div>

            <div className="pokemon-stats__bar">
              <div
                style={{
                  width: `${calculatePercentage(
                    stat.value,
                  )}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default PokemonStats;