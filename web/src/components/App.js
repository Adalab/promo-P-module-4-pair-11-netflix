import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
// components
import Header from './Header';
import AllMovies from './AllMovies';
import MyMovies from './MyMovies';
import Login from './Login';
import Profile from './Profile';
import SignUp from './SignUp';
// services
import apiMovies from '../services/api-movies';
import apiUser from '../services/api-user';
import router from '../services/router';

//4.Manten logada a la usuaria
import ls from '../services/local-storage';

const App = () => {
  // state: user
  //4.Manten logada a la usuaria
  const [userId, setUserId] = useState(ls.get('user', ''));
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userMovies, setUserMovies] = useState([]);
  // state: login
  const [loginErrorMessage, setLoginErrorMessage] = useState('');
  // state: sign up
  const [signUpErrorMessage, setSignUpErrorMessage] = useState('');
  // state: movies
  const [appMovies, setAppMovies] = useState([]);
  const [allMoviesOptionGender, setAllMoviesOptionGender] = useState('');
  const [allMoviesOptionSort, setAllMoviesOptionSort] = useState('asc');

  useEffect(() => {
    const params = {
      gender: allMoviesOptionGender,
      sort: allMoviesOptionSort,
    };
    apiMovies.getMoviesFromApi(params).then((response) => {
      setAppMovies(response.movies);
    });
  }, [allMoviesOptionGender, allMoviesOptionSort]);

  useEffect(() => {
    if (userId !== '') {
      apiUser.getProfileFromApi(userId).then((response) => {
        setUserName(response.name);
        setUserEmail(response.email);
        setUserPassword(response.password);
      });
    }
  }, [userId]);

  useEffect(() => {
    if (userId !== '') {
      apiUser.getUserMoviesFromApi(userId).then((response) => {
        setUserMovies(response.movies);
      });
    }
  }, [userId]);

  const sendLoginToApi = (loginData) => {
    setLoginErrorMessage('');
    apiUser.sendLoginToApi(loginData).then((response) => {
      if (response.success === true) {
        ls.set('user', response.userId);
        setUserId(response.userId);
        router.redirect('/');
      } else {
        setLoginErrorMessage(response.errorMessage);
      }
    });
  };

  const sendSingUpToApi = (data) => {
    setSignUpErrorMessage('');
    apiUser.sendSingUpToApi(data).then((response) => {
      if (response.success === true) {
        setUserId(response.userId);
        router.redirect('/');
      } else {
        setSignUpErrorMessage(response.errorMessage);
      }
    });
  };

  const sendProfileToApi = (userId, data) => {
    apiUser.sendProfileToApi(userId, data).then(() => {
      // Después de enviar los datos al servidor los volvemos a pedir al servidor para tenerlos actualizados
      apiUser.getProfileFromApi(userId).then((response) => {
        setUserName(response.name);
        setUserEmail(response.email);
        setUserPassword(response.password);
      });
    });
  };

  //4.Manten logada a la usuaria
  const logout = () => {
    router.redirect('/');
    router.reload();
    ls.clear();
  };

  const handleAllMoviesOptions = (data) => {
    if (data.key === 'gender') {
      setAllMoviesOptionGender(data.value);
    } else if (data.key === 'sort') {
      setAllMoviesOptionSort(data.value);
    }
  };

  // render

  return (
    <>
      <Header isUserLogged={!!userId} logout={logout} />
      <Routes>
        <Route
          exact
          path="/"
          element={
            <AllMovies
              movies={appMovies}
              allMoviesOptionGender={allMoviesOptionGender}
              allMoviesOptionSort={allMoviesOptionSort}
              handleAllMoviesOptions={handleAllMoviesOptions}
            />
          }
        />
        <Route path="/my-movies" element={<MyMovies movies={userMovies} />} />

        <Route
          path="/login"
          element={
            <Login
              loginErrorMessage={loginErrorMessage}
              sendLoginToApi={sendLoginToApi}
            />
          }
        />

        <Route
          path="/signup"
          element={
            <SignUp
              signUpErrorMessage={signUpErrorMessage}
              sendSingUpToApi={sendSingUpToApi}
            />
          }
        />

        <Route
          path="/profile"
          element={
            <Profile
              userName={userName}
              userEmail={userEmail}
              userPassword={userPassword}
              userId={userId}
              sendProfileToApi={sendProfileToApi}
            />
          }
        />
      </Routes>
    </>
  );
};

export default App;
