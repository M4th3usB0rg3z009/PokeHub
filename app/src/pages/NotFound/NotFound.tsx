import {
  ArrowLeft,
  Home,
} from "lucide-react";
import { useNavigate } from "react-router";

import Navbar from "../../components/Navbar/Navbar";

import "./NotFound.css";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      <Navbar />

      <main className="not-found-page__content">
        <section className="not-found">
          <div
            className="not-found__visual"
            aria-hidden="true"
          >
            <div className="not-found__circle not-found__circle--large" />
            <div className="not-found__circle not-found__circle--small" />

            <div className="not-found__pokeball">
              <span />
            </div>
          </div>

          <div className="not-found__information">
            <span className="not-found__code">
              Erro 404
            </span>

            <h1>
              Essa página fugiu para outra região.
            </h1>

            <p>
              Não encontramos o endereço que você tentou acessar.
              Ele pode ter sido removido, alterado ou nunca ter
              existido.
            </p>

            <div className="not-found__actions">
              <button
                type="button"
                className="not-found__primary-button"
                onClick={() => navigate("/")}
              >
                <Home
                  size={18}
                  aria-hidden="true"
                />

                Voltar para a Pokédex
              </button>

              <button
                type="button"
                className="not-found__secondary-button"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft
                  size={18}
                  aria-hidden="true"
                />

                Voltar à página anterior
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default NotFound;