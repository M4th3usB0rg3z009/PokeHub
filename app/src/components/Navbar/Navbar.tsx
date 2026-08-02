import { NavLink } from "react-router";

import { useTeam } from "../../contexts/TeamContext";

import "./Navbar.css";

function Navbar() {
  const { team } = useTeam();

  return (
    <header className="navbar">
      <div className="navbar__container">
        <NavLink
          to="/"
          className="navbar__brand"
          aria-label="Ir para a Pokédex"
        >
          <div className="navbar__pokeball">
            <span />
          </div>

          <h1>
            Poké<span>Hub</span>
          </h1>
        </NavLink>

        <nav className="navbar__links">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `navbar__link ${
                isActive ? "navbar__link--active" : ""
              }`
            }
          >
            Pokédex
          </NavLink>

          <NavLink
            to="/time"
            className={({ isActive }) =>
              `navbar__link ${
                isActive ? "navbar__link--active" : ""
              }`
            }
          >
            <span>Meu Time</span>

            <strong>
              {team.length}/6
            </strong>
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;