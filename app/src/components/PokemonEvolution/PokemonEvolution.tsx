import type {
  PokemonEvolution as PokemonEvolutionType
} from "../../types/pokemon";

import "./PokemonEvolution.css";

interface PokemonEvolutionProps {
  evolutions: PokemonEvolutionType[];
  onSelectPokemon: (name: string) => void;
}

function PokemonEvolution({
  evolutions,
  onSelectPokemon
}: PokemonEvolutionProps) {
  return (
    <section className="pokemon-evolution">
      <div className="pokemon-evolution__header">
        <span>Linha evolutiva</span>
        <h2>Evoluções</h2>
      </div>

      <div className="pokemon-evolution__list">
        {evolutions.map((pokemon, index) => (
          <div
            className="pokemon-evolution__step"
            key={pokemon.id}
          >
            <button
              type="button"
              className="pokemon-evolution__card"
              onClick={() => onSelectPokemon(pokemon.name)}
              aria-label={`Pesquisar ${pokemon.name}`}
            >
              <span className="pokemon-evolution__number">
                #{String(pokemon.id).padStart(3, "0")}
              </span>

              <img
                src={pokemon.image}
                alt={`Imagem do Pokémon ${pokemon.name}`}
              />

              <h3>{pokemon.name}</h3>

              <small>Ver informações</small>
            </button>

            {index < evolutions.length - 1 && (
              <span
                className="pokemon-evolution__arrow"
                aria-hidden="true"
              >
                →
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default PokemonEvolution;