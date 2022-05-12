const express = require('express');
const cors = require('cors');
const moviesData = require('./data/movies.json');
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
    movies: moviesData.movies.filter((item) =>
      item.gender.includes(genderFilterParam)
    ),
  });
});
