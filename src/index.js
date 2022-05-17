const express = require('express');
const cors = require('cors');
const moviesData = require('./data/movies.json');
const users = require('./data/users.json');
// create and config server
const server = express();
server.use(cors());
server.use(express.json());

// init express aplication
const serverPort = 4000;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});
server.get('/movies', (req, res) => {
  //guardamos el valor del query en una constante
  const genderFilterParam = req.query.gender ? req.query.gender : '';
  //aquí respondemos con el listado filtrado
  res.json({
    success: true,
    movies: moviesData.movies
      .filter((item) => item.gender.includes(genderFilterParam))
      //función para ordenar
      //"asc" hace referencia al value del input A-Z en AllMovies.js
      //Se compara con -1 porque en la segunda condición le estamos indicando que la cadena z o referenceStr(z-a) iría por delante de a o compareString(a-z)
      .sort(function (a, z) {
        const sortFilterParam = a.title.localeCompare(z.title);
        if (req.query.sort === 'asc') {
          return sortFilterParam;
        } else {
          return sortFilterParam * -1;
        }
      }),
  });
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
server.get('/movie/:movieId', (req, res) => {
  console.log('URL params:', req.params);
  console.log('URL params id:', req.params.movieId);
  const foundMovie = moviesData.movies.find((movieId) => {
    return movieId.id === req.params.movieId;
  });
  console.log('La peli es:', foundMovie);
});
// Parte del fichero src/index.js

// Configuración del primer servidor de estáticos
const staticServerPathWeb = './src/public-react';
server.use(express.static(staticServerPathWeb));

const staticServerPathImage = './src/public-movies-images';
server.use(express.static(staticServerPathImage));
