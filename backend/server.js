
import app from "./app.js";

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor APP DOMI ejecutándose en http://localhost:${PORT}`);
});