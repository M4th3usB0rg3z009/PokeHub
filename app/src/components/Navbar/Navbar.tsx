import "./Navbar.css";

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar__brand">
        <div className="navbar__pokeball">
          <span />
        </div>

        <h1>
          Poké<span>Hub</span>
        </h1>
      </div>

      <nav className="navbar__links">
        <a href="#pokedex" className="navbar__link navbar__link--active">
          Pokédex
        </a>

        <a href="#explorar" className="navbar__link">
          Explorar
        </a>

        <a href="#sobre" className="navbar__link">
          Sobre
        </a>
      </nav>
    </header>
  );
}

export default Navbar;