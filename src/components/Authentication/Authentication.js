/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import axios from 'axios';
import App from '../../App';
import Login from '../../views/Login/Login';
import Registration from '../../views/Registration/Registration';

function Authentication() {
    const jwtToken = localStorage.getItem('token');
    
    const [response, setResponse] = useState({});
    const [isLoggedIn, setIsLoggedIn] = useState(jwtToken && true);

    useEffect(() => {
        axios
          .get(`${process.env.REACT_APP_BACKEND_URL}/auth/protected`, {
            headers: { Authorization: `JWT ${jwtToken}` },
          })
          .then(res => {
            setResponse(res.data);
          })
          .catch(err => {
            console.log("You cannot access this page without logging in!");
            setIsLoggedIn(false);
          })
      }, [jwtToken]);

      return (
        <Router>
          {isLoggedIn ? (
            <Routes>
              <Route path='*' element={<App />}/>
            </Routes>
          ) : (
            <Routes>
              <Route path='/login' element={<Login />} />
              <Route path='/registration' element={<Registration />} />
              <Route path='*' element={<Login />}/>
            </Routes>
          )}
        </Router>
      )
}

export default Authentication;