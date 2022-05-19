const express = require('express');
const cors = require('cors');
// const moviesData = require('./data/movies.json');
// const users = require('./data/users.json');
const Database = require('better-sqlite3');

// create and config server
const server = express();
server.use(cors());
server.use(express.json());

//configura el motor de templates
server.set('view engine', 'ejs');

// Configuración servidor de estáticos
const staticServerPathWeb = './src/public-react';
server.use(express.static(staticServerPathWeb));

const staticServerPathImage = './src/public-movies-images';
server.use(express.static(staticServerPathImage));

const staticServerStyles = './src/public-css';
server.use(express.static(staticServerStyles));

// init express aplication
const serverPort = 4001;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});

//2.Configura la base de datos en NODE JS
const db = Database('./src/data/database.db', { verbose: console.log });

//3.Haz un SELECT para obtener todas las películas

server.get('/movies', (req, res) => {
  const query = db.prepare(`SELECT  * FROM movies  ORDER BY  name `);
  const moviesList = query.all();
  const genderFilterParam = req.query.gender ? req.query.gender : '';
  res.json({
    success: true,
    movies: moviesList
      .filter((item) => item.gender.includes(genderFilterParam))
      .sort(function (a, z) {
        const sortFilterParam = a.name.localeCompare(z.name);

        if (req.query.sort === 'asc') {
          return sortFilterParam;
        } else {
          return sortFilterParam * -1;
        }
      }),
  });
});

//5.SELECT PARA EL MOTOR DE PLANTILLAS

server.get('/movie/:movieId', (req, res) => {
  const query = db.prepare(
    `SELECT  * FROM movies WHERE id=${req.params.movieId}`
  );
  const foundMovie = query.get();
  if (foundMovie) {
    res.render('movie', foundMovie);
  } else {
    const error = { error: req.url };
    res.render('movie-not-found', error);
  }
});

//6. Creamos la tabla de las usuarias y el select
server.post('/login', (req, res) => {
  const emailFind = req.body.email;
  const passwordFind = req.body.password;
  const query = db.prepare(
    `SELECT * FROM users WHERE email = ? AND password = ?`
  );
  const exist = query.get(emailFind, passwordFind);

  if (exist !== undefined) {
    return res.status(200).json({
      success: true,
      userId: exist.id,
    });
  } else {
    console.log('Error fatal');
    return res.status(404).json({
      success: false,
      errorMessage: 'Usuaria/o no encontrada/o',
    });
  }
});
