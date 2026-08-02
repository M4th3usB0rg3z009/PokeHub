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

export const pokemonBuildSchema = z.object({
  pokemonName: z
    .string()
    .trim()
    .min(1, "Informe o nome do Pokémon.")
    .max(50),

  buildType: z.enum([
    "physical",
    "special",
    "defensive",
    "support",
    "balanced",
  ]),
});

export type PokemonBuildInput = z.infer<
  typeof pokemonBuildSchema
>;

export const teamAnalysisSchema = z.object({
  pokemonNames: z
    .array(
      z
        .string()
        .trim()
        .min(1),
    )
    .min(1, "Adicione pelo menos um Pokémon ao time.")
    .max(6, "O time pode ter no máximo 6 Pokémon."),
});

export type TeamAnalysisInput = z.infer<
  typeof teamAnalysisSchema
>;