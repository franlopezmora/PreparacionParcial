import express from 'express';
import Movie from "./models/Movie.js"
import languages from "./data/languages.js"
import { Op } from 'sequelize';


const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use('/data', express.static('data'));


app.get("/api/movies/populares", async (req, res) => {
    try {
      const movies = await Movie.findAll({
        where: { STATUS: "Released" },
        order: [["POPULARITY", "DESC"]],
        limit: 20
      });
  
      const result = movies.map(movie => ({
        title: movie.TITLE,
        releaseDate: movie.RELEASE_DATE,
        language: languages[movie.LANGUAGE] || movie.LANGUAGE,
        runtime: movie.RUNTIME,
        budgetMillions: Math.floor(movie.BUDGET / 1_000_000),
        voteAverage: movie.VOTE_AVERAGE
      }));
  
      res.json(result);
    } catch (error) {
      console.error("❌ Error en /api/movies/populares:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  });
  
  app.get("/api/movies", async (req, res) => {
    try {
      const { titulo, lenguaje } = req.query;
  
      const whereConditions = {
        STATUS: "Released"
      };
  
      if (titulo) {
        whereConditions.TITLE = {
          [Op.like]: `%${titulo}%`
        };
      }
      
  
      if (lenguaje) {
        whereConditions.LANGUAGE = lenguaje;
      }
  
      const movies = await Movie.findAll({
        where: whereConditions
      });
  
      const result = movies.map(movie => ({
        title: movie.TITLE,
        releaseDate: movie.RELEASE_DATE,
        language: languages[movie.LANGUAGE] || movie.LANGUAGE,
        runtime: movie.RUNTIME,
        budgetMillions: Math.floor(movie.BUDGET / 1_000_000),
        voteAverage: movie.VOTE_AVERAGE
      }));
  
      res.json(result);
    } catch (error) {
      console.error("❌ Error en /api/movies:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  });

(async function start() {
    try {
        await Movie.sequelize.authenticate();
        console.log("✅ Conectado a la base de datos correctamente");

        app.listen(PORT, () => {
            console.log(`🚀 Servidor iniciado y escuchando en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("❌ Error al conectar con la base de datos:", error);
    }
})();
