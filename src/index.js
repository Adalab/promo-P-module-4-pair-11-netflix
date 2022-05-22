const express = require('express');
const cors = require('cors');
// const moviesData = require('./data/movies.json');
// const users = require('./data/users.json');
const Database = require('better-sqlite3');

// create and config server
const server = express();
server.use(cors());
server.use(express.json());

//6. Renderiza una página cualquiera// configura el motor de templates
server.set('view engine', 'ejs');

// init express aplication
const serverPort = 4001;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});

//Configura la base de datos en NODE JS
const db = Database('./src/data/database.db', { verbose: console.log });

//1.Pide todas las películar y filtra por género y ordena por nombre
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

//3. Peticiones POST con body params
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
    return res.status(404).json({
      success: false,
      errorMessage: 'Usuaria/o no encontrada/o',
    });
  }
});

//5.Crea el motor de plantillas//Obtén la película//Renderiza la película
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

//7. Registro de nuevas usuarias en el back //Comprueba que no haya una usuaria registrada con el mismo email
server.post('/sign-up', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const queryEmail = db.prepare('SELECT * FROM users WHERE email = ?');
  const foundEmail = queryEmail.get(email);
  if (foundEmail !== undefined) {
    res.json({
      success: false,
      errorMessage: 'Usuaria ya existente',
    });
  } else {
    const query = db.prepare(
      `INSERT INTO users (email, password) VALUES (?, ?) `
    );
    const insertUser = query.run(email, password);
    res.json({
      success: true,
      msj: 'Usuario insertado',
      userId: insertUser.lastInsertRowid,
    });
  }
});

//8.Actualiza el perfil de la usuaria en el back
server.post('/user/profile', (req, res) => {
  const data = req.body;
  const id = req.headers.userid;
  const query = db.prepare(
    'UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?'
  );
  const result = query.run(data.name, data.email, data.password, id);
  if (result.changes !== 0) {
    res.json({
      success: true,
      msj: 'Los datos se han cambiado correctamente.',
    });
  } else {
    res.json({
      success: false,
      msj: 'Ha habido algún error.',
    });
  }
});

//9. Recupera los datos del perfil de la usuaria desde el back
server.get('/user/profile', (req, res) => {
  const userProfile = req.headers.userid;
  const query = db.prepare('SELECT * FROM users WHERE id = ?');
  const getUser = query.get(userProfile);
  res.json({
    success: true,
    user: getUser,
  });
});

//10. Películas de una usuaria en el back
server.get('/user/movies', (req, res) => {
  const userId = req.headers.userid;
  const movieIdsQuery = db.prepare(
    'SELECT movieId FROM rel_movies_users WHERE userId = ?'
  );
  const movieIds = movieIdsQuery.all(userId);
  const moviesIdsQuestions = movieIds.map((id) => '?').join(', ');
  const moviesQuery = db.prepare(
    `SELECT * FROM movies WHERE id IN (${moviesIdsQuestions})`
  );
  const moviesIdsNumbers = movieIds.map((movie) => movie.movieId);
  const movies = moviesQuery.all(moviesIdsNumbers);
  res.json({
    success: true,
    movies: movies,
  });
});

// 2. Configuración servidor de estáticos
const staticServerPathWeb = './src/public-react';
server.use(express.static(staticServerPathWeb));

const staticServerPathImage = './src/public-movies-images';
server.use(express.static(staticServerPathImage));

const staticServerStyles = './src/public-css';
server.use(express.static(staticServerStyles));
