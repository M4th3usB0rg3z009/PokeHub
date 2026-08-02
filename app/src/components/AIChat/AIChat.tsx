import axios from "axios";
import {
  type FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import { askPokemonAssistant } from "../../services/assistant.service";

import "./AIChat.css";

interface AIChatProps {
  pokemonName: string;
}

interface ChatMessage {
  id: number;
  role: "user" | "assistant";
  content: string;
}

function AIChat({ pokemonName }: AIChatProps) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuestion("");
    setMessages([]);
    setError("");
  }, [pokemonName]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const normalizedQuestion = question.trim();

    if (!normalizedQuestion || loading) {
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now(),
      role: "user",
      content: normalizedQuestion,
    };

    setMessages((currentMessages) => [
      ...currentMessages,
      userMessage,
    ]);

    setQuestion("");
    setError("");
    setLoading(true);

    try {
      const answer = await askPokemonAssistant({
        pokemonName,
        question: normalizedQuestion,
      });

      const assistantMessage: ChatMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: answer,
      };

      setMessages((currentMessages) => [
        ...currentMessages,
        assistantMessage,
      ]);
    } catch (requestError) {
      if (axios.isAxiosError(requestError)) {
        const message =
          requestError.response?.data?.message;

        setError(
          typeof message === "string"
            ? message
            : "Não foi possível consultar o assistente.",
        );

        return;
      }

      setError(
        "Não foi possível consultar o assistente.",
      );
    } finally {
      setLoading(false);
    }
  }

  const suggestedQuestions = [
    "Quais são os melhores golpes?",
    "Como usar este Pokémon?",
    "Quais são seus principais counters?",
  ];

  function handleSuggestedQuestion(
    suggestedQuestion: string,
  ) {
    setQuestion(suggestedQuestion);
  }

  return (
    <section className="ai-chat">
      <div className="ai-chat__header">
        <div className="ai-chat__avatar">
          <span>IA</span>
        </div>

        <div>
          <span>Professor PokéHub</span>
          <h2>Assistente inteligente</h2>
        </div>

        <span className="ai-chat__status">
          Online
        </span>
      </div>

      <div className="ai-chat__intro">
        <p>
          Pergunte qualquer coisa sobre{" "}
          <strong>{pokemonName}</strong>.
        </p>
      </div>

      {messages.length === 0 && (
        <div className="ai-chat__suggestions">
          {suggestedQuestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() =>
                handleSuggestedQuestion(suggestion)
              }
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      <div className="ai-chat__messages">
        {messages.map((message) => (
          <article
            key={message.id}
            className={`ai-chat__message ai-chat__message--${message.role}`}
          >
            <span>
              {message.role === "user"
                ? "Você"
                : "Professor PokéHub"}
            </span>

            <p>{message.content}</p>
          </article>
        ))}

        {loading && (
          <div className="ai-chat__typing">
            <span />
            <span />
            <span />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {error && (
        <p className="ai-chat__error" role="alert">
          {error}
        </p>
      )}

      <form
        className="ai-chat__form"
        onSubmit={handleSubmit}
      >
        <textarea
          value={question}
          onChange={(event) =>
            setQuestion(event.target.value)
          }
          placeholder={`Pergunte algo sobre ${pokemonName}...`}
          rows={3}
          disabled={loading}
        />

        <button
          type="submit"
          disabled={loading || !question.trim()}
        >
          {loading ? "Pensando..." : "Enviar"}
        </button>
      </form>
    </section>
  );
}

export default AIChat;