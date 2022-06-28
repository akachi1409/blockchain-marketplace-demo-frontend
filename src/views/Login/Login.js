/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import axios from 'axios';

function Login() {

  let navigate = useNavigate();

  const [response, setResponse] = useState({});
  const [failAlert, setFailAlert] = useState(false);

  function handleFailAlert(event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    setFailAlert(false);
  }

  async function handleSubmit(evt) {
    evt.preventDefault();

    const credentials = {
      username: evt.target.username.value,
      password: evt.target.password.value
    }

    axios
    .post(`${process.env.REACT_APP_BACKEND_URL}/auth/login`, credentials)
    .then((res) => {
      console.log(`Server response: ${JSON.stringify(res.data, null, 0)}`);
      setResponse(res.data);
    })
    .catch(err => {
      console.log(err);
      setFailAlert(true);
    });
  }

  useEffect(() => {
    if (response.success && response.token) {
      console.log(`User successfully logged in: ${response.username}`);
      localStorage.setItem("token", response.token);
      navigate('/');
      navigate(0);
    }
  }, [response]);

  return (
    <>
      <Grid container className="formContainer">
        <Grid item className="formVertical formSurrounds" xs={12} md={12}></Grid>

        <Grid item md={12} className="formMiddle">
          <Grid container height={'100%'} width={'100%'}>

            <Grid item xs={0.5} md={4} className="formLeft formSurrounds"></Grid>

            <Grid item xs={11} md={4} className="formBody">
              <Grid container spacing={4} height={'100%'} alignItems={'center'} justifyContent={'center'}>

                <Grid item className="appLogo" xs={12} md={7}>
                  <img src={require('../../imageResources/logo.png')} alt="MyCryptoPal Logo"/>
                </Grid>

                <Grid item className="entryForm">
                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={3} alignItems={'center'} justifyContent={'center'}>
                      <Grid item xs={12} md={7}>
                        <TextField name='username' id="login-user" className="credentials" label="Username" variant="outlined" InputLabelProps={{shrink: true}} required/>
                      </Grid>

                      <Grid item xs={12} md={7}>
                        <TextField name='password' id="login-pass" className="credentials" label="Password" type={'password'} variant="outlined" InputLabelProps={{shrink: true}} required/>
                      </Grid>

                      <Grid item xs={12}>
                        <Button variant="outlined" size='large' type='submit'>Sign In</Button>
                      </Grid>

                      <Grid item xs={12} className='helperText'>
                        <Button variant="text" size='small' onClick={() => {
                          navigate('/registration');
                        }}>Don't Have An Account? Register Here!</Button>
                      </Grid>
                    </Grid>
                  </form>
                </Grid>
              </Grid>
            </Grid>

            

            <Grid item xs={0.5} md={4} className="formRight formSurrounds"></Grid>

          </Grid>
        </Grid>

        <Grid item className="formVertical formSurrounds" xs={12} md={12}></Grid>
        <Snackbar open={failAlert} autoHideDuration={6000} anchorOrigin={{vertical: 'bottom', horizontal: 'center'}} onClose={handleFailAlert}>
          <Alert onClose={handleFailAlert} severity="error" sx={{width: '100%'}}>
              Invalid Username or Password. Please Try Again.
          </Alert>
        </Snackbar>
      </Grid>
    </>
  );
}

export default Login;