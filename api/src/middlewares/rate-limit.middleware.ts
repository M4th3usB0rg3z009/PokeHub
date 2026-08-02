import { rateLimit } from "express-rate-limit";

export const generalRateLimit = rateLimit({
  windowMs: 60 * 1000,
  limit: 100,

  standardHeaders: "draft-8",
  legacyHeaders: false,

  message: {
    message:
      "Muitas requisições foram realizadas. Aguarde um momento e tente novamente.",
  },
});

export const aiRateLimit = rateLimit({
  windowMs: 60 * 1000,
  limit: 6,

  standardHeaders: "draft-8",
  legacyHeaders: false,

  message: {
    message:
      "O limite temporário de solicitações da IA foi atingido. Aguarde um minuto.",
  },
});