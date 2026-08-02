import {
  ArrowRight,
  ExternalLink,
} from "lucide-react";

import "./PokemonEvolution.css";

interface PokemonEvolutionItem {
  id: number;
  name: string;
  image: string;
}

interface PokemonEvolutionProps {
  evolutions: PokemonEvolutionItem[];
  onSelectPokemon: (name: string) => void;
}

function PokemonEvolution({
  evolutions,
  onSelectPokemon,
}: PokemonEvolutionProps) {
  return (
    <section className="pokemon-evolution">
      <div className="pokemon-evolution__header">
        <span>Linha evolutiva</span>

        <h2>Evoluções</h2>

        <p>
          Acompanhe as diferentes formas desta espécie
          ao longo da evolução.
        </p>
      </div>

      <div className="pokemon-evolution__track">
        {evolutions.map((pokemon, index) => (
          <div
            key={pokemon.id}
            className="pokemon-evolution__step"
          >
            <article className="pokemon-evolution__card">
              <span className="pokemon-evolution__number">
                #{String(pokemon.id).padStart(3, "0")}
              </span>

              <div className="pokemon-evolution__image">
                <img
                  src={pokemon.image}
                  alt={`Imagem do Pokémon ${pokemon.name}`}
                />
              </div>

              <h3>{pokemon.name}</h3>

              <button
                type="button"
                onClick={() =>
                  onSelectPokemon(pokemon.name)
                }
              >
                Ver informações
                <ExternalLink size={15} />
              </button>
            </article>

            {index < evolutions.length - 1 && (
              <div
                className="pokemon-evolution__connector"
                aria-hidden="true"
              >
                <span />
                <ArrowRight size={22} />
                <span />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default PokemonEvolution;