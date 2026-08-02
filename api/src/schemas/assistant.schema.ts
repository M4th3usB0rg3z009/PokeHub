import { z } from "zod";

export const assistantQuestionSchema = z.object({
  pokemonName: z
    .string()
    .trim()
    .min(1, "Informe o nome do Pokémon.")
    .max(50),

  question: z
    .string()
    .trim()
    .min(3, "A pergunta deve possuir pelo menos 3 caracteres.")
    .max(500, "A pergunta deve possuir no máximo 500 caracteres.")
});

export type AssistantQuestionInput = z.infer<
  typeof assistantQuestionSchema
>;