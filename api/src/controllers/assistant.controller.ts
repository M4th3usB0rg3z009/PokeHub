import type { Request, Response } from "express";

import {
  assistantQuestionSchema,
  pokemonBuildSchema,
  teamAnalysisSchema,
} from "../schemas/assistant.schema.js";

import {
  analyzePokemonTeam,
  askPokemonAssistant,
  generatePokemonBuild,
} from "../services/assistant.service.js";

function isGeminiLimitError(error: unknown): boolean {
  return (
    error instanceof Error &&
    (error.message.includes("429") ||
      error.message.includes("RESOURCE_EXHAUSTED"))
  );
}

export async function askAssistant(
  request: Request,
  response: Response,
): Promise<Response> {
  const validation =
    assistantQuestionSchema.safeParse(
      request.body,
    );

  if (!validation.success) {
    return response.status(400).json({
      message: "Dados da pergunta inválidos.",
      errors:
        validation.error.flatten().fieldErrors,
    });
  }

  try {
    const answer =
      await askPokemonAssistant(
        validation.data,
      );

    return response.status(200).json({
      answer,
    });
  } catch (error) {
    console.error(
      "Erro ao consultar a Gemini:",
      error,
    );

    if (isGeminiLimitError(error)) {
      return response.status(429).json({
        message:
          "O limite temporário da IA foi atingido. Aguarde um momento e tente novamente.",
      });
    }

    return response.status(500).json({
      message:
        "Não foi possível gerar a resposta da IA.",
    });
  }
}

export async function createPokemonBuild(
  request: Request,
  response: Response,
): Promise<Response> {
  const validation =
    pokemonBuildSchema.safeParse(
      request.body,
    );

  if (!validation.success) {
    return response.status(400).json({
      message: "Dados da build inválidos.",
      errors:
        validation.error.flatten().fieldErrors,
    });
  }

  try {
    const build =
      await generatePokemonBuild(
        validation.data,
      );

    return response.status(200).json({
      build,
    });
  } catch (error) {
    console.error(
      "Erro ao gerar build:",
      error,
    );

    if (isGeminiLimitError(error)) {
      return response.status(429).json({
        message:
          "O limite temporário da IA foi atingido. Aguarde um momento e tente novamente.",
      });
    }

    if (
      error instanceof Error &&
      (error.message.includes(
        "formato inválido",
      ) ||
        error.message.includes(
          "campos inválidos",
        ) ||
        error.message.includes(
          "quatro movimentos",
        ))
    ) {
      return response.status(502).json({
        message:
          "A IA retornou uma build inválida. Tente gerar novamente.",
      });
    }

    return response.status(500).json({
      message:
        "Não foi possível gerar a build.",
    });
  }
}

export async function analyzeTeam(
  request: Request,
  response: Response,
): Promise<Response> {
  const validation =
    teamAnalysisSchema.safeParse(
      request.body,
    );

  if (!validation.success) {
    return response.status(400).json({
      message: "Dados do time inválidos.",
      errors:
        validation.error.flatten().fieldErrors,
    });
  }

  try {
    const analysis =
      await analyzePokemonTeam(
        validation.data,
      );

    return response.status(200).json({
      analysis,
    });
  } catch (error) {
    console.error(
      "Erro ao analisar o time:",
      error,
    );

    if (isGeminiLimitError(error)) {
      return response.status(429).json({
        message:
          "O limite temporário da IA foi atingido. Aguarde um momento e tente novamente.",
      });
    }

    if (
      error instanceof Error &&
      (error.message.includes(
        "entre 1 e 6",
      ) ||
        error.message.includes(
          "está vazio",
        ))
    ) {
      return response.status(400).json({
        message: error.message,
      });
    }

    if (
      error instanceof Error &&
      (error.message.includes(
        "formato inválido",
      ) ||
        error.message.includes(
          "formato esperado",
        ))
    ) {
      return response.status(502).json({
        message:
          "A IA retornou uma resposta inválida. Tente analisar novamente.",
      });
    }

    return response.status(500).json({
      message:
        "Não foi possível analisar o time.",
    });
  }
}