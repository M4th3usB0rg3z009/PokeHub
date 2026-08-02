import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import axios from "axios";

import Hero from "../../components/Hero/Hero";
import Navbar from "../../components/Navbar/Navbar";
import PokemonInfo from "../../components/PokemonInfo/PokemonInfo";
import PokemonStats from "../../components/PokemonStats/PokemonStats";
import SearchBar from "../../components/SearchBar/SearchBar";
import AIChat from "../../components/AIChat/AIChat";
import PokemonMatchups from "../../components/PokemonMatchups/PokemonMatchups";
import PokemonEvolution from "../../components/PokemonEvolution/PokemonEvolution";
import PokemonMoves from "../../components/PokemonMoves/PokemonMoves";
import PokemonBuild from "../../components/PokemonBuild/PokemonBuild";
import PokemonSkeleton from "../../components/PokemonSkeleton/PokemonSkeleton";

import { getPokemonByNameOrId } from "../../services/pokemon.service";
import type { Pokemon } from "../../types/pokemon";

import "./Home.css";

interface HomeLocationState {
  pokemonName?: string;
}

function Home() {
  const location = useLocation();
  const navigate = useNavigate();

  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const locationState = location.state as HomeLocationState | null;
  const selectedPokemonName = locationState?.pokemonName;

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
            block: "start",
          });
      }, 100);
    } catch (requestError) {
  if (axios.isAxiosError(requestError)) {
    if (requestError.response?.status === 404) {
      setError(
        "Pokémon não encontrado. Verifique o nome ou número informado.",
      );

      return;
    }

    if (requestError.code === "ECONNABORTED") {
      setError(
        "A pesquisa demorou mais que o esperado. Tente novamente.",
      );

      return;
    }

    if (!requestError.response) {
      setError(
        "Não foi possível conectar com o servidor. Verifique se a API está executando.",
      );

      return;
    }

    const apiMessage =
      requestError.response.data?.message;

    setError(
      typeof apiMessage === "string"
        ? apiMessage
        : "Não foi possível carregar os dados do Pokémon.",
    );

    return;
  }

  setError(
    "Ocorreu um erro inesperado durante a pesquisa.",
  );
} finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!selectedPokemonName) {
      return;
    }

    void handleSearch(selectedPokemonName);

    navigate("/", {
      replace: true,
      state: null,
    });
  }, [selectedPokemonName, navigate]);

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

        {loading && <PokemonSkeleton />}

        {pokemon && (
          <div className="home__pokemon">
            <div className="home__main-grid">
              <PokemonInfo pokemon={pokemon} />
              <AIChat pokemonName={pokemon.name} />
            </div>

            <PokemonStats stats={pokemon.stats} />

            <PokemonBuild pokemonName={pokemon.name} />

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