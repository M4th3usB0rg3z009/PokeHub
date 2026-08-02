import { gemini } from "../clients/gemini.client.js";

interface TranslatePokemonDataInput {
  description: string;
  category: string;
  abilities: string[];
}

interface TranslatedPokemonData {
  description: string;
  category: string;
  abilities: string[];
}

export async function translatePokemonData({
  description,
  category,
  abilities,
}: TranslatePokemonDataInput): Promise<TranslatedPokemonData> {
  const prompt = `
Traduza os dados abaixo para português do Brasil.

Regras:
- Retorne somente JSON válido.
- Não use Markdown.
- Não use blocos de código.
- Não altere o significado das informações.
- Mantenha a palavra Pokémon.
- Traduza as habilidades mantendo a mesma ordem.

Dados:
${JSON.stringify({
  description,
  category,
  abilities,
})}

Formato esperado:
{
  "description": "descrição traduzida",
  "category": "categoria traduzida",
  "abilities": ["habilidade 1", "habilidade 2"]
}
  `.trim();

  const model = process.env.GEMINI_MODEL;

  if (!model) {
    throw new Error("GEMINI_MODEL não configurado.");
  }

  const response = await gemini.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    },
  });

  const text = response.text?.trim();

  if (!text) {
    throw new Error("A Gemini não retornou a tradução.");
  }

  const translatedData = JSON.parse(text) as TranslatedPokemonData;

  return translatedData;
}

const model = process.env.GEMINI_MODEL;

if (!model) {
  throw new Error("A variável GEMINI_MODEL não foi configurada.");
}
