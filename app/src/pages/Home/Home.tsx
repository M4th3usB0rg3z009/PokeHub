import { useState } from "react";

import Hero from "../../components/Hero/Hero";
import Navbar from "../../components/Navbar/Navbar";
import PokemonInfo from "../../components/PokemonInfo/PokemonInfo";
import PokemonStats from "../../components/PokemonStats/PokemonStats";
import SearchBar from "../../components/SearchBar/SearchBar";
import AIChat from "../../components/AIChat/AIChat";
import PokemonMatchups from "../../components/PokemonMatchups/PokemonMatchups";
import PokemonEvolution from "../../components/PokemonEvolution/PokemonEvolution";
import PokemonMoves from "../../components/PokemonMoves/PokemonMoves";

import { getPokemonByNameOrId } from "../../services/pokemon.service";
import type { Pokemon } from "../../types/pokemon";

import "./Home.css";

function Home() {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(value: string) {
    try {
      setLoading(true);
      setError("");
      setPokemon(null);

      const result = await getPokemonByNameOrId(value);

      setPokemon(result);

      window.setTimeout(() => {
        document
          .querySelector(".home__pokemon")
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
      }, 100);
    } catch {
      setError("Pokémon não encontrado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="home">
      <Navbar />

      <main className="home__content">
        <Hero />

        <SearchBar
          onSearch={handleSearch}
          loading={loading}
        />

        {error && (
          <p className="home__error" role="alert">
            {error}
          </p>
        )}

        {pokemon && (
          <div className="home__pokemon">
            <div className="home__main-grid">
              <PokemonInfo pokemon={pokemon} />

              <AIChat pokemonName={pokemon.name} />
            </div>

            <PokemonStats stats={pokemon.stats} />

            <PokemonMatchups
              weaknesses={pokemon.weaknesses}
              resistances={pokemon.resistances}
              immunities={pokemon.immunities}
            />

            <PokemonMoves moves={pokemon.moves} />

            <PokemonEvolution
              evolutions={pokemon.evolutions}
              onSelectPokemon={handleSearch}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;