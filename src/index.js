const express = require('express');
const cors = require('cors');
// const moviesData = require('./data/movies.json');
const users = require('./data/users.json');
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

server.post('/login', (req, res) => {
  let exist = users.find((user) => {
    if (user.email === req.body.email && user.password === req.body.password) {
      console.log(user);
      return user;
    }
    return null;
  });
  console.log(exist);
  if (!exist) {
    return res.status(404).json({
      success: false,
      errorMessage: 'Usuaria/o no encontrada/o',
    });
  }
  return res.status(200).json({
    success: true,
    userId: exist.id,
  });
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

//el server.get de arriba antes:
/*server.get('/movies', (req, res) => {
  //guardamos el valor del query en una constante
  const genderFilterParam = req.query.gender ? req.query.gender : '';
  //aquí respondemos con el listado filtrado
  res.json({
    success: true,
    movies: moviesData
      .filter((item) => item.gender.includes(genderFilterParam))
      //función para ordenar
      //"asc" hace referencia al value del input A-Z en AllMovies.js
      //Se compara con -1 porque en la segunda condición le estamos indicando que la cadena z o referenceStr(z-a) iría por delante de a o compareString(a-z)
      .sort(function (a, z) {
        const sortFilterParam = a.name.localeCompare(z.name);
        if (req.query.sort === 'asc') {
          return sortFilterParam;
        } else {
          return sortFilterParam * -1;
        }
      }),
  });
}); */

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
