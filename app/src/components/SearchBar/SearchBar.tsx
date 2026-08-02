import { useState } from "react";
import type { FormEvent } from "react";

import "./SearchBar.css";

interface SearchBarProps {
  onSearch: (value: string) => void;
  loading: boolean;
}

function SearchBar({ onSearch, loading }: SearchBarProps) {
  const [search, setSearch] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const value = search.trim();

    if (!value) {
      return;
    }

    onSearch(value);
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Pesquise por nome ou número do Pokémon..."
        aria-label="Pesquisar Pokémon"
      />

      <button type="submit" disabled={loading}>
        {loading ? "Pesquisando..." : "Pesquisar"}
      </button>
    </form>
  );
}

export default SearchBar;