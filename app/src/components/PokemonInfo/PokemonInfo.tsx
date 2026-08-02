import type { Pokemon } from "../../types/pokemon";

import "./PokemonInfo.css";

interface PokemonInfoProps {
  pokemon: Pokemon;
}

function PokemonInfo({ pokemon }: PokemonInfoProps) {
  return (
    <section className="pokemon-info">
      <div className="pokemon-info__image-area">
        <span className="pokemon-info__number">
          #{String(pokemon.id).padStart(3, "0")}
        </span>

        <img
          src={pokemon.image}
          alt={`Imagem do Pokémon ${pokemon.name}`}
        />
      </div>

      <div className="pokemon-info__content">
        <div className="pokemon-info__header">
          <div>
            <span className="pokemon-info__label">
              Pokémon encontrado
            </span>

            <h2>{pokemon.name}</h2>
          </div>

          <div className="pokemon-info__types">
            {pokemon.types.map((type) => (
              <span
                key={type}
                className={`type type--${type}`}
              >
                {type}
              </span>
            ))}
          </div>
        </div>

        <p className="pokemon-info__description">
          {pokemon.description}
        </p>

        <div className="pokemon-info__details">
          <div className="pokemon-info__detail">
            <span>Altura</span>
            <strong>{pokemon.height / 10} m</strong>
          </div>

          <div className="pokemon-info__detail">
            <span>Peso</span>
            <strong>{pokemon.weight / 10} kg</strong>
          </div>

          <div className="pokemon-info__detail">
            <span>Categoria</span>
            <strong>{pokemon.category}</strong>
          </div>

          <div className="pokemon-info__detail">
            <span>Geração</span>
            <strong>
              {pokemon.generation
                .replace("generation-", "")
                .toUpperCase()}
            </strong>
          </div>
        </div>

        <div className="pokemon-info__abilities">
          <span>Habilidades</span>

          <div>
            {pokemon.abilities.map((ability) => (
              <strong key={ability}>
                {ability}
              </strong>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default PokemonInfo;