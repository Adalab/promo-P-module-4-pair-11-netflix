//Ordena por geénero y nombre
const getMoviesFromApi = (value) => {
  return fetch(
    `http://localhost:4001/movies?gender=${value.gender}&sort=${value.sort}`,
    { method: 'GET' }
  )
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
};

const objToExport = {
  getMoviesFromApi: getMoviesFromApi,
};

export default objToExport;
