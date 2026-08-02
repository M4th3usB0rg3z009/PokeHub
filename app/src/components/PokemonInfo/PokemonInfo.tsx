import { useState } from "react";

import { useTeam } from "../../contexts/TeamContext";
import type { Pokemon } from "../../types/pokemon";
import { pokemonTypeNames } from "../../utils/pokemonTypes";

import "./PokemonInfo.css";

interface PokemonInfoProps {
  pokemon: Pokemon;
}

function PokemonInfo({ pokemon }: PokemonInfoProps) {
  const {
    addPokemonToTeam,
    removePokemonFromTeam,
    isPokemonOnTeam,
    teamIsFull,
  } = useTeam();

  const [teamMessage, setTeamMessage] = useState("");

  const pokemonIsOnTeam = isPokemonOnTeam(pokemon.id);

  function handleTeam() {
    if (pokemonIsOnTeam) {
      removePokemonFromTeam(pokemon.id);
      setTeamMessage(`${pokemon.name} saiu do seu time.`);
      return;
    }

    const result = addPokemonToTeam({
      id: pokemon.id,
      name: pokemon.name,
      image: pokemon.image,
      types: pokemon.types,
    });

    setTeamMessage(result.message);
  }

  return (
    <section className="pokemon-info">
      <div className="pokemon-info__visual">
        <span className="pokemon-info__number">
          #{String(pokemon.id).padStart(3, "0")}
        </span>

        <div className="pokemon-info__image-background">
          <img
            src={pokemon.image}
            alt={`Imagem do Pokémon ${pokemon.name}`}
          />
        </div>
      </div>

      <div className="pokemon-info__content">
        <div className="pokemon-info__top">
          <div>
            <span className="pokemon-info__label">
              Pokémon encontrado
            </span>

            <h2>{pokemon.name}</h2>
          </div>

          <button
            type="button"
            className={`pokemon-info__team-button ${
              pokemonIsOnTeam
                ? "pokemon-info__team-button--active"
                : ""
            }`}
            onClick={handleTeam}
            disabled={teamIsFull && !pokemonIsOnTeam}
          >
            <span aria-hidden="true">
              {pokemonIsOnTeam ? "✓" : "+"}
            </span>

            {pokemonIsOnTeam
              ? "No seu time"
              : teamIsFull
                ? "Time completo"
                : "Adicionar ao time"}
          </button>
        </div>

        <div className="pokemon-info__types">
          {pokemon.types.map((type) => (
            <span
              key={type}
              className={`type type--${type}`}
            >
              {pokemonTypeNames[type] ?? type}
            </span>
          ))}
        </div>

        {teamMessage && (
          <p
            className="pokemon-info__team-message"
            role="status"
          >
            {teamMessage}
          </p>
        )}

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