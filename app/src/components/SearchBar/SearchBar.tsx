import {
  type FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import { getPokemonSuggestions } from "../../services/pokemon-suggestions.service";

import "./SearchBar.css";

interface SearchBarProps {
  onSearch: (value: string) => void;
  loading: boolean;
}

function SearchBar({
  onSearch,
  loading,
}: SearchBarProps) {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>(
    [],
  );
  const [showSuggestions, setShowSuggestions] =
    useState(false);
  const [suggestionsLoading, setSuggestionsLoading] =
    useState(false);
  const [selectedIndex, setSelectedIndex] =
    useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeout = window.setTimeout(async () => {
      const normalizedSearch = search.trim();

      if (normalizedSearch.length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      try {
        setSuggestionsLoading(true);

        const result = await getPokemonSuggestions(
          normalizedSearch,
        );

        setSuggestions(result);
        setShowSuggestions(result.length > 0);
        setSelectedIndex(-1);
      } catch {
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setSuggestionsLoading(false);
      }
    }, 300);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [search]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(
          event.target as Node,
        )
      ) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, []);

  function submitSearch(value: string) {
    const normalizedValue = value.trim();

    if (!normalizedValue || loading) {
      return;
    }

    setSearch(normalizedValue);
    setShowSuggestions(false);
    setSelectedIndex(-1);

    onSearch(normalizedValue);
  }

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (
      selectedIndex >= 0 &&
      suggestions[selectedIndex]
    ) {
      submitSearch(suggestions[selectedIndex]);
      return;
    }

    submitSearch(search);
  }

  function handleSelectSuggestion(name: string) {
    submitSearch(name);
  }

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>,
  ) {
    if (!showSuggestions || suggestions.length === 0) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();

      setSelectedIndex((currentIndex) =>
        currentIndex < suggestions.length - 1
          ? currentIndex + 1
          : 0,
      );
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      setSelectedIndex((currentIndex) =>
        currentIndex > 0
          ? currentIndex - 1
          : suggestions.length - 1,
      );
    }

    if (event.key === "Escape") {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  }

  return (
    <div
      className="search-bar"
      ref={containerRef}
    >
      <form
        className="search-bar__form"
        onSubmit={handleSubmit}
      >
        <div className="search-bar__input-wrapper">
          <input
            type="text"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => {
              if (suggestions.length > 0) {
                setShowSuggestions(true);
              }
            }}
            onKeyDown={handleKeyDown}
            placeholder="Digite o nome ou número do Pokémon"
            autoComplete="off"
            aria-label="Digite o nome ou número do Pokémon"
            aria-autocomplete="list"
            aria-expanded={showSuggestions}
          />

          {suggestionsLoading && (
            <span className="search-bar__loading">
              Buscando...
            </span>
          )}

          {showSuggestions && (
            <ul
              className="search-bar__suggestions"
              role="listbox"
            >
              {suggestions.map((name, index) => (
                <li
                  key={name}
                  role="option"
                  aria-selected={selectedIndex === index}
                >
                  <button
                    type="button"
                    className={
                      selectedIndex === index
                        ? "search-bar__suggestion search-bar__suggestion--active"
                        : "search-bar__suggestion"
                    }
                    onMouseDown={(event) => {
                      event.preventDefault();
                      handleSelectSuggestion(name);
                    }}
                  >
                    <span className="search-bar__suggestion-name">
                      {name.replaceAll("-", " ")}
                    </span>

                    <span className="search-bar__suggestion-action">
                      Pesquisar
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
        >
          {loading ? "Pesquisando..." : "Pesquisar"}
        </button>
      </form>
    </div>
  );
}

export default SearchBar;