// login
//3. Peticiones POST con body params
const sendLoginToApi = (data) => {
  console.log('Se están enviando datos al login:', data);
  return fetch('http://localhost:4001/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
};

// signup
//7. Registro de nuevas usuarias en el back
const sendSingUpToApi = (data) => {
  return fetch('http://localhost:4001/sign-up', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((response) => {
      return response;
    });
};

// profile
//8.Actualiza el perfil de la usuaria en el front
const sendProfileToApi = (userId, data) => {
  console.log('Se están enviando datos al profile:', userId, data);
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
//9. Recupera los datos del perfil de la usuaria desde el front
const getProfileFromApi = (userId) => {
  console.log('Se están pidiendo datos del profile del usuario:', userId);
  return fetch('http://localhost:4001/user/profile', {
    method: 'GET',
    headers: {
      userId: userId,
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      return data.user;
    });
};
// user movies
//10. Películas de una usuaria en el front
const getUserMoviesFromApi = (userId) => {
  console.log(
    'Se están pidiendo datos de las películas de la usuaria:',
    userId
  );
  return fetch('http://localhost:4001/user/movies', {
    method: 'GET',
    headers: {
      userId: userId,
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
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
