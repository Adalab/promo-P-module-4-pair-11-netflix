// login
//le pasamos como parámetro value, porque ya está recibiendo un objeto con el género seleccionado
const getMoviesFromApi = (value) => {
  //ampliamos la ruta del fetch con el query params ?gender=${value.gender}
  //que lo que hace es que introduzca en la url el valor que seleccione la usuaria
  //añadimos sort a la URL y el método GET como indicaba en apartados anteriores
  return fetch(
    `http://localhost:4000/movies?gender=${value.gender}&sort=${value.sort}`,
    { method: "GET" }
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
