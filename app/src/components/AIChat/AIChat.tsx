import axios from "axios";
import { useState } from "react";
import type { FormEvent } from "react";

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

const suggestions = [
  "Qual é a melhor nature?",
  "Recomende uma build competitiva.",
  "Quais são seus melhores golpes?"
];

function AIChat({ pokemonName }: AIChatProps) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function sendQuestion(value: string) {
    const normalizedQuestion = value.trim();

    if (!normalizedQuestion || loading) {
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now(),
      role: "user",
      content: normalizedQuestion
    };

    try {
      setLoading(true);
      setError("");
      setQuestion("");
      setMessages((current) => [...current, userMessage]);

      const answer = await askPokemonAssistant({
        pokemonName,
        question: normalizedQuestion
      });

      const assistantMessage: ChatMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: answer
      };

      setMessages((current) => [...current, assistantMessage]);
    } catch (requestError) {
      if (axios.isAxiosError(requestError)) {
        const message = requestError.response?.data?.message;

        setError(
          typeof message === "string"
            ? message
            : "Não foi possível consultar a IA."
        );

        return;
      }

      setError("Não foi possível consultar a IA.");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendQuestion(question);
  }

  function handleSuggestionClick(suggestion: string) {
    void sendQuestion(suggestion);
  }

  return (
    <aside className="ai-chat">
      <div className="ai-chat__header">
        <div className="ai-chat__icon">IA</div>

        <div>
          <span>Assistente inteligente</span>
          <h2>Professor PokéHub</h2>
        </div>
      </div>

      <div className="ai-chat__conversation">
        <div className="ai-chat__message ai-chat__message--assistant">
          <span className="ai-chat__avatar">IA</span>

          <div>
            <p>
              Posso responder dúvidas sobre{" "}
              <strong>{pokemonName}</strong>, recomendar builds, natures,
              itens, golpes e estratégias.
            </p>
          </div>
        </div>

        {messages.map((message) => (
          <div
            key={message.id}
            className={`ai-chat__message ai-chat__message--${message.role}`}
          >
            <span className="ai-chat__avatar">
              {message.role === "assistant" ? "IA" : "Você"}
            </span>

            <div>
              <p>{message.content}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="ai-chat__message ai-chat__message--assistant">
            <span className="ai-chat__avatar">IA</span>

            <div>
              <p className="ai-chat__loading">
                Analisando {pokemonName}...
              </p>
            </div>
          </div>
        )}
      </div>

      {messages.length === 0 && (
        <div className="ai-chat__suggestions">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              disabled={loading}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {error && (
        <p className="ai-chat__error" role="alert">
          {error}
        </p>
      )}

      <form className="ai-chat__form" onSubmit={handleSubmit}>
        <textarea
          value={question}
          disabled={loading}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder={`Pergunte algo sobre ${pokemonName}...`}
          rows={4}
          maxLength={500}
        />

        <div className="ai-chat__form-footer">
          <span>{question.length}/500</span>

          <button
            type="submit"
            disabled={loading || !question.trim()}
          >
            {loading ? "Respondendo..." : "Enviar pergunta"}
          </button>
        </div>
      </form>
    </aside>
  );
}

export default AIChat;