import {
  Activity,
  BookOpen,
  ChevronDown,
  Crosshair,
  Disc3,
  Search,
  Sparkles,
  Swords,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import type { PokemonMove, PokemonMoveLearnDetail } from "../../types/pokemon";
import { pokemonTypeNames } from "../../utils/pokemonTypes";

import "./PokemonMoves.css";

interface PokemonMovesProps {
  moves: PokemonMove[];
}

type LearnMethodFilter = "all" | "level-up" | "machine" | "tutor" | "egg";

type MoveOrder = "name" | "power" | "level";

const MOVES_PER_PAGE = 12;

const damageClassNames: Record<string, string> = {
  physical: "Físico",
  special: "Especial",
  status: "Status",
};

const generationNames: Record<string, string> = {
  "generation-i": "Geração I",
  "generation-ii": "Geração II",
  "generation-iii": "Geração III",
  "generation-iv": "Geração IV",
  "generation-v": "Geração V",
  "generation-vi": "Geração VI",
  "generation-vii": "Geração VII",
  "generation-viii": "Geração VIII",
  "generation-ix": "Geração IX",
};

const methodNames: Record<string, string> = {
  "level-up": "Por nível",
  machine: "TM",
  tutor: "Tutor",
  egg: "Ovo",
};

function getSelectedLearnDetail(
  move: PokemonMove,
  generation: string,
  method: LearnMethodFilter,
): PokemonMoveLearnDetail | undefined {
  return move.learnDetails
    .filter((detail) => {
      const matchesGeneration =
        generation === "all" || detail.generation === generation;

      const matchesMethod = method === "all" || detail.method === method;

      return matchesGeneration && matchesMethod;
    })
    .sort((first, second) => {
      if (first.method === "level-up" && second.method === "level-up") {
        return first.level - second.level;
      }

      return first.method.localeCompare(second.method);
    })[0];
}

function formatLearnMethod(detail?: PokemonMoveLearnDetail) {
  if (!detail) {
    return "Método não identificado";
  }

  if (detail.method === "level-up") {
    return detail.level > 0
      ? `Aprendido no nível ${detail.level}`
      : "Aprendido por nível";
  }

  return methodNames[detail.method] ?? detail.method.replaceAll("-", " ");
}

function PokemonMoves({ moves }: PokemonMovesProps) {
  const [search, setSearch] = useState("");
  const [method, setMethod] = useState<LearnMethodFilter>("all");
  const [generation, setGeneration] = useState("generation-ix");
  const [order, setOrder] = useState<MoveOrder>("name");
  const [visibleCount, setVisibleCount] = useState(MOVES_PER_PAGE);

  

  const filteredMoves = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const result = moves
      .filter((move) => {
        const matchesSearch = move.name
          .replaceAll("-", " ")
          .includes(normalizedSearch);

        const matchesLearnDetail = move.learnDetails.some((detail) => {
          const matchesMethod = method === "all" || detail.method === method;

          const matchesGeneration =
            generation === "all" || detail.generation === generation;

          return matchesMethod && matchesGeneration;
        });

        return matchesSearch && matchesLearnDetail;
      })
      .map((move) => ({
        move,
        selectedDetail: getSelectedLearnDetail(move, generation, method),
      }));

    result.sort((first, second) => {
      if (order === "power") {
        return (second.move.power ?? 0) - (first.move.power ?? 0);
      }

      if (order === "level") {
        return (
          (first.selectedDetail?.level ?? Number.MAX_SAFE_INTEGER) -
          (second.selectedDetail?.level ?? Number.MAX_SAFE_INTEGER)
        );
      }

      return first.move.name.localeCompare(second.move.name);
    });

    return result;
  }, [moves, search, method, generation, order]);

  useEffect(() => {
    setVisibleCount(MOVES_PER_PAGE);
  }, [search, method, generation, order]);

  const visibleMoves = filteredMoves.slice(0, visibleCount);

  return (
    <section className="pokemon-moves">
      <div className="pokemon-moves__header">
        <div>
          <span>Movimentos</span>
          <h2>Golpes disponíveis</h2>

          <p>Filtre por nome, método de aprendizado e geração.</p>
        </div>

        <div className="pokemon-moves__count">
          <span>Exibindo</span>
          <strong>
            {visibleMoves.length}/{filteredMoves.length}
          </strong>
        </div>
      </div>

      <div className="pokemon-moves__filters">
        <label className="pokemon-moves__search">
          <span>Buscar golpe</span>

          <div>
            <Search size={17} />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Ex.: flamethrower"
            />
          </div>
        </label>

        <label>
          <span>Método</span>

          <select
            value={method}
            onChange={(event) =>
              setMethod(event.target.value as LearnMethodFilter)
            }
          >
            <option value="all">Todos</option>
            <option value="level-up">Por nível</option>
            <option value="machine">TM</option>
            <option value="tutor">Tutor</option>
            <option value="egg">Ovo</option>
          </select>
        </label>

        <label>
          <span>Geração</span>

          <select
            value={generation}
            onChange={(event) => setGeneration(event.target.value)}
          >
            {[
              "generation-i",
              "generation-ii",
              "generation-iii",
              "generation-iv",
              "generation-v",
              "generation-vi",
              "generation-vii",
              "generation-viii",
              "generation-ix",
            ].map((generationId) => (
              <option key={generationId} value={generationId}>
                {generationNames[generationId]}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Ordenar</span>

          <select
            value={order}
            onChange={(event) => setOrder(event.target.value as MoveOrder)}
          >
            <option value="name">Nome</option>
            <option value="level">Nível</option>
            <option value="power">Poder</option>
          </select>
        </label>
      </div>

      {visibleMoves.length === 0 ? (
        <div className="pokemon-moves__empty">
          <Search size={26} />

          <h3>Nenhum golpe encontrado</h3>

          <p>Ajuste os filtros selecionados.</p>
        </div>
      ) : (
        <div className="pokemon-moves__grid">
          {visibleMoves.map(({ move, selectedDetail }) => (
            <article key={move.name} className="pokemon-move-card">
              <div className="pokemon-move-card__top">
                <div className="pokemon-move-card__icon">
                  {move.damageClass === "physical" && <Swords size={18} />}

                  {move.damageClass === "special" && <Sparkles size={18} />}

                  {move.damageClass === "status" && <Activity size={18} />}
                </div>

                <span className={`type type--${move.type}`}>
                  {pokemonTypeNames[move.type] ?? move.type}
                </span>
              </div>

              <h3>{move.name.replaceAll("-", " ")}</h3>

              <div className="pokemon-move-card__learning">
                {selectedDetail?.method === "machine" ? (
                  <Disc3 size={15} />
                ) : (
                  <BookOpen size={15} />
                )}

                <span>{formatLearnMethod(selectedDetail)}</span>
              </div>

              {selectedDetail && (
                <span className="pokemon-move-card__generation">
                  {generationNames[selectedDetail.generation] ??
                    selectedDetail.generation}
                </span>
              )}

              <div className="pokemon-move-card__meta">
                <div>
                  <span>Classe</span>

                  <strong>{damageClassNames[move.damageClass]}</strong>
                </div>

                <div>
                  <span>Poder</span>
                  <strong>{move.power ?? "—"}</strong>
                </div>

                <div>
                  <span>Precisão</span>

                  <strong>
                    {move.accuracy !== null ? `${move.accuracy}%` : "—"}
                  </strong>
                </div>
              </div>

              <div className="pokemon-move-card__footer">
                <Crosshair size={15} />

                <span>
                  {move.accuracy !== null
                    ? "Precisão definida"
                    : "Precisão variável"}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}

      {visibleCount < filteredMoves.length && (
        <button
          type="button"
          className="pokemon-moves__load-more"
          onClick={() => setVisibleCount((current) => current + MOVES_PER_PAGE)}
        >
          Mostrar mais golpes
          <ChevronDown size={18} />
        </button>
      )}
    </section>
  );
}

export default PokemonMoves;
