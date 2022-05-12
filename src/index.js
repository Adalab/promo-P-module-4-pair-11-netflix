const express = require('express');
const cors = require('cors');
const movies = require('./data/movies.json');

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
  console.log('Vamos a preparar un JSON.');
  console.log(req.query);

  const gender = req.query.gender ? parseInt(req.query.gender) : movies.length;
  // const search = req.query.search ? req.query.search : '';

  res.json(
    movies.filter((movie) => movie.includes(search))
    // .splice(0, limit)
  );
});
