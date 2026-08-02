import axios from "axios";
import {
  BrainCircuit,
  BriefcaseBusiness,
  ChevronDown,
  Dumbbell,
  RefreshCw,
  Shield,
  Sparkles,
  Swords,
  WandSparkles,
} from "lucide-react";
import { useEffect, useState } from "react";

import {
  generatePokemonBuild,
  type BuildType,
  type PokemonBuild as PokemonBuildData,
} from "../../services/build.service";

import "./PokemonBuild.css";

interface PokemonBuildProps {
  pokemonName: string;
}

const buildTypeLabels: Record<BuildType, string> = {
  physical: "Física",
  special: "Especial",
  defensive: "Defensiva",
  support: "Suporte",
  balanced: "Equilibrada",
};

const buildTypeDescriptions: Record<BuildType, string> = {
  physical: "Foco em dano físico e pressão ofensiva.",
  special: "Foco em dano especial e cobertura ofensiva.",
  defensive: "Foco em resistência, sustentação e controle.",
  support: "Foco em utilidade e suporte para o time.",
  balanced: "Combinação equilibrada entre ataque e defesa.",
};

function PokemonBuild({ pokemonName }: PokemonBuildProps) {
  const [buildType, setBuildType] =
    useState<BuildType>("special");

  const [build, setBuild] =
    useState<PokemonBuildData | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setBuild(null);
    setError("");
  }, [pokemonName]);

  async function handleGenerateBuild() {
    try {
      setLoading(true);
      setError("");
      setBuild(null);

      const result = await generatePokemonBuild({
        pokemonName,
        buildType,
      });

      setBuild(result);
    } catch (requestError) {
      if (axios.isAxiosError(requestError)) {
        const message =
          requestError.response?.data?.message;

        setError(
          typeof message === "string"
            ? message
            : "Não foi possível gerar a build.",
        );

        return;
      }

      setError("Não foi possível gerar a build.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="pokemon-build">
      <div className="pokemon-build__header">
        <div className="pokemon-build__intro">
          <div className="pokemon-build__eyebrow">
            <WandSparkles
              size={16}
              aria-hidden="true"
            />

            <span>Estratégia com IA</span>
          </div>

          <h2>Build recomendada</h2>

          <p>
            Gere uma configuração competitiva para{" "}
            <strong>{pokemonName}</strong> usando os dados da
            PokéAPI e a análise do Professor PokéHub.
          </p>
        </div>

        <div className="pokemon-build__controls">
          <label htmlFor="build-type">
            Tipo de build
          </label>

          <div className="pokemon-build__select-wrapper">
            <select
              id="build-type"
              value={buildType}
              disabled={loading}
              onChange={(event) =>
                setBuildType(
                  event.target.value as BuildType,
                )
              }
            >
              {Object.entries(buildTypeLabels).map(
                ([value, label]) => (
                  <option
                    key={value}
                    value={value}
                  >
                    {label}
                  </option>
                ),
              )}
            </select>

            <ChevronDown
              size={16}
              aria-hidden="true"
            />
          </div>

          <small>
            {buildTypeDescriptions[buildType]}
          </small>

          <button
            type="button"
            disabled={loading}
            onClick={handleGenerateBuild}
          >
            {loading ? (
              <>
                <RefreshCw
                  size={17}
                  className="pokemon-build__button-spinner"
                  aria-hidden="true"
                />
                Gerando build...
              </>
            ) : build ? (
              <>
                <RefreshCw
                  size={17}
                  aria-hidden="true"
                />
                Gerar novamente
              </>
            ) : (
              <>
                <Sparkles
                  size={17}
                  aria-hidden="true"
                />
                Gerar build
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <p
          className="pokemon-build__error"
          role="alert"
        >
          {error}
        </p>
      )}

      {!build && !loading && !error && (
        <div className="pokemon-build__empty">
          <div className="pokemon-build__empty-icon">
            <BrainCircuit
              size={28}
              aria-hidden="true"
            />
          </div>

          <h3>Crie uma estratégia competitiva</h3>

          <p>
            Escolha o estilo da build e clique em{" "}
            <strong>Gerar build</strong>.
          </p>
        </div>
      )}

      {loading && (
        <div className="pokemon-build__loading">
          <div className="pokemon-build__spinner" />

          <h3>Analisando {pokemonName}</h3>

          <p>
            O Professor PokéHub está verificando atributos,
            habilidades e movimentos disponíveis.
          </p>
        </div>
      )}

      {build && (
        <div className="pokemon-build__result">
          <div className="pokemon-build__summary">
            <article>
              <div className="pokemon-build__summary-icon">
                <BriefcaseBusiness size={18} />
              </div>

              <div>
                <span>Função</span>
                <strong>{build.role}</strong>
              </div>
            </article>

            <article>
              <div className="pokemon-build__summary-icon">
                <BrainCircuit size={18} />
              </div>

              <div>
                <span>Nature</span>
                <strong>{build.nature}</strong>
              </div>
            </article>

            <article>
              <div className="pokemon-build__summary-icon">
                <Shield size={18} />
              </div>

              <div>
                <span>Habilidade</span>
                <strong>{build.ability}</strong>
              </div>
            </article>

            <article>
              <div className="pokemon-build__summary-icon">
                <Sparkles size={18} />
              </div>

              <div>
                <span>Item</span>
                <strong>{build.item}</strong>
              </div>
            </article>
          </div>

          <div className="pokemon-build__columns">
            <article className="pokemon-build__section">
              <div className="pokemon-build__section-header">
                <div>
                  <Dumbbell size={18} />
                </div>

                <h3>Distribuição de EVs</h3>
              </div>

              <ul>
                {build.evs.map((ev) => (
                  <li key={ev}>
                    <span />
                    {ev}
                  </li>
                ))}
              </ul>
            </article>

            <article className="pokemon-build__section">
              <div className="pokemon-build__section-header">
                <div>
                  <Swords size={18} />
                </div>

                <h3>Movimentos</h3>
              </div>

              <ul>
                {build.moves.map((move) => (
                  <li key={move}>
                    <span />
                    {move.replaceAll("-", " ")}
                  </li>
                ))}
              </ul>
            </article>
          </div>

          <article className="pokemon-build__strategy">
            <div className="pokemon-build__strategy-header">
              <BrainCircuit size={19} />

              <h3>Como usar</h3>
            </div>

            <p>{build.strategy}</p>
          </article>
        </div>
      )}
    </section>
  );
}

export default PokemonBuild;