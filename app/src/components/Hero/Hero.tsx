import "./Hero.css";

function Hero() {
  return (
    <section className="hero">
      <div className="hero__content">
        <h1>
          Explore o mundo
          <strong> Pokémon.</strong>
        </h1>

        <p>
          Consulte informações completas sobre qualquer Pokémon,
          incluindo tipos, habilidades, estatísticas, evoluções,
          golpes, fraquezas, resistências e builds competitivas.
          Monte seu próprio time e utilize inteligência artificial
          para receber sugestões, estratégias e análises da equipe.
        </p>
      </div>

      <div className="hero__visual" aria-hidden="true">
        <div className="hero__circle hero__circle--large" />
        <div className="hero__circle hero__circle--small" />

        <div className="hero__pokeball">
          <span />
        </div>

        <div className="hero__stat hero__stat--top">
          <small>Pokémon</small>
          <strong>1000+</strong>
        </div>

        <div className="hero__stat hero__stat--bottom">
          <small>Análises</small>
          <strong>IA</strong>
        </div>
      </div>
    </section>
  );
}

export default Hero;