import axios from "axios";
import {
  BrainCircuit,
  CheckCircle2,
  Gauge,
  Lightbulb,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  analyzePokemonTeam,
  type TeamAnalysis as TeamAnalysisData,
} from "../../services/team-analysis.service";

import "./TeamAnalysis.css";

interface TeamAnalysisProps {
  pokemonNames: string[];
}

interface StoredTeamAnalysis {
  teamKey: string;
  analysis: TeamAnalysisData;
}

const ANALYSIS_STORAGE_KEY =
  "@pokehub:team-analysis";

function TeamAnalysis({
  pokemonNames,
}: TeamAnalysisProps) {
  const [analysis, setAnalysis] =
    useState<TeamAnalysisData | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const teamIsEmpty =
    pokemonNames.length === 0;

  const teamKey = useMemo(() => {
    return [...pokemonNames]
      .map((name) => name.toLowerCase())
      .sort()
      .join("|");
  }, [pokemonNames]);

  useEffect(() => {
    setError("");

    if (teamIsEmpty) {
      setAnalysis(null);

      sessionStorage.removeItem(
        ANALYSIS_STORAGE_KEY,
      );

      return;
    }

    try {
      const storedValue =
        sessionStorage.getItem(
          ANALYSIS_STORAGE_KEY,
        );

      if (!storedValue) {
        setAnalysis(null);
        return;
      }

      const storedAnalysis =
        JSON.parse(
          storedValue,
        ) as StoredTeamAnalysis;

      if (
        storedAnalysis.teamKey === teamKey
      ) {
        setAnalysis(
          storedAnalysis.analysis,
        );

        return;
      }

      setAnalysis(null);

      sessionStorage.removeItem(
        ANALYSIS_STORAGE_KEY,
      );
    } catch {
      setAnalysis(null);

      sessionStorage.removeItem(
        ANALYSIS_STORAGE_KEY,
      );
    }
  }, [teamKey, teamIsEmpty]);

  async function handleAnalyzeTeam() {
    if (teamIsEmpty) {
      setError(
        "Adicione pelo menos um Pokémon ao time.",
      );

      return;
    }

    try {
      setLoading(true);
      setError("");

      const result =
        await analyzePokemonTeam(
          pokemonNames,
        );

      setAnalysis(result);

      const storedAnalysis: StoredTeamAnalysis =
        {
          teamKey,
          analysis: result,
        };

      sessionStorage.setItem(
        ANALYSIS_STORAGE_KEY,
        JSON.stringify(storedAnalysis),
      );
    } catch (requestError) {
      if (
        axios.isAxiosError(requestError)
      ) {
        const message =
          requestError.response?.data
            ?.message;

        setError(
          typeof message === "string"
            ? message
            : "Não foi possível analisar o time.",
        );

        return;
      }

      setError(
        "Não foi possível analisar o time.",
      );
    } finally {
      setLoading(false);
    }
  }

  const scorePercentage = analysis
    ? Math.min(
        Math.max(
          analysis.score * 10,
          0,
        ),
        100,
      )
    : 0;

  function getScoreLabel(score: number) {
    if (score >= 9) {
      return "Excelente";
    }

    if (score >= 7.5) {
      return "Muito bom";
    }

    if (score >= 6) {
      return "Equilibrado";
    }

    if (score >= 4) {
      return "Precisa melhorar";
    }

    return "Muito vulnerável";
  }

  return (
    <section className="team-analysis">
      <header className="team-analysis__header">
        <div className="team-analysis__introduction">
          <div className="team-analysis__eyebrow">
            <BrainCircuit
              size={17}
              aria-hidden="true"
            />

            <span>
              Inteligência artificial
            </span>
          </div>

          <h2>Análise do time</h2>

          <p>
            Avalie sinergia, fraquezas,
            cobertura ofensiva e possíveis
            melhorias para sua equipe.
          </p>
        </div>

        <button
          type="button"
          className="team-analysis__button"
          onClick={handleAnalyzeTeam}
          disabled={
            loading || teamIsEmpty
          }
        >
          {loading ? (
            <>
              <RefreshCw
                size={18}
                className="team-analysis__button-spinner"
                aria-hidden="true"
              />

              Analisando time...
            </>
          ) : analysis ? (
            <>
              <RefreshCw
                size={18}
                aria-hidden="true"
              />

              Analisar novamente
            </>
          ) : (
            <>
              <Sparkles
                size={18}
                aria-hidden="true"
              />

              Analisar meu time
            </>
          )}
        </button>
      </header>

      {error && (
        <div
          className="team-analysis__error"
          role="alert"
        >
          <ShieldAlert
            size={18}
            aria-hidden="true"
          />

          <span>{error}</span>
        </div>
      )}

      {!analysis &&
        !loading &&
        !error && (
          <div className="team-analysis__empty">
            <div className="team-analysis__empty-icon">
              <BrainCircuit
                size={30}
                aria-hidden="true"
              />
            </div>

            <h3>
              {teamIsEmpty
                ? "Monte seu time primeiro"
                : "Seu time está pronto para análise"}
            </h3>

            <p>
              {teamIsEmpty
                ? "Adicione pelo menos um Pokémon para liberar a análise inteligente."
                : "Clique em Analisar meu time para receber uma avaliação completa da equipe."}
            </p>
          </div>
        )}

      {loading && (
        <div className="team-analysis__loading">
          <div className="team-analysis__loading-orbit">
            <BrainCircuit
              size={30}
              aria-hidden="true"
            />

            <span />
          </div>

          <h3>
            Professor PokéHub analisando
          </h3>

          <p>
            Verificando tipos, resistências,
            fraquezas, estatísticas e
            cobertura do seu time.
          </p>

          <div className="team-analysis__loading-bar">
            <div />
          </div>
        </div>
      )}

      {analysis && !loading && (
        <div className="team-analysis__result">
          <section className="team-analysis__overview">
            <div className="team-analysis__score">
              <div className="team-analysis__score-circle">
                <div
                  style={{
                    background: `conic-gradient(
                      #7c3aed ${scorePercentage}%,
                      #ede9fe ${scorePercentage}% 100%
                    )`,
                  }}
                >
                  <span>
                    {analysis.score.toFixed(1)}
                  </span>

                  <small>/10</small>
                </div>
              </div>

              <div className="team-analysis__score-content">
                <span>Nota geral</span>

                <h3>
                  {getScoreLabel(
                    analysis.score,
                  )}
                </h3>

                <p>
                  Avaliação da sinergia e
                  cobertura geral da equipe.
                </p>
              </div>
            </div>

            <div className="team-analysis__summary">
              <div className="team-analysis__summary-header">
                <Gauge
                  size={19}
                  aria-hidden="true"
                />

                <h3>
                  Visão geral
                </h3>
              </div>

              <p>
                {analysis.summary}
              </p>
            </div>
          </section>

          <div className="team-analysis__grid">
            <article className="team-analysis-card team-analysis-card--strength">
              <div className="team-analysis-card__header">
                <div className="team-analysis-card__icon">
                  <ShieldCheck
                    size={20}
                    aria-hidden="true"
                  />
                </div>

                <div>
                  <h3>Pontos fortes</h3>

                  <p>
                    Vantagens da equipe
                  </p>
                </div>
              </div>

              <ul>
                {analysis.strengths.map(
                  (item, index) => (
                    <li
                      key={`${item}-${index}`}
                    >
                      <CheckCircle2
                        size={16}
                        aria-hidden="true"
                      />

                      <span>{item}</span>
                    </li>
                  ),
                )}
              </ul>
            </article>

            <article className="team-analysis-card team-analysis-card--weakness">
              <div className="team-analysis-card__header">
                <div className="team-analysis-card__icon">
                  <ShieldAlert
                    size={20}
                    aria-hidden="true"
                  />
                </div>

                <div>
                  <h3>Pontos fracos</h3>

                  <p>
                    Riscos e vulnerabilidades
                  </p>
                </div>
              </div>

              <ul>
                {analysis.weaknesses.map(
                  (item, index) => (
                    <li
                      key={`${item}-${index}`}
                    >
                      <ShieldAlert
                        size={16}
                        aria-hidden="true"
                      />

                      <span>{item}</span>
                    </li>
                  ),
                )}
              </ul>
            </article>

            <article className="team-analysis-card team-analysis-card--coverage">
              <div className="team-analysis-card__header">
                <div className="team-analysis-card__icon">
                  <Target
                    size={20}
                    aria-hidden="true"
                  />
                </div>

                <div>
                  <h3>Cobertura</h3>

                  <p>
                    Alcance ofensivo
                  </p>
                </div>
              </div>

              <ul>
                {analysis.coverage.map(
                  (item, index) => (
                    <li
                      key={`${item}-${index}`}
                    >
                      <Target
                        size={16}
                        aria-hidden="true"
                      />

                      <span>{item}</span>
                    </li>
                  ),
                )}
              </ul>
            </article>

            <article className="team-analysis-card team-analysis-card--suggestion">
              <div className="team-analysis-card__header">
                <div className="team-analysis-card__icon">
                  <Lightbulb
                    size={20}
                    aria-hidden="true"
                  />
                </div>

                <div>
                  <h3>Sugestões</h3>

                  <p>
                    Melhorias recomendadas
                  </p>
                </div>
              </div>

              <ul>
                {analysis.suggestions.map(
                  (item, index) => (
                    <li
                      key={`${item}-${index}`}
                    >
                      <Lightbulb
                        size={16}
                        aria-hidden="true"
                      />

                      <span>{item}</span>
                    </li>
                  ),
                )}
              </ul>
            </article>
          </div>
        </div>
      )}
    </section>
  );
}

export default TeamAnalysis;