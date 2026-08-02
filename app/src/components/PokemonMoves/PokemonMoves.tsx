import { useMemo, useState } from "react";

import type { PokemonMove } from "../../types/pokemon";

import "./PokemonMoves.css";

interface PokemonMovesProps {
  moves: PokemonMove[];
}

function PokemonMoves({ moves }: PokemonMovesProps) {
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);

  const filteredMoves = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return moves;
    }

    return moves.filter((move) =>
      move.name.toLowerCase().includes(normalizedSearch),
    );
  }, [moves, search]);

  const visibleMoves = showAll
    ? filteredMoves
    : filteredMoves.slice(0, 12);

  return (
    <section className="pokemon-moves">
      <div className="pokemon-moves__header">
        <div>
          <span>Movimentos</span>
          <h2>Golpes disponíveis</h2>
        </div>

        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar movimento..."
          aria-label="Buscar movimento"
        />
      </div>

      {visibleMoves.length > 0 ? (
        <div className="pokemon-moves__list">
          {visibleMoves.map((move) => (
            <span key={move.name} className="pokemon-moves__item">
              {move.name.replaceAll("-", " ")}
            </span>
          ))}
        </div>
      ) : (
        <p className="pokemon-moves__empty">
          Nenhum movimento encontrado.
        </p>
      )}

      {filteredMoves.length > 12 && (
        <button
          type="button"
          className="pokemon-moves__toggle"
          onClick={() => setShowAll((current) => !current)}
        >
          {showAll ? "Mostrar menos" : "Ver todos os movimentos"}
        </button>
      )}
    </section>
  );
}

export default PokemonMoves;