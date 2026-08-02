import type { PokemonStat } from "../../types/pokemon";

import "./PokemonStats.css";

interface PokemonStatsProps {
  stats: PokemonStat[];
}

const statLabels: Record<string, string> = {
  hp: "HP",
  attack: "Ataque",
  defense: "Defesa",
  "special-attack": "Ataque especial",
  "special-defense": "Defesa especial",
  speed: "Velocidade"
};

function PokemonStats({ stats }: PokemonStatsProps) {
  return (
    <section className="pokemon-stats">
      <div className="pokemon-stats__header">
        <div>
          <span>Desempenho</span>
          <h2>Estatísticas base</h2>
        </div>

        <p>
          Valores oficiais retornados pela PokéAPI.
        </p>
      </div>

      <div className="pokemon-stats__list">
        {stats.map((stat) => {
          const percentage = Math.min((stat.value / 180) * 100, 100);

          return (
            <div className="pokemon-stats__item" key={stat.name}>
              <div className="pokemon-stats__info">
                <span>{statLabels[stat.name] ?? stat.name}</span>
                <strong>{stat.value}</strong>
              </div>

              <div className="pokemon-stats__bar">
                <div
                  className="pokemon-stats__progress"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default PokemonStats;