import {
  ExternalLink,
  Plus,
  Trash2,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router";

import Navbar from "../../components/Navbar/Navbar";
import TeamAnalysis from "../../components/TeamAnalysis/TeamAnalysis";
import { useTeam } from "../../contexts/TeamContext";
import { pokemonTypeNames } from "../../utils/pokemonTypes";

import "./TeamPage.css";

const MAX_TEAM_SIZE = 6;

function Team() {
  const navigate = useNavigate();

  const { team, removePokemonFromTeam } = useTeam();

  const emptySlots = Math.max(
    MAX_TEAM_SIZE - team.length,
    0,
  );

  const progressPercentage =
    (team.length / MAX_TEAM_SIZE) * 100;

  function handleViewPokemon(name: string) {
    navigate("/", {
      state: {
        pokemonName: name,
      },
    });
  }

  function handleAddPokemon() {
    navigate("/");
  }

  return (
    <div className="team-page">
      <Navbar />

      <main className="team-page__content">
        <header className="team-page__header">
          <div className="team-page__introduction">
            <div className="team-page__eyebrow">
              <Users size={17} aria-hidden="true" />
              <span>Equipe Pokémon</span>
            </div>

            <h1>Meu Time</h1>

            <p>
              Monte uma equipe com até seis Pokémon e use a IA
              para analisar fraquezas, cobertura e sinergia.
            </p>
          </div>

          <aside className="team-page__counter">
            <span>Integrantes</span>

            <strong>
              {team.length}
              <small>/{MAX_TEAM_SIZE}</small>
            </strong>

            <div
              className="team-page__counter-bar"
              role="progressbar"
              aria-label="Quantidade de integrantes do time"
              aria-valuemin={0}
              aria-valuemax={MAX_TEAM_SIZE}
              aria-valuenow={team.length}
            >
              <div
                style={{
                  width: `${progressPercentage}%`,
                }}
              />
            </div>

            <p>
              {team.length === MAX_TEAM_SIZE
                ? "Seu time está completo."
                : `${emptySlots} ${
                    emptySlots === 1
                      ? "espaço disponível"
                      : "espaços disponíveis"
                  }`}
            </p>
          </aside>
        </header>

        <section
          className="team-page__slots"
          aria-label="Integrantes do time"
        >
          {team.map((pokemon, index) => (
            <article
              key={pokemon.id}
              className="team-card"
            >
              <div className="team-card__top">
                <span className="team-card__position">
                  Integrante {index + 1}
                </span>

                <span className="team-card__number">
                  #{String(pokemon.id).padStart(3, "0")}
                </span>
              </div>

              <div className="team-card__visual">
                <div
                  className="team-card__circle"
                  aria-hidden="true"
                />

                <img
                  src={pokemon.image}
                  alt={`Imagem do Pokémon ${pokemon.name}`}
                />
              </div>

              <div className="team-card__content">
                <h2>{pokemon.name}</h2>

                <div className="team-card__types">
                  {pokemon.types.map((type) => (
                    <span
                      key={type}
                      className={`type type--${type}`}
                    >
                      {pokemonTypeNames[type] ?? type}
                    </span>
                  ))}
                </div>

                <div className="team-card__actions">
                  <button
                    type="button"
                    className="team-card__details"
                    onClick={() =>
                      handleViewPokemon(pokemon.name)
                    }
                  >
                    <ExternalLink
                      size={15}
                      aria-hidden="true"
                    />

                    <span>Ver informações</span>
                  </button>

                  <button
                    type="button"
                    className="team-card__remove"
                    aria-label={`Remover ${pokemon.name} do time`}
                    title={`Remover ${pokemon.name}`}
                    onClick={() =>
                      removePokemonFromTeam(pokemon.id)
                    }
                  >
                    <Trash2
                      size={17}
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </div>
            </article>
          ))}

          {Array.from({ length: emptySlots }).map(
            (_, index) => {
              const slotNumber =
                team.length + index + 1;

              return (
                <button
                  key={`empty-slot-${slotNumber}`}
                  type="button"
                  className="team-slot"
                  onClick={handleAddPokemon}
                >
                  <div className="team-slot__icon">
                    <Plus
                      size={26}
                      aria-hidden="true"
                    />
                  </div>

                  <strong>Adicionar Pokémon</strong>

                  <span>
                    Espaço {slotNumber} de {MAX_TEAM_SIZE}
                  </span>
                </button>
              );
            },
          )}
        </section>

        <TeamAnalysis
          pokemonNames={team.map(
            (pokemon) => pokemon.name,
          )}
        />
      </main>
    </div>
  );
}

export default Team;