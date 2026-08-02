import "./PokemonSkeleton.css";

function PokemonSkeleton() {
  return (
    <section
      className="pokemon-skeleton"
      aria-label="Carregando informações do Pokémon"
      aria-busy="true"
    >
      <div className="pokemon-skeleton__main-grid">
        <article className="pokemon-skeleton__info">
          <div className="pokemon-skeleton__visual">
            <div className="pokemon-skeleton__badge skeleton-block" />

            <div className="pokemon-skeleton__image skeleton-block" />
          </div>

          <div className="pokemon-skeleton__content">
            <div className="pokemon-skeleton__label skeleton-block" />
            <div className="pokemon-skeleton__title skeleton-block" />

            <div className="pokemon-skeleton__types">
              <div className="skeleton-block" />
              <div className="skeleton-block" />
            </div>

            <div className="pokemon-skeleton__paragraph">
              <div className="skeleton-block" />
              <div className="skeleton-block" />
              <div className="skeleton-block" />
            </div>

            <div className="pokemon-skeleton__details">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="pokemon-skeleton__detail"
                >
                  <div className="skeleton-block" />
                  <div className="skeleton-block" />
                </div>
              ))}
            </div>
          </div>
        </article>

        <article className="pokemon-skeleton__chat">
          <div className="pokemon-skeleton__chat-header">
            <div className="pokemon-skeleton__avatar skeleton-block" />

            <div>
              <div className="skeleton-block" />
              <div className="skeleton-block" />
            </div>
          </div>

          <div className="pokemon-skeleton__chat-box skeleton-block" />

          <div className="pokemon-skeleton__chat-lines">
            <div className="skeleton-block" />
            <div className="skeleton-block" />
            <div className="skeleton-block" />
          </div>

          <div className="pokemon-skeleton__chat-input skeleton-block" />
        </article>
      </div>

      <article className="pokemon-skeleton__section">
        <div className="pokemon-skeleton__section-title skeleton-block" />

        <div className="pokemon-skeleton__bars">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index}>
              <div className="skeleton-block" />
              <div className="skeleton-block" />
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}

export default PokemonSkeleton;