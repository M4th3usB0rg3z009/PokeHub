import "./Hero.css";

function Hero() {
    return (
        <section className="hero">
            <span className="hero__badge">
                Pokédex + Inteligência Artificial
            </span>

            <h1>
                Descubra tudo sobre qualquer Pokémon.
            </h1>

            <p>
                Pesquise por nome ou número e receba informações detalhadas,
                builds, estratégias e respostas inteligentes.
            </p>
        </section>
    );
}

export default Hero;