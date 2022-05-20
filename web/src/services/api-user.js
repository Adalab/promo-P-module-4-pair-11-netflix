// login
const sendLoginToApi = (data) => {
  console.log('Se están enviando datos al login:', data);
  //crear body params
  //cambiamos el fecth con la ruta correct de login
  return fetch('http://localhost:4001/login', {
    //añadimos el método post
    method: 'POST',
    //añadimos los headers, esto siempre es igual, copio y pego
    headers: {
      'Content-Type': 'application/json',
    },
    //añado el body, saco el email y el password de data
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
      //vacío el segundo then para que me retorne los datos introducidos en data (email y password)
    });
};

// signup
//hago lo mismo que arriba
const sendSingUpToApi = (data) => {
  console.log('Se están enviando datos al signup:', data);
  // CAMBIA ESTE FETCH PARA QUE APUNTE A UN ENDPOINT DE TU SERVIDOR, PIENSA SI DEBE SER GET O POST, PIENSA QUÉ DATOS DEBES ENVIAR, ETC
  return fetch('http://localhost:4001/sign-up', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then(() => {
      // CAMBIA EL CONTENIDO DE ESTE THEN PARA GESTIONAR LA RESPUESTA DEL SERVIDOR Y RETORNAR AL COMPONENTE APP LO QUE NECESITA
      return data;
    });
};

// profile
const sendProfileToApi = (userId, data) => {
  console.log('Se están enviando datos al profile:', userId, data);
  // CAMBIA ESTE FETCH PARA QUE APUNTE A UN ENDPOINT DE TU SERVIDOR, PIENSA SI DEBE SER GET O POST, PIENSA QUÉ DATOS DEBES ENVIAR, ETC
  return fetch('http://localhost:4001/user/profile', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      userId: userId,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      return data.success;
    });
};
//6. Recupera los datos del perfil de la usuaria desde el front
const getProfileFromApi = (userId) => {
  console.log('Se están pidiendo datos del profile del usuario:', userId);
  // CAMBIA ESTE FETCH PARA QUE APUNTE A UN ENDPOINT DE TU SERVIDOR, PIENSA SI DEBE SER GET O POST, PIENSA QUÉ DATOS DEBES ENVIAR, ETC
  return fetch('http://localhost:4001/user/profile', {
    method: 'GET',
    headers: {
      userId: userId,
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      // CAMBIA EL CONTENIDO DE ESTE THEN PARA GESTIONAR LA RESPUESTA DEL SERVIDOR Y RETORNAR AL COMPONENTE APP LO QUE NECESITA
      return data.user;
    });
};
// user movies

const getUserMoviesFromApi = (userId) => {
  console.log(
    'Se están pidiendo datos de las películas de la usuaria:',
    userId
  );
  // CAMBIA ESTE FETCH PARA QUE APUNTE A UN ENDPOINT DE TU SERVIDOR, PIENSA SI DEBE SER GET O POST, PIENSA QUÉ DATOS DEBES ENVIAR, ETC
  return fetch('http://localhost:4001/user/movies', {
    method: 'GET',
    headers: {
      userId: userId,
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      // CAMBIA EL CONTENIDO DE ESTE THEN PARA GESTIONAR LA RESPUESTA DEL SERVIDOR Y RETORNAR AL COMPONENTE APP LO QUE NECESITA
      return data;
    });
};

const objToExport = {
  sendLoginToApi: sendLoginToApi,
  sendSingUpToApi: sendSingUpToApi,
  sendProfileToApi: sendProfileToApi,
  getProfileFromApi: getProfileFromApi,
  getUserMoviesFromApi: getUserMoviesFromApi,
};

export default objToExport;
