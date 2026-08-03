import "dotenv/config";

import { app } from "./app.js";

const port = 3000;

app.listen(port, "localhost", () => {
  console.log(`PokéHub API executando em http://localhost:${port}`);
});
