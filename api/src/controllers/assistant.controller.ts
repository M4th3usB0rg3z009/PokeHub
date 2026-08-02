import type { Request, Response } from "express";

import { assistantQuestionSchema } from "../schemas/assistant.schema.js";
import { askPokemonAssistant } from "../services/assistant.service.js";

export async function askAssistant(
  request: Request,
  response: Response
): Promise<Response> {
  const validation = assistantQuestionSchema.safeParse(request.body);

  if (!validation.success) {
    return response.status(400).json({
      message: "Dados da pergunta inválidos.",
      errors: validation.error.flatten().fieldErrors
    });
  }

  try {
    const answer = await askPokemonAssistant(validation.data);

    return response.status(200).json({
      answer
    });
  } catch (error) {
    console.error("Erro ao consultar a Gemini:", error);

    if (
      error instanceof Error &&
      (
        error.message.includes("429") ||
        error.message.includes("RESOURCE_EXHAUSTED")
      )
    ) {
      return response.status(429).json({
        message:
          "O limite temporário da IA foi atingido. Aguarde um momento e tente novamente."
      });
    }

    return response.status(500).json({
      message: "Não foi possível gerar a resposta da IA."
    });
  }
}