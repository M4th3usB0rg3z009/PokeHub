import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error(
    "A variável GEMINI_API_KEY não foi configurada no arquivo .env."
  );
}

export const gemini = new GoogleGenAI({
  apiKey
});